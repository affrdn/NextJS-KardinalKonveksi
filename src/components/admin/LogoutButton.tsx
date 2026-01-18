"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut, Loader2 } from "lucide-react";
import NProgress from "nprogress"; //

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Inisialisasi Supabase Client (Browser)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async (e: React.MouseEvent) => {
    // 1. PENTING: Mencegah event bubbling agar dropdown tidak langsung menutup
    e.stopPropagation();
    e.preventDefault();
    NProgress.start();
    console.log("Tombol logout diklik..."); // Debugging

    try {
      setLoading(true);

      // 2. Logout dari Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log("Berhasil sign out, redirecting...");

      // 3. Hapus semua cookie secara manual (opsional, untuk safety)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // 4. Redirect Paksa
      window.location.href = "/login";
      // Kita pakai window.location agar refresh total, lebih reliable daripada router.push untuk logout
    } catch (error) {
      console.error("Logout error:", error);
      alert("Gagal logout. Coba lagi.");
      NProgress.done();
    } finally {
      // Tidak perlu setLoading(false) karena halaman akan reload/pindah
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg transition-all text-sm font-medium disabled:opacity-50 text-left"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>{loading ? "Keluar..." : "Keluar"}</span>
    </button>
  );
}
