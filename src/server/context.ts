import * as trpc from "@trpc/server";
import { setupDb } from "./database";

export const createContext = () => {
  const db = setupDb();

  return {
    db,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
