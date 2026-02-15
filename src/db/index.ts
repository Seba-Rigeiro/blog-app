/**
 * Capa de persistencia MongoDB.
 * Cliente centralizado, colecciones tipadas, índices.
 */

export { getMongoClient, closeMongoClient } from "./client";
export {
  getDb,
  getUsersCollection,
  getArticlesCollection,
} from "./collections";
export { ensureIndexes } from "./indexes";
export {
  createUser,
  createArticle,
  type CreateUserData,
  type CreateArticleData,
} from "./queries";
