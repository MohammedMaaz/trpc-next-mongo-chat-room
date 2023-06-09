import { Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;

export const setupDb = (): Db => {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL ?? "");
  }

  return client.db(process.env.MONGO_DB_NAME ?? "");
};
