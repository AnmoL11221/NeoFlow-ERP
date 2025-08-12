import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { runFreelancerMatchingAgent } from "~/server/agents/matchFreelancers";
import { prisma } from "~/lib/db";

export const matchRouter = createTRPCRouter({
  runForProject: protectedProcedure
    .input(z.object({ projectId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // Ensure the project belongs to the user
      const project = await prisma.project.findFirst({ where: { id: input.projectId, userId: ctx.session!.user.id } });
      if (!project) throw new Error("Project not found");
      const count = await runFreelancerMatchingAgent(input.projectId);
      return { ok: true, recommendations: count };
    }),

  getForProject: protectedProcedure
    .input(z.object({ projectId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const recos = await prisma.projectFreelancerRecommendation.findMany({
        where: { projectId: input.projectId, project: { userId: ctx.session!.user.id } },
        include: { freelancer: true },
        orderBy: { score: "desc" },
      });
      return recos;
    }),

  chatSuggest: protectedProcedure
    .input(z.object({ prompt: z.string().min(10, "Please provide more details (min 10 chars)") }))
    .mutation(async ({ input }) => {
      // Score freelancers using the same routine as the agent without storing
      const freelancers = await prisma.freelancerProfile.findMany();
      const description = input.prompt;

      const base = freelancers.map((f) => ({
        freelancer: f,
        score:
          description.toLowerCase().split(/[,\s]+/).filter(Boolean).reduce((acc, token) => acc + (f.skills.toLowerCase().includes(token) ? 1 : 0), 0) /
            Math.max(1, f.skills.split(",").length) * 0.6 + ((f.rating ?? 4) / 5) * 0.4,
      }));
      const ranked = base.sort((a, b) => b.score - a.score).slice(0, 5);

      // Try OpenAI refinement when available
      let refined = ranked.map((r) => ({ id: r.freelancer.id, score: r.score, rationale: "Good skills fit and strong rating." }));
      try {
        if (process.env.OPENAI_API_KEY) {
          const OpenAI = (await import("openai")).default;
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const prompt = `Given the job description and freelancers (id, name, skills, rating), return JSON array [{id, score (0-1), rationale}]. Be concise.\nJob: ${description}\nFreelancers:\n${ranked
            .map((t) => `- id:${t.freelancer.id}, name:${t.freelancer.name}, skills:${t.freelancer.skills}, rating:${t.freelancer.rating ?? "n/a"}`)
            .join("\n")}`;
          const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a helpful recruiter AI that outputs strict JSON only." },
              { role: "user", content: prompt },
            ],
            temperature: 0.2,
          });
          const text = res.choices[0]?.message?.content ?? "[]";
          refined = JSON.parse(text);
        }
      } catch (_) {}

      const recos = ranked.map((r) => {
        const ai = refined.find((x) => x.id === r.freelancer.id);
        return {
          freelancer: r.freelancer,
          score: ai ? (r.score * 0.5 + ai.score * 0.5) : r.score,
          rationale: ai?.rationale ?? "Strong skills alignment and rating.",
        };
      }).sort((a, b) => b.score - a.score);

      // Provide 3 clarification questions to improve matching
      const questions = [
        "What is your target timeline and budget range?",
        "Do you prefer specific tech stack or tools?",
        "Is this a one-off project or ongoing engagement?",
      ];

      return { recos, questions };
    }),
});
