"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ProposalsPage() {
  const [projectId, setProjectId] = useState<string>("");
  const { data: clients } = api.client.getAll.useQuery({ limit: 50 });
  const items = clients?.items ?? [];
  const projects = items.flatMap((c: any) => (c.projects ?? []).map((p: any) => ({ id: p.id, name: p.name, client: c.name })));

  const listQuery = api.proposal.listByProject.useQuery(projectId ? { projectId } : (undefined as any), { enabled: !!projectId });
  const generateMutation = api.proposal.generateForProject.useMutation({ onSuccess: () => listQuery.refetch() });
  const saveMutation = api.proposal.save.useMutation({ onSuccess: () => listQuery.refetch() });

  const [content, setContent] = useState("");
  useEffect(() => {
    if (listQuery.data && listQuery.data[0]) setContent(listQuery.data[0].content);
  }, [listQuery.data]);

  return (
    <div className="container mx-auto px-6 py-8">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="rounded-md border px-3 py-2">
              <option value="">Select project</option>
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} · {p.client}</option>
              ))}
            </select>
            <button
              disabled={!projectId || generateMutation.isLoading}
              onClick={() => projectId && generateMutation.mutate({ projectId })}
              className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50"
            >
              {generateMutation.isLoading ? "Generating..." : "Generate from description"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Proposal (Markdown)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Key Deliverables, Timeline, Potential Ambiguities..."
              />
              <div className="mt-3 flex gap-2">
                <button
                  disabled={!projectId || !content || saveMutation.isLoading}
                  onClick={() => projectId && saveMutation.mutate({ projectId, content })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {saveMutation.isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Previous versions</div>
              <div className="space-y-2">
                {listQuery.data && listQuery.data.length > 0 ? (
                  listQuery.data.map((p: any) => (
                    <div key={p.id} className="p-3 border rounded-md">
                      <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                      <div className="line-clamp-3 text-sm text-gray-700 mt-1">{p.content}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No proposals yet.</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
