import * as z from "zod";
import { mkTsCollection } from "ts-mongo/src";
import { Db } from "mongodb";

export const msgSchema = z.object({
  text: z.string().min(1).max(10000),
  hasImage: z.boolean().optional(),
  createdAt: z.date(),
});

export declare type Msg = z.infer<typeof msgSchema>;

export const msgCollection = (db: Db) => mkTsCollection<Msg>(db, "messages");
