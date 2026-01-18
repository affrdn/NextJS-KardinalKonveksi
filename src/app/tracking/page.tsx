"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

export default function TrackingSearchPage() {
  const [invoiceId, setInvoiceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId) return;

    setIsLoading(true);
    // Redirect ke halaman detail (Dynamic Route)
    router.push(`/tracking/${invoiceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Cek Status Pesanan
          </h1>
          <p className="text-gray-500 mt-2">
            Masukkan Nomor Invoice anda untuk melacak progress produksi.
          </p>
        </div>

        {/* Form Search */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Contoh: INV-2026-001"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !invoiceId}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mencari...
              </>
            ) : (
              "Lacak Pesanan"
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Kardinal Konveksi v1.0</p>
        </div>
      </div>
    </div>
  );
}
