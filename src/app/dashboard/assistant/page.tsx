"use client";

import { useState } from "react";
import { api } from "~/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FadeIn } from "~/components/anim/FadeIn";
import { SlideUp } from "~/components/anim/SlideUp";

export default function AssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [query, setQuery] = useState<string | null>(null);
  const mutation = api.match.chatSuggest.useMutation();

  return (
    <div className="container mx-auto px-6 py-8">
      <SlideUp>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Talent Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Describe your project or task. We’ll suggest the best freelancers.</p>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., Build a Next.js app with tRPC, Prisma, and Tailwind. Integrate Stripe and deploy to Vercel."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="mt-3 flex justify-end">
              <button
                disabled={mutation.isLoading || prompt.trim().length < 10}
                onClick={async () => {
                  setQuery(prompt);
                  await mutation.mutateAsync({ prompt });
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {mutation.isLoading ? "Thinking..." : "Find freelancers"}
              </button>
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {mutation.data && (
        <FadeIn>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Top recommendations</h2>
            <ul className="space-y-3">
              {mutation.data.recos.map((r: any) => (
                <li key={r.freelancer.id} className="p-4 border rounded-md bg-white flex items-start justify-between">
                  <div>
                    <div className="font-medium">{r.freelancer.name} <span className="text-sm text-gray-500">· {r.freelancer.skills}</span></div>
                    <div className="text-sm text-gray-600 mt-1">{r.rationale}</div>
                  </div>
                  <div className="text-sm font-semibold">Score: {r.score.toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="font-semibold">To get even better matches</h3>
              <ul className="list-disc pl-6 text-gray-600 mt-2">
                {mutation.data.questions.map((q: string) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
