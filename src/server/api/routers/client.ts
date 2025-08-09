import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
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
      // TODO: Get actual user ID from session when NextAuth is implemented
      // For now, using the demo user ID from seeded data
      const userId = "cmdu8lwww0000s6oe5byj9diz";

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
    // TODO: Get actual user ID from session when NextAuth is implemented
    // For now, using the demo user ID from seeded data
    const userId = "cmdu8lwww0000s6oe5byj9diz";

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