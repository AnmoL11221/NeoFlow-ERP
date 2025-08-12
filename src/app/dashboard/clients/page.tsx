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
import { useEffect, useState } from "react";

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(id);
  }, [q]);

  const { data, isLoading, isFetching, error, refetch } = api.client.getAll.useQuery({ q: debounced, cursor, limit: 10 });
  const clients = data?.items ?? [];

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const createClient = api.client.create.useMutation({
    onSuccess: () => {
      setShowModal(false);
      setName("");
      setEmail("");
      setCursor(undefined);
      refetch();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
              <p className="text-gray-600 mt-1">Manage your client relationships and contact information</p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search clients"
                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="text-gray-600">Loading clients...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4" />
                  <p className="text-red-600 font-medium">Error loading clients</p>
                  <p className="text-gray-600 text-sm mt-1">{error.message}</p>
                </div>
              </div>
            ) : clients && clients.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100">
                      <TableHead className="font-semibold text-gray-900">Client Name</TableHead>
                      <TableHead className="font-semibold text-gray-900">Email</TableHead>
                      <TableHead className="font-semibold text-gray-900">Projects</TableHead>
                      <TableHead className="font-semibold text-gray-900">Total Value</TableHead>
                      <TableHead className="font-semibold text-gray-900">Created</TableHead>
                      <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-900">
                          <div>
                            <div className="font-semibold">{client.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {client.projects.length} project{client.projects.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{client.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {client.projects.slice(0, 2).map((project) => (
                              <span key={project.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {project.name.substring(0, 20)}...
                              </span>
                            ))}
                            {client.projects.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{client.projects.length - 2} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          ${client.projects.reduce((sum, project) => sum + (Number(project.estimatedCost) || 0), 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-600">{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">View</button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">Edit</button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">No clients found.</div>
            )}

            <div className="flex justify-center mt-6">
              {data?.nextCursor ? (
                <button
                  disabled={isFetching}
                  onClick={() => setCursor(data.nextCursor!)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  {isFetching ? "Loading..." : "Load more"}
                </button>
              ) : (
                <span className="text-sm text-gray-500">End of list</span>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-md border bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">Add Client</div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
              <button
                onClick={() => createClient.mutate({ name, email })}
                disabled={createClient.isLoading || !name || !email}
                className="w-full rounded-md bg-purple-600 text-white py-2.5 hover:bg-purple-700 disabled:opacity-50"
              >
                {createClient.isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 