/**
 * searchRouter: búsqueda server-side por título, texto, autor.
 * Usa índice de texto MongoDB y paginación.
 */

import { ObjectId } from "mongodb";
import { searchArticlesSchema } from "@/schemas/search";
import { getSkipTake } from "@/schemas/pagination";
import { ensureIndexes, getArticlesCollection } from "@/db";
import { publicProcedure, router } from "../init";

function toPublicArticle(doc: {
  _id: ObjectId;
  title: string;
  content: string;
  imageUrl: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    imageUrl: doc.imageUrl,
    authorId: doc.authorId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const searchRouter = router({
  articles: publicProcedure
    .input(searchArticlesSchema)
    .query(async ({ input }) => {
      const articles = await getArticlesCollection();
      const { skip, take } = getSkipTake(input);

      const filter: Record<string, unknown> = {};

      if (input.q.trim()) {
        await ensureIndexes(); // necesario para $text (índice de texto en articles)
        filter.$text = { $search: input.q.trim() };
      }
      if (input.authorId) {
        filter.authorId = input.authorId;
      }

      if (Object.keys(filter).length === 0) {
        return { items: [], nextCursor: undefined };
      }

      const projection = {
        title: 1,
        content: 1,
        imageUrl: 1,
        authorId: 1,
        createdAt: 1,
        updatedAt: 1,
        ...(input.q.trim() ? { score: { $meta: "textScore" } } : {}),
      };
      const cursor = articles
        .find(filter)
        .sort(
          input.q.trim()
            ? { score: { $meta: "textScore" } }
            : { createdAt: -1 },
        )
        .skip(skip)
        .limit(take + 1)
        .project(projection);

      const items = await cursor.toArray();
      const nextCursor = items.length > take ? String(skip + take) : undefined;

      return {
        items: items.slice(0, take).map((d) =>
          toPublicArticle({
            _id: d._id,
            title: d.title,
            content: d.content,
            imageUrl: d.imageUrl,
            authorId: d.authorId,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
          }),
        ),
        nextCursor,
      };
    }),
});
