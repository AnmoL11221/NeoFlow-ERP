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
import { useState } from "react";

export default function InvoicesPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching, error, refetch } = api.invoice.getAll.useQuery({ status: status as any, cursor, limit: 10 });
  const invoices = data?.items ?? [];

  const num = (v: any) => Number(v ?? 0);

  const getTotalAmount = () => invoices.reduce((sum: number, invoice: any) => sum + num(invoice.amount), 0);
  const getPaidAmount = () => invoices.filter((i: any) => i.status === 'PAID').reduce((sum: number, i: any) => sum + num(i.amount), 0);
  const getOverdueAmount = () => {
    const now = new Date();
    return invoices
      .filter((i: any) => i.status === 'OVERDUE' || (i.status === 'SENT' && new Date(i.dueDate) < now))
      .reduce((sum: number, i: any) => sum + num(i.amount), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600 mt-1">Track your invoices and payments</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={status ?? ""}
                onChange={(e) => { setCursor(undefined); setStatus(e.target.value || undefined); refetch(); }}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">All</option>
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                New Invoice
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
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${getTotalAmount().toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${getPaidAmount().toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${getOverdueAmount().toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="text-gray-600">Loading invoices...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4" />
                  <p className="text-red-600 font-medium">Error loading invoices</p>
                  <p className="text-gray-600 text-sm mt-1">{error.message}</p>
                </div>
              </div>
            ) : invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100">
                      <TableHead className="font-semibold text-gray-900">Invoice #</TableHead>
                      <TableHead className="font-semibold text-gray-900">Client</TableHead>
                      <TableHead className="font-semibold text-gray-900">Project</TableHead>
                      <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
                      <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice: any) => (
                      <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-900">
                          <div>
                            <div className="font-semibold">{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-600 mt-1">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{invoice.project?.client?.name || 'Unknown Client'}</TableCell>
                        <TableCell className="text-gray-600">{invoice.project?.name || 'Unknown Project'}</TableCell>
                        <TableCell className="text-gray-900 font-semibold">${num(invoice.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">View</button>
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">Export</button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">No invoices found.</div>
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
    </div>
  );
} 