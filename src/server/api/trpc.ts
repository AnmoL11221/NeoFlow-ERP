import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export interface SessionShape {
  user: { id: string; email: string; name: string | null };
}

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const session = await getServerSession(authOptions);
  const normalized = session
    ? ({ user: { id: (session.user as any).id as string, email: session.user!.email!, name: session.user!.name ?? null } } as SessionShape)
    : null;
  return { session: normalized };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new Error("Not authenticated");
  return next({ ctx: { ...ctx, session: ctx.session } });
});