import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import UserMenu from "@/components/admin/UserMenu"; // <--- Import Komponen Baru

// --- Server Component ---
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-800 text-lg">
            Kardinal Konveksi
          </span>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link
            href="/admin/analytics"
            className=" font-medium  hover:text-blue-600 transition-colors"
          >
            Analytics
          </Link>

          <Link
            href="/admin/orders"
            className=" font-medium  hover:text-blue-600 transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/tracking"
            className=" font-medium  hover:text-blue-600 transition-colors"
          >
            Tracking
          </Link>
          <div className="h-6 w-px bg-gray-200"></div>

          {/* User Profile Dropdown (Client Component) */}
          <UserMenu displayName={displayName} />
        </div>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}
