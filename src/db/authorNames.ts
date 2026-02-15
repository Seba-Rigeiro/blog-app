/**
 * Obtiene nombres de autor por IDs (colección "user" de Better Auth).
 */

import { ObjectId } from "mongodb";
import { getDb } from "./collections";

export async function getAuthorNames(
  authorIds: string[],
): Promise<Map<string, string>> {
  const unique = [...new Set(authorIds)];
  const objectIds = unique
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));
  if (objectIds.length === 0) {
    return new Map(unique.map((id) => [id, id]));
  }
  const db = await getDb();
  const users = await db
    .collection<{ _id: ObjectId; name?: string }>("user")
    .find({ _id: { $in: objectIds } })
    .project({ _id: 1, name: 1 })
    .toArray();
  const map = new Map<string, string>();
  for (const u of users) {
    const idStr = u._id.toString();
    map.set(idStr, u.name?.trim() ? u.name : idStr);
  }
  for (const id of unique) {
    if (!map.has(id)) map.set(id, id);
  }
  return map;
}
