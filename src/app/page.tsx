import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FadeIn } from "~/components/anim/FadeIn";
import { SlideUp } from "~/components/anim/SlideUp";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">NeoFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <Link href="/dashboard/clients" className="text-gray-600 hover:text-gray-900 transition-colors">
                Clients
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                The AI-Powered
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Freelancer ERP
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Streamline your freelance business with intelligent project management, 
                automated invoicing, and AI-driven insights that help you focus on what matters most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
                >
                  Start Free Trial
                </Link>
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium text-lg"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[0,1,2].map((i) => (
              <SlideUp key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{["10x","50%","24/7"][i]}</div>
                  <div className="text-gray-600">{["Faster Project Scoping","Reduced Admin Time","AI-Powered Insights"][i]}</div>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to scale your freelance business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From project inception to payment collection, we've got you covered with intelligent automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0,1,2,3,4,5].map((i) => (
              <SlideUp key={i} delay={0.1 + i * 0.05}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl">Smart Project Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      AI-powered project scoping, automated timeline generation, and intelligent risk assessment to keep your projects on track.
                    </p>
                    <Link 
                      href="/dashboard/projects" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Learn more →
                    </Link>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your freelance business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of freelancers who are already using NeoFlow ERP to scale their businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-4 border border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors font-medium text-lg"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">NeoFlow</span>
              </div>
              <p className="text-gray-600">
                The AI-powered ERP system designed specifically for freelancers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/projects" className="text-gray-600 hover:text-gray-900">Projects</Link></li>
                <li><Link href="/dashboard/clients" className="text-gray-600 hover:text-gray-900">Clients</Link></li>
                <li><Link href="/dashboard/invoices" className="text-gray-600 hover:text-gray-900">Invoices</Link></li>
                <li><Link href="/dashboard/analytics" className="text-gray-600 hover:text-gray-900">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
                <li><Link href="/api" className="text-gray-600 hover:text-gray-900">API</Link></li>
                <li><Link href="/status" className="text-gray-600 hover:text-gray-900">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2024 NeoFlow ERP. Built with Next.js, TypeScript, tRPC, Prisma, and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
