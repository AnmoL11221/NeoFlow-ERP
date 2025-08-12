import { prisma } from "~/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function simpleSkillScore(description: string, skillsCsv: string): number {
  const text = description.toLowerCase();
  const skills = skillsCsv.split(/[,\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const hits = skills.reduce((acc, s) => acc + (text.includes(s) ? 1 : 0), 0);
  return hits / Math.max(1, skills.length);
}

export async function runFreelancerMatchingAgent(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;
  const freelancers = await prisma.freelancerProfile.findMany();

  // Baseline score from keyword overlap
  const baseline = freelancers.map((f) => ({
    freelancer: f,
    score: simpleSkillScore(project.description, f.skills) * 0.6 + (f.rating ?? 4) / 5 * 0.4,
  }));

  // Use OpenAI to refine top candidates
  const top = baseline.sort((a, b) => b.score - a.score).slice(0, 5);

  let aiScores: { id: string; score: number; rationale: string }[] = [];
  try {
    if (process.env.OPENAI_API_KEY) {
      const prompt = `Given the project description and a list of freelancers with skills, rate each freelancer from 0-1 and provide a one sentence rationale. Return JSON array [{id, score, rationale}].\n\nProject: ${project.name}\nDescription: ${project.description}\n\nFreelancers:\n${top
        .map((t) => `- id:${t.freelancer.id}, name:${t.freelancer.name}, skills:${t.freelancer.skills}, rating:${t.freelancer.rating ?? "n/a"}`)
        .join("\n")}`;
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful recruiter AI that outputs strict JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      });
      const text = res.choices[0]?.message?.content ?? "[]";
      aiScores = JSON.parse(text);
    }
  } catch (e) {
    // fall back silently to baseline
  }

  const merged = top.map((t) => {
    const ai = aiScores.find((a) => a.id === t.freelancer.id);
    const score = ai ? (t.score * 0.5 + ai.score * 0.5) : t.score;
    const rationale = ai?.rationale ?? "Good skills fit and strong rating.";
    return { freelancerId: t.freelancer.id, score, rationale };
  });

  // Store recommendations (upsert)
  for (const r of merged) {
    await prisma.projectFreelancerRecommendation.upsert({
      where: { projectId_freelancerId: { projectId, freelancerId: r.freelancerId } as any },
      update: { score: r.score, rationale: r.rationale },
      create: { projectId, freelancerId: r.freelancerId, score: r.score, rationale: r.rationale },
    });
  }

  return merged.length;
}
