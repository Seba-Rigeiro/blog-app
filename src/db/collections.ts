/**
 * Acceso tipado a colecciones MongoDB.
 */

import type { Collection } from "mongodb";
import type { ArticleDocument, UserDocument } from "@/types/db";
import { getMongoClient } from "./client";

const DB_NAME = "blog-app";

export async function getDb() {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getDb();
  return db.collection<UserDocument>("users");
}

export async function getArticlesCollection(): Promise<
  Collection<ArticleDocument>
> {
  const db = await getDb();
  return db.collection<ArticleDocument>("articles");
}
