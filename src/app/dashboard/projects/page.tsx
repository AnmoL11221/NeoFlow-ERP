"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/client";
import { SlideUp } from "~/components/anim/SlideUp";
import { FadeIn } from "~/components/anim/FadeIn";
import { useState } from "react";

export default function ProjectsPage() {
  const sampleClientId = "client-1";
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching, error } = api.project.getAllByClient.useQuery({
    clientId: sampleClientId,
    limit: 10,
    cursor,
  });
  const projects = data?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const matchMutation = api.match.runForProject.useMutation();
  const { data: recos, refetch: refetchRecos } = api.match.getForProject.useQuery(
    selectedProjectId ? { projectId: selectedProjectId } : (undefined as any),
    { enabled: !!selectedProjectId }
  );
  const shortlistMutation = api.match.shortlist.useMutation({ onSuccess: () => refetchRecos() });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <SlideUp>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600 mt-1">Manage your projects and track their progress</p>
              </div>
              <div className="flex items-center space-x-4">
                {selectedProjectId && (
                  <button
                    onClick={async () => { await matchMutation.mutateAsync({ projectId: selectedProjectId }); refetchRecos(); }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    {matchMutation.isLoading ? "Matching..." : "Find Freelancers"}
                  </button>
                )}
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">Search</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">New Project</button>
              </div>
            </div>
          </SlideUp>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <SlideUp>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">All Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <FadeIn>
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Loading projects...</span>
                    </div>
                  </div>
                </FadeIn>
              ) : error ? (
                <FadeIn>
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4" />
                      <p className="text-red-600 font-medium">Error loading projects</p>
                      <p className="text-gray-600 text-sm mt-1">{error.message}</p>
                    </div>
                  </div>
                </FadeIn>
              ) : projects.length > 0 ? (
                <FadeIn>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100">
                          <TableHead className="font-semibold text-gray-900">Project Name</TableHead>
                          <TableHead className="font-semibold text-gray-900">Client</TableHead>
                          <TableHead className="font-semibold text-gray-900">Status</TableHead>
                          <TableHead className="font-semibold text-gray-900">Estimated Cost</TableHead>
                          <TableHead className="font-semibold text-gray-900">Created</TableHead>
                          <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project, idx) => (
                          <SlideUp key={project.id} delay={idx * 0.03}>
                            <TableRow className={`hover:bg-gray-50 transition-colors ${selectedProjectId === project.id ? 'ring-2 ring-purple-200' : ''}`} onClick={() => setSelectedProjectId(project.id)}>
                              <TableCell className="font-medium text-gray-900">
                                <div>
                                  <div className="font-semibold">{project.name}</div>
                                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description.substring(0, 60)}...</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600">{project.client?.name || 'Unknown Client'}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : project.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                }`}>{project.status}</span>
                              </TableCell>
                              <TableCell className="text-gray-600">{project.estimatedCost ? `$${Number(project.estimatedCost).toLocaleString()}` : 'Not set'}</TableCell>
                              <TableCell className="text-gray-600">{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2"><button className="p-1 text-purple-600" onClick={(e) => { e.stopPropagation(); setSelectedProjectId(project.id); }}>Recommend</button></div>
                              </TableCell>
                            </TableRow>
                          </SlideUp>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-center mt-6">
                    {data?.nextCursor ? (
                      <button disabled={isFetching} onClick={() => setCursor(data.nextCursor!)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">{isFetching ? "Loading..." : "Load more"}</button>
                    ) : (
                      <span className="text-sm text-gray-500">No more projects</span>
                    )}
                  </div>

                  {selectedProjectId && recos && (
                    <div className="mt-10">
                      <h2 className="text-xl font-semibold mb-3">Recommended Freelancers</h2>
                      <ul className="space-y-3">
                        {recos.map((r: any) => (
                          <li key={r.id} className="p-4 border rounded-md bg-white flex items-start justify-between">
                            <div>
                              <div className="font-medium">{r.freelancer.name} <span className="text-sm text-gray-500">· {r.freelancer.skills}</span></div>
                              <div className="text-sm text-gray-600 mt-1">{r.rationale}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-semibold">Score: {r.score.toFixed(2)}</div>
                              <button
                                onClick={() => shortlistMutation.mutate({ projectId: selectedProjectId, freelancerId: r.freelancerId, value: !r.shortlisted })}
                                className={`px-3 py-1 rounded-md text-sm ${r.shortlisted ? 'bg-green-600 text-white' : 'border'}`}
                              >
                                {r.shortlisted ? 'Shortlisted' : 'Shortlist'}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </FadeIn>
              ) : (
                <FadeIn>
                  <div className="text-center py-12">No projects found.</div>
                </FadeIn>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </main>
    </div>
  );
} 