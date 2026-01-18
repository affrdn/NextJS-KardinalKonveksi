"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Wallet,
  Loader2,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

// --- COLORS FOR CHARTS ---
const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

// --- HELPERS ---
const toRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalReceivables: 0, // Sisa tagihan (Piutang)
    averageOrderValue: 0,
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Orders
      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .neq("current_status", "cancelled"); // Abaikan yang batal

      if (orderError) throw orderError;

      // 2. Fetch Order Items (Untuk analisa kategori produk)
      const { data: items, error: itemError } = await supabase
        .from("order_items")
        .select("*");

      if (itemError) throw itemError;

      processData(orders, items);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (orders: any[], items: any[]) => {
    // A. HITUNG METRICS UTAMA
    const totalRev = orders.reduce((sum, o) => sum + (o.grand_total || 0), 0);
    const totalReceivables = orders.reduce(
      (sum, o) => sum + (o.remaining_balance || 0),
      0
    );
    const totalOrders = orders.length;

    setMetrics({
      totalRevenue: totalRev,
      totalOrders: totalOrders,
      totalReceivables: totalReceivables,
      averageOrderValue: totalOrders > 0 ? totalRev / totalOrders : 0,
    });

    // B. GRAFIK REVENUE PER BULAN (6 Bulan Terakhir)
    const months: any = {};
    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const monthKey = date.toLocaleString("id-ID", {
        month: "short",
        year: "2-digit",
      });

      if (!months[monthKey]) months[monthKey] = 0;
      months[monthKey] += order.grand_total;
    });

    // Ubah ke array format Recharts
    const chartData = Object.keys(months)
      .map((key) => ({
        name: key,
        total: months[key],
      }))
      .reverse()
      .slice(0, 6)
      .reverse(); // Ambil 6 bulan terakhir
    setRevenueData(chartData);

    // C. KATEGORI PRODUK TERLARIS
    const categories: any = {};
    items.forEach((item) => {
      const cat = item.category || "Lainnya";
      if (!categories[cat]) categories[cat] = 0;
      categories[cat] += item.quantity || 0;
    });

    const pieData = Object.keys(categories).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: categories[key],
    }));
    setCategoryData(pieData);

    // D. STATUS DISTRIBUTION
    const statuses: any = {};
    orders.forEach((order) => {
      const status = order.current_status;
      if (!statuses[status]) statuses[status] = 0;
      statuses[status] += 1;
    });
    // Mapping status biar rapi
    const statusMap = Object.keys(statuses).map((key) => ({
      name: key,
      value: statuses[key],
    }));
    setStatusData(statusMap);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analisa Bisnis</h1>
        <p className="text-gray-500">
          Ringkasan performa keuangan dan produksi.
        </p>
      </div>

      {/* --- 1. KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Omset</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {toRupiah(metrics.totalRevenue)}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span className="font-medium">All Time Revenue</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pesanan</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {metrics.totalOrders}
              </h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-400">
            <span>Pesanan aktif & selesai</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Piutang (Belum Lunas)
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {toRupiah(metrics.totalReceivables)}
              </h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Uang yang harus ditagih ke klien
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Rata-rata Order
              </p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">
                {toRupiah(metrics.averageOrderValue)}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Nilai rata-rata per transaksi
          </div>
        </div>
      </div>

      {/* --- 2. CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE CHART (MAIN) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Tren Pendapatan Bulanan
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip
                  formatter={(value: number) => toRupiah(value)}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY PIE CHART */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Kategori Terlaris
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            Berdasarkan total quantity item terjual
          </p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend Custom */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {categoryData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs text-gray-600"
                >
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. PRODUCTION STATUS --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Distribusi Status Produksi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {statusData.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg text-center">
              <h4 className="text-2xl font-bold text-gray-800">{item.value}</h4>
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
