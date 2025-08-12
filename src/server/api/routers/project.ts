import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/lib/db";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().min(1, "Project description is required"),
        clientId: z.string().min(1, "Client ID is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;

      const project = await prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          clientId: input.clientId,
          userId: userId,
        },
        include: {
          client: true,
        },
      });

      return project;
    }),

  getAllByClient: protectedProcedure
    .input(
      z.object({
        clientId: z.string().min(1),
        status: z.enum(["PROPOSED","ACTIVE","COMPLETED","PAUSED"]).nullish(),
        cursor: z.string().nullish(),
        limit: z.number().int().min(1).max(100).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;
      const { clientId, status, limit, cursor } = input;
      const items = await prisma.project.findMany({
        where: { clientId, userId, ...(status ? { status } : {}) },
        include: { client: true, invoices: true },
        orderBy: { createdAt: "desc" },
        take: (limit ?? 20) + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > (limit ?? 20)) {
        const next = items.pop();
        nextCursor = next?.id;
      }
      return { items, nextCursor };
    }),

  getById: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, "Project ID is required"),
      })
    )
    .query(async ({ input }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        include: {
          client: true,
          invoices: true,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, "Project ID is required"),
        status: z.enum(["PROPOSED", "ACTIVE", "COMPLETED", "PAUSED"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;
      const project = await prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          status: input.status,
        },
        include: {
          client: true,
        },
      });

      return project;
    }),
}); 