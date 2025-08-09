"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res?.error || "Invalid credentials");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <button onClick={() => signIn("google")}
              className="w-full rounded-md border border-gray-300 py-2.5 hover:bg-gray-50">
              Continue with Google
            </button>
            <button onClick={() => signIn("github")}
              className="w-full rounded-md border border-gray-300 py-2.5 hover:bg-gray-50">
              Continue with GitHub
            </button>
          </div>
          <div className="relative my-4 text-center text-sm text-gray-500">
            <span className="px-2 bg-white relative z-10">or</span>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-gray-200" />
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gray-900 text-white py-2.5 hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Don&apos;t have an account? <a href="/register" className="text-gray-900 underline">Create one</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}