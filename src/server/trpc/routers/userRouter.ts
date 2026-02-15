/**
 * userRouter: autores y conteo de artículos (Home CMS).
 */

import { ObjectId } from "mongodb";
import { router } from "../init";
import { getDb, getArticlesCollection } from "@/db";
import { publicProcedure } from "../init";

/** Usuario tal como lo guarda Better Auth en la colección "user" (_id = ObjectId). */
interface AuthUserDoc {
  _id: ObjectId;
  name?: string;
}

export const userRouter = router({
  /** Lista autores con nombre y cantidad de artículos (para Home CMS). */
  getAuthorsWithArticleCount: publicProcedure.query(async () => {
    const articles = await getArticlesCollection();
    const cursor = articles.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$authorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const list = await cursor.toArray();
    const authorIds = list.map((row) => row._id);
    if (authorIds.length === 0) return [];

    const objectIds = authorIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    if (objectIds.length === 0) {
      return list.map((row) => ({
        authorId: row._id,
        authorName: row._id,
        articleCount: row.count,
      }));
    }

    const db = await getDb();
    const usersColl = db.collection<AuthUserDoc>("user");
    const users = await usersColl
      .find({ _id: { $in: objectIds } })
      .project({ _id: 1, name: 1 })
      .toArray();
    const nameById = new Map<string, string>();
    for (const u of users) {
      const idStr = u._id.toString();
      nameById.set(idStr, u.name?.trim() ? u.name : idStr);
    }

    return list.map((row) => ({
      authorId: row._id,
      authorName: nameById.get(row._id) ?? row._id,
      articleCount: row.count,
    }));
  }),
});
