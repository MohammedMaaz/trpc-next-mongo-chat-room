import * as z from "zod";
import { mkTsCollection, TsCollection } from "ts-mongo/dist/src";
import { Db } from "mongodb";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/pages/api/trpc/[trpc]";

export const msgSchema = z.object({
  text: z.string().min(1, "text is required"),
  hasImage: z.boolean().optional(),
  createdAt: z.date(),
});

export declare type Msg = z.infer<typeof msgSchema>;
export declare type MsgRouter = inferRouterOutputs<AppRouter>["msg"];
export declare type MsgListItem = MsgRouter["list"]["list"][number];

export const msgCollection = (db: Db): TsCollection<Msg> =>
  mkTsCollection<Msg>(db, "messages");
