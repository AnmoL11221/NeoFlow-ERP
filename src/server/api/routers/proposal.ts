import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/lib/db";
import { generateProposalScope } from "~/app/actions/generateProposal";

export const proposalRouter = createTRPCRouter({
  listByProject: protectedProcedure
    .input(z.object({ projectId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const items = await prisma.proposal.findMany({
        where: { projectId: input.projectId, project: { userId: ctx.session!.user.id } },
        orderBy: { createdAt: "desc" },
      });
      return items;
    }),

  generateForProject: protectedProcedure
    .input(z.object({ projectId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const project = await prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.session!.user.id },
      });
      if (!project) throw new Error("Project not found");
      const content = await generateProposalScope(project.description);
      const saved = await prisma.proposal.create({ data: { projectId: project.id, content } });
      return saved;
    }),

  save: protectedProcedure
    .input(z.object({ projectId: z.string().min(1), content: z.string().min(20) }))
    .mutation(async ({ input, ctx }) => {
      const project = await prisma.project.findFirst({ where: { id: input.projectId, userId: ctx.session!.user.id } });
      if (!project) throw new Error("Project not found");
      const saved = await prisma.proposal.create({ data: { projectId: input.projectId, content: input.content } });
      return saved;
    }),
});
