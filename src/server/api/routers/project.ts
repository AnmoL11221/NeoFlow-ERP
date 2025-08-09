import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../root";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      // TODO: Get actual user ID from session when NextAuth is implemented
      // For now, using the demo user ID from seeded data
      const userId = "cmdu8lwww0000s6oe5byj9diz";

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
        clientId: z.string().min(1, "Client ID is required"),
      })
    )
    .query(async ({ input }) => {
      const projects = await prisma.project.findMany({
        where: {
          clientId: input.clientId,
        },
        include: {
          client: true,
          invoices: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return projects;
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
    .mutation(async ({ input }) => {
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