/**
 * Índices MongoDB para queries eficientes y búsqueda.
 * Se ejecutan al arranque o bajo demanda (ensureIndexes).
 */

import { getArticlesCollection, getUsersCollection } from "./collections";

export async function ensureIndexes(): Promise<void> {
  const users = await getUsersCollection();
  const articles = await getArticlesCollection();

  await users.createIndex({ email: 1 }, { unique: true });
  await users.createIndex({ createdAt: -1 });

  await articles.createIndex({ authorId: 1, createdAt: -1 });
  await articles.createIndex({ updatedAt: -1 });
  await articles.createIndex(
    { title: "text", content: "text" },
    { name: "articles_search", default_language: "spanish" },
  );
}
