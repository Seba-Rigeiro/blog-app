/**
 * Parsea un string a ObjectId de MongoDB.
 * Lanza TRPCError BAD_REQUEST si el id no es válido.
 */

import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";

export function parseObjectId(id: string, message = "ID inválido"): ObjectId {
  try {
    return new ObjectId(id);
  } catch {
    throw new TRPCError({ code: "BAD_REQUEST", message });
  }
}
