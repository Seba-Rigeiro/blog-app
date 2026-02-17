/**
 * Índices MongoDB para queries eficientes.
 *
 * - ensureIndexes(): crea/verifica todos los índices (varios round-trips a MongoDB).
 * - ensureIndexesOnce(): igual pero solo ejecuta una vez por proceso.
 */

import { getArticlesCollection, getUsersCollection } from "./collections";

let indexesPromise: Promise<void> | null = null;

/** Ejecuta ensureIndexes una sola vez por proceso. */
export async function ensureIndexesOnce(): Promise<void> {
  if (indexesPromise === null) {
    indexesPromise = ensureIndexes();
  }
  return indexesPromise;
}

export async function ensureIndexes(): Promise<void> {
  const users = await getUsersCollection();
  const articles = await getArticlesCollection();

  await users.createIndex({ email: 1 }, { unique: true });
  await users.createIndex({ createdAt: -1 });

  await articles.createIndex({ authorId: 1, createdAt: -1 });
  await articles.createIndex({ updatedAt: -1 });
}
