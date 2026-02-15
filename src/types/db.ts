/**
 * Tipos de documentos MongoDB.
 * Alineados con las colecciones Users y Articles.
 */

import type { ObjectId } from "mongodb";

export interface UserDocument {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface ArticleDocument {
  _id: ObjectId;
  title: string;
  content: string;
  imageUrl: string;
  /** ID del autor (Better Auth user.id, string). */
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserId = UserDocument["_id"];
export type ArticleId = ArticleDocument["_id"];
