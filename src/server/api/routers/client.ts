import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/lib/db";

export const clientRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Client name is required"),
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;

      const client = await prisma.client.create({
        data: {
          name: input.name,
          email: input.email,
          userId: userId,
        },
      });

      return client;
    }),

  getAll: protectedProcedure
    .input(
      z.object({ cursor: z.string().nullish(), limit: z.number().int().min(1).max(100).optional() }).optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session!.user.id;
      const limit = input?.limit ?? 20;
      const cursor = input?.cursor ?? undefined;

      const clients = await prisma.client.findMany({
        where: { userId },
        include: {
          projects: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined = undefined;
      if (clients.length > limit) {
        const next = clients.pop();
        nextCursor = next?.id;
      }

      return { items: clients, nextCursor };
    }),
}); 