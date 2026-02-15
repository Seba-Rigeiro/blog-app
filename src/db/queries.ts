/**
 * Queries para crear datos en las colecciones.
 * Usadas por los routers tRPC y por scripts de seed.
 */

import { ObjectId } from "mongodb";
import type { CreateArticleInput } from "@/schemas/articles";
import type { ArticleDocument, UserDocument } from "@/types/db";
import { getArticlesCollection, getUsersCollection } from "./collections";

/** Datos necesarios para crear un usuario en la colección users */
export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

/**
 * Crea un usuario en la colección users.
 * El password debe llegar ya hasheado (ej. con bcrypt o el mismo que usa Better Auth).
 */
export async function createUser(data: CreateUserData): Promise<UserDocument> {
  const users = await getUsersCollection();
  const now = new Date();
  const doc: UserDocument = {
    _id: new ObjectId(),
    email: data.email,
    passwordHash: data.passwordHash,
    firstName: data.firstName,
    lastName: data.lastName,
    createdAt: now,
  };
  await users.insertOne(doc);
  return doc;
}

/** Datos necesarios para crear un artículo (input de negocio + autor) */
export interface CreateArticleData extends CreateArticleInput {
  authorId: string;
}

/**
 * Crea un artículo en la colección articles.
 */
export async function createArticle(
  data: CreateArticleData,
): Promise<ArticleDocument> {
  const articles = await getArticlesCollection();
  const now = new Date();
  const doc: ArticleDocument = {
    _id: new ObjectId(),
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl ?? "",
    authorId: data.authorId,
    createdAt: now,
    updatedAt: now,
  };
  await articles.insertOne(doc);
  return doc;
}
