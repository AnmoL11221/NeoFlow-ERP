import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session!.user.id;

    const clients = await prisma.client.findMany({
      where: {
        userId: userId,
      },
      include: {
        projects: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return clients;
  }),
}); 