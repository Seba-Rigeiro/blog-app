/**
 * articleRouter: CRUD de artículos con ownership.
 * Capa: input (Zod) -> lógica -> DB.
 */

import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";
import {
  createArticleSchema,
  updateArticleSchema,
  getArticleByIdSchema,
  deleteArticleSchema,
} from "@/schemas/articles";
import { paginationInputSchema, getSkipTake } from "@/schemas/pagination";
import {
  createArticle as dbCreateArticle,
  getArticlesCollection,
  getAuthorNames,
} from "@/db";
import { protectedProcedure, publicProcedure, router } from "../init";

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

export const articleRouter = router({
  create: protectedProcedure
    .input(createArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const doc = await dbCreateArticle({
        ...input,
        authorId: ctx.session.user.id,
      });
      return toPublicArticle(doc);
    }),

  getById: publicProcedure
    .input(getArticleByIdSchema)
    .query(async ({ input }) => {
      const articles = await getArticlesCollection();
      let id: ObjectId;
      try {
        id = new ObjectId(input.id);
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "ID inválido" });
      }
      const doc = await articles.findOne({ _id: id });
      if (!doc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artículo no encontrado",
        });
      }
      return toPublicArticle(doc);
    }),

  list: publicProcedure
    .input(paginationInputSchema)
    .query(async ({ input }) => {
      const articles = await getArticlesCollection();
      const { skip, take } = getSkipTake(input);
      const cursor = articles
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take + 1)
        .project({
          title: 1,
          content: 1,
          imageUrl: 1,
          authorId: 1,
          createdAt: 1,
          updatedAt: 1,
        });
      const items = await cursor.toArray();
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
      };
    }),

  listByAuthor: protectedProcedure
    .input(paginationInputSchema)
    .query(async ({ ctx, input }) => {
      const articles = await getArticlesCollection();
      const { skip, take } = getSkipTake(input);
      const cursor = articles
        .find({ authorId: ctx.session.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take + 1)
        .project({
          title: 1,
          content: 1,
          imageUrl: 1,
          authorId: 1,
          createdAt: 1,
          updatedAt: 1,
        });
      const items = await cursor.toArray();
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
      };
    }),

  update: protectedProcedure
    .input(updateArticleSchema.and(getArticleByIdSchema))
    .mutation(async ({ ctx, input }) => {
      const articles = await getArticlesCollection();
      let id: ObjectId;
      try {
        id = new ObjectId(input.id);
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "ID inválido" });
      }
      const existing = await articles.findOne({ _id: id });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artículo no encontrado",
        });
      }
      if (existing.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No eres el autor" });
      }
      const update: Record<string, unknown> = { updatedAt: new Date() };
      if (input.title !== undefined) update.title = input.title;
      if (input.content !== undefined) update.content = input.content;
      if (input.imageUrl !== undefined) update.imageUrl = input.imageUrl;
      await articles.updateOne({ _id: id }, { $set: update });
      const doc = await articles.findOne({ _id: id });
      return doc ? toPublicArticle(doc) : null;
    }),

  delete: protectedProcedure
    .input(deleteArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const articles = await getArticlesCollection();
      let id: ObjectId;
      try {
        id = new ObjectId(input.id);
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "ID inválido" });
      }
      const existing = await articles.findOne({ _id: id });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artículo no encontrado",
        });
      }
      if (existing.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No eres el autor" });
      }
      await articles.deleteOne({ _id: id });
      return { deleted: true };
    }),
});
