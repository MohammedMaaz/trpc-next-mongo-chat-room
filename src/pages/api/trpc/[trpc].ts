import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/server/context";
import { msgRouter } from "~/server/modules/msg/msg.router";
import { publicProcedure, router } from "~/server/trpc";

const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  msg: msgRouter,
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
