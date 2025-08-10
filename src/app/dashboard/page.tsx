import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SlideUp } from "~/components/anim/SlideUp";
import { FadeIn } from "~/components/anim/FadeIn";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 13h6V7H4v6zM4 1h6v6H4V1z" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 13h6V7H4v6zM4 1h6v6H4V1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[0,1,2,3].map((i) => (
            <SlideUp key={i} delay={i * 0.05}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{["Total Revenue","Active Projects","Pending Invoices","Total Clients"][i]}</p>
                      <p className="text-2xl font-bold text-gray-900">{["$24,500","8","5","12"][i]}</p>
                      <p className="text-sm mt-1 {i===0?'text-green-600':''}">{["+12% from last month","3 due this week","$8,200 outstanding","2 new this month"][i]}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/projects/new" className="group">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group-hover:border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-900">New Project</p>
                  <p className="text-sm text-gray-600">Create a new project</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/invoices/new" className="group">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group-hover:border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-900">New Invoice</p>
                  <p className="text-sm text-gray-600">Create an invoice</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/clients/new" className="group">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group-hover:border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-900">Add Client</p>
                  <p className="text-sm text-gray-600">Add a new client</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/proposals" className="group">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group-hover:border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-900">AI Proposal</p>
                  <p className="text-sm text-gray-600">Generate proposal</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Projects","Clients","Invoices","AI Proposal Generator","Analytics","Settings"].map((title, i) => (
            <SlideUp key={title} delay={0.05 + i * 0.05}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Quick access to {title.toLowerCase()}.</p>
                  <Link href={`/dashboard/${title.toLowerCase().split(" ")[0]}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Open →
                  </Link>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
        </div>
      </main>
    </div>
  );
} 