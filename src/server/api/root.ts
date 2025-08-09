import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { clientRouter } from "./routers/client";
import { invoiceRouter } from "./routers/invoice";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  client: clientRouter,
  invoice: invoiceRouter,
});

export type AppRouter = typeof appRouter; 