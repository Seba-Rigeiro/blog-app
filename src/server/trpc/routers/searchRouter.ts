/**
 * searchRouter: búsqueda server-side por título, texto, autor.
 * Usa $regex para coincidencia parcial (ej. "articul" encuentra "articulo").
 * Paginación. Coste: regex sobre content hace scan; aceptable para blogs pequeños/medianos.
 */

import { ObjectId } from "mongodb";
import { searchArticlesSchema } from "@/schemas/search";
import { getSkipTake } from "@/schemas/pagination";
import { getArticlesCollection, getAuthorNames } from "@/db";
import { publicProcedure, router } from "../init";

/** Escapa caracteres especiales de regex para usar el término como texto literal. */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

      if (input.authorId) {
        filter.authorId = input.authorId;
      }

      const q = input.q.trim();
      if (q) {
        const regex = new RegExp(escapeRegex(q), "i");
        const textCondition = {
          $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
        };
        const andList = (filter.$and as unknown[] | undefined) ?? [];
        andList.push(textCondition);
        filter.$and = andList;
      }

      if (Object.keys(filter).length === 0) {
        return { items: [], nextCursor: undefined, totalCount: 0 };
      }

      const projection = {
        title: 1,
        content: 1,
        imageUrl: 1,
        authorId: 1,
        createdAt: 1,
        updatedAt: 1,
      };
      const [totalCount, items] = await Promise.all([
        articles.countDocuments(filter),
        articles
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(take + 1)
          .project(projection)
          .toArray(),
      ]);
      const nextCursor = items.length > take ? String(skip + take) : undefined;
      const authorIds = [
        ...new Set(items.slice(0, take).map((d) => d.authorId)),
      ];
      const nameByAuthor = await getAuthorNames(authorIds);

      return {
        items: items.slice(0, take).map((d) => ({
          ...toPublicArticle({
            _id: d._id,
            title: d.title,
            content: d.content,
            imageUrl: d.imageUrl,
            authorId: d.authorId,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
          }),
          authorName: nameByAuthor.get(d.authorId) ?? d.authorId,
        })),
        nextCursor,
        totalCount,
      };
    }),
});
