import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { clientRouter } from "./routers/client";
import { invoiceRouter } from "./routers/invoice";
import { matchRouter } from "./routers/match";
import { proposalRouter } from "./routers/proposal";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  client: clientRouter,
  invoice: invoiceRouter,
  match: matchRouter,
  proposal: proposalRouter,
});

export type AppRouter = typeof appRouter; 