"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Lock, Loader2, LayoutDashboard, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Inisialisasi Supabase Client khusus Browser (Penting agar Cookie terbaca otomatis)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Custom error message agar lebih user friendly
        if (error.message.includes("Invalid login")) {
          throw new Error("Email atau password salah.");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Email belum diverifikasi. Cek inbox atau hubungi admin."
          );
        } else {
          throw error;
        }
      }

      if (data.session) {
        // SUKSES LOGIN
        // 1. Refresh router untuk memastikan middleware mendapat cookie terbaru
        router.refresh();

        // 2. Redirect dengan sedikit delay untuk menghindari race condition
        setTimeout(() => {
          router.push("/admin/orders");
        }, 500);
      } else {
        throw new Error("Sesi tidak ditemukan. Coba lagi.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login.");
      setLoading(false); // Stop loading hanya jika error
    }
    // Note: Jika sukses, biarkan loading true sampai halaman berpindah agar user tidak klik 2x
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-in fade-in zoom-in duration-300">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-200">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Masuk untuk mengelola produksi & order
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5 text-gray-700">
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 font-medium flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="admin@kardinal.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 flex justify-center items-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>

      {/* Footer Copyright */}
      <div className="fixed bottom-6 text-center w-full text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Kardinal Konveksi System.
      </div>
    </div>
  );
}
