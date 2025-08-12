import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { DashboardSidebar } from "~/components/layout/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}