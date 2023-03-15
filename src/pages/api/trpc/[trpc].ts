import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "~/server/trpc";
import { createContext } from "~/server/context";
import { msgRouter } from "~/server/modules/msg/msg.router";

const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  msg: msgRouter,
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
