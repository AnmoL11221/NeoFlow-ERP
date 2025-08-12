import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/assistant", label: "Assistant" },
];

export function DashboardSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r bg-white">
      <div className="p-4 text-lg font-semibold">NeoFlow</div>
      <nav className="px-2 py-2 space-y-1">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
