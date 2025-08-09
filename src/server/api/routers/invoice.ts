import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const invoiceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        invoiceNumber: z.string().min(1, "Invoice number is required"),
        amount: z.number().positive("Amount must be positive"),
        issueDate: z.date(),
        dueDate: z.date(),
        projectId: z.string().min(1, "Project ID is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session!.user.id;

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: input.invoiceNumber,
          amount: input.amount,
          issueDate: input.issueDate,
          dueDate: input.dueDate,
          projectId: input.projectId,
          userId: userId,
        },
        include: {
          project: {
            include: {
              client: true,
            },
          },
        },
      });

      return invoice;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session!.user.id;

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return invoices;
  }),

  getById: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string().min(1, "Invoice ID is required"),
      })
    )
    .query(async ({ input }) => {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: input.invoiceId,
        },
        include: {
          project: {
            include: {
              client: true,
            },
          },
        },
      });

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      return invoice;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string().min(1, "Invoice ID is required"),
        status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE"]),
      })
    )
    .mutation(async ({ input }) => {
      const invoice = await prisma.invoice.update({
        where: {
          id: input.invoiceId,
        },
        data: {
          status: input.status,
        },
        include: {
          project: {
            include: {
              client: true,
            },
          },
        },
      });

      return invoice;
    }),
}); 