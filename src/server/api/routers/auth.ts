import { createTRPCRouter, protectedProcedure, publicProcedure } from "../root";

export const authRouter = createTRPCRouter({
  me: publicProcedure.query(({ ctx }) => {
    return ctx.session ? ctx.session.user : null
  }),
});