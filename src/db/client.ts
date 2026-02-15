/**
 * Cliente MongoDB centralizado.
 * Patrón singleton compatible con serverless (cached por request/process).
 */

import { MongoClient, type MongoClientOptions } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
};

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI no está definida en el entorno.");
  }
  return uri;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (globalForMongo.mongoClient) {
    return globalForMongo.mongoClient;
  }

  const uri = getMongoUri();
  const options: MongoClientOptions = {
    maxPoolSize: 10,
  };

  const client = new MongoClient(uri, options);
  await client.connect();

  if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClient = client;
  }

  return client;
}

/**
 * Cierra la conexión (útil para tests o shutdown graceful).
 */
export async function closeMongoClient(): Promise<void> {
  if (globalForMongo.mongoClient) {
    await globalForMongo.mongoClient.close();
    globalForMongo.mongoClient = undefined;
  }
}
