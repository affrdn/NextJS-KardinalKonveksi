import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Package,
  Plus,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import OrderTable from "@/components/admin/OrderTable";
import ProductionDashboard from "@/components/admin/ProductionDashboard";

// Agar data selalu fresh setiap kali halaman dibuka (Server Side Rendering)
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // 1. Fetch Orders + Items (Relasi) dari Supabase
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_name,
        category,
        quantity, 
        notes,
        total_price
      )
    `
    )
    .order("created_at", { ascending: false }); // Urutkan terbaru di atas

  // Handle Error Koneksi
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-500 mb-6 text-sm">{error.message}</p>
          <a
            href="/admin/orders"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Coba Lagi
          </a>
        </div>
      </div>
    );
  }

  // Hitung Ringkasan Statistik Sederhana
  const stats = {
    totalOrders: orders?.length || 0,
    totalRevenue:
      orders?.reduce((acc, curr) => acc + (curr.grand_total || 0), 0) || 0,
    activeProduction:
      orders?.filter((o) =>
        ["cutting", "production", "packing"].includes(o.current_status)
      ).length || 0,
  };

  // Helper Format Rupiah untuk Stats
  const formatMoney = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(n);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Dashboard Produksi
            </h1>
            <p className="text-gray-500 mt-1">
              Pantau pesanan masuk dan status pengerjaan.
            </p>
          </div>

          <Link
            href="/admin/orders/new"
            className="group flex items-center bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            <span className="font-semibold">Buat Pesanan Baru</span>
          </Link>
        </div>

        {/* STATS CARDS (Opsional: Ringkasan Cepat) */}
        <ProductionDashboard orders={orders || []} />
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Pesanan</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalOrders}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Omset Masuk</p>
              <h3 className="text-2xl font-bold text-gray-800">
                Rp {formatMoney(stats.totalRevenue)}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Sedang Produksi
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.activeProduction}
              </h3>
            </div>
          </div>
        </div> */}

        {/* TABEL DATA UTAMA */}
        {orders && orders.length > 0 ? (
          <OrderTable orders={orders as any} />
        ) : (
          // Empty State jika belum ada data sama sekali
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Belum ada pesanan
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Data pesanan yang Anda buat akan muncul di sini lengkap dengan
              status produksinya.
            </p>
            <Link
              href="/admin/orders/new"
              className="inline-flex items-center text-blue-600 font-bold hover:underline"
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah Pesanan Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
