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

  // Índice de búsqueda por título y contenido.
  // default_language: "none" evita stop words (ej. "otra", "una") y stemming.
  const searchIndexName = "articles_search";
  try {
    await articles.createIndex(
      { title: "text", content: "text" },
      { name: searchIndexName, default_language: "none" },
    );
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "";
    // MongoDB: "An equivalent index already exists with the same name but different options"
    if (!msg.includes("different options") || !msg.includes("already exists"))
      throw err;
    await articles.dropIndex(searchIndexName);
    await articles.createIndex(
      { title: "text", content: "text" },
      { name: searchIndexName, default_language: "none" },
    );
  }
}
