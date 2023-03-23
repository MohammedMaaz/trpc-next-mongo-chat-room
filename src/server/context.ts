import * as trpc from "@trpc/server";
import { Db } from "mongodb";
import { setupDb } from "./database";

export const createContext = (): { db: Db } => {
  const db = setupDb();

  return {
    db,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
