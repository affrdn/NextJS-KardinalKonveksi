"use client";

import { useState, useMemo } from "react";
import {
  Wallet,
  CreditCard,
  Banknote,
  Shirt,
  Loader2,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";

// --- TYPES (Sesuaikan dengan schema Supabase Anda) ---
type OrderItem = {
  quantity: number;
};

type Order = {
  id: string;
  created_at: string;
  current_status: string;
  grand_total: number;
  dp_amount: number;
  remaining_balance: number;
  order_items: OrderItem[];
};

// Helper Format Rupiah
const toRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

export default function ProductionDashboard({ orders }: { orders: Order[] }) {
  // State Filter & Collapse
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().getMonth().toString()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [isOpen, setIsOpen] = useState(true); // Default terbuka

  // --- FILTER LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const date = new Date(order.created_at);
      const orderMonth = date.getMonth().toString();
      const orderYear = date.getFullYear().toString();

      const matchMonth =
        selectedMonth === "all" ? true : orderMonth === selectedMonth;
      const matchYear =
        selectedYear === "all" ? true : orderYear === selectedYear;

      return matchMonth && matchYear;
    });
  }, [orders, selectedMonth, selectedYear]);

  // --- CALCULATION LOGIC ---
  const stats = useMemo(() => {
    return filteredOrders.reduce(
      (acc, order) => {
        // Keuangan
        acc.totalOmset += order.grand_total || 0;
        acc.totalDp += order.dp_amount || 0;
        acc.totalKurang += order.remaining_balance || 0;

        // Produksi (Quantity)
        const orderQty =
          order.order_items?.reduce(
            (sum, item) => sum + (Number(item.quantity) || 0),
            0
          ) || 0;
        acc.totalItems += orderQty;

        // Status Counter
        const status = order.current_status || "pending";
        acc.statusCounts[status] = (acc.statusCounts[status] || 0) + 1;

        // Grouping status untuk ringkasan
        if (["cutting", "production", "packing"].includes(status)) {
          acc.onProcessCount += 1;
        }

        return acc;
      },
      {
        totalOmset: 0,
        totalDp: 0,
        totalKurang: 0,
        totalItems: 0,
        onProcessCount: 0,
        statusCounts: {} as Record<string, number>,
      }
    );
  }, [filteredOrders]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* 1. HEADER (Selalu Muncul) */}
      <div
        className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Analisa Produksi
            </h2>
            {/* <p className="text-xs text-gray-500">
              {isOpen
                ? "Klik untuk menyembunyikan detail"
                : "Klik untuk melihat statistik lengkap"}
            </p> */}
          </div>
        </div>

        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Summary Singkat saat ditutup */}
          {!isOpen && (
            <div className="hidden md:flex gap-4 text-sm mr-4 animate-in fade-in">
              <span className="text-gray-600">
                Omset:{" "}
                <span className="font-bold text-gray-900">
                  {toRupiah(stats.totalOmset)}
                </span>
              </span>
              <span className="text-gray-600">
                Proses:{" "}
                <span className="font-bold text-blue-600">
                  {stats.onProcessCount} Order
                </span>
              </span>
            </div>
          )}

          {/* Tombol Chevron */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. CONTENT BODY (Collapsible) */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          {/* Filter Bar */}
          <div className="flex justify-end gap-2 py-4 mb-2">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 mr-1">
                Periode:
              </span>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-sm border-none focus:ring-0 p-0 text-gray-700 font-medium cursor-pointer"
              >
                <option value="all">Semua Bulan</option>
                <option value="0">Januari</option>
                <option value="1">Februari</option>
                <option value="2">Maret</option>
                <option value="3">April</option>
                <option value="4">Mei</option>
                <option value="5">Juni</option>
                <option value="6">Juli</option>
                <option value="7">Agustus</option>
                <option value="8">September</option>
                <option value="9">Oktober</option>
                <option value="10">November</option>
                <option value="11">Desember</option>
              </select>

              <div className="w-px h-4 bg-gray-300 mx-1"></div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-sm border-none focus:ring-0 p-0 text-gray-700 font-medium cursor-pointer"
              >
                <option value="all">Semua Tahun</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>

          {/* Financial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Wallet size={100} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Total Omset
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {toRupiah(stats.totalOmset)}
                  </h3>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs text-blue-200">
                Total nilai proyek pada periode ini
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-green-300 transition-colors bg-green-50/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Banknote className="w-5 h-5" />
                </div>
                <span className="text-gray-500 text-sm font-medium">
                  Uang Masuk (DP)
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {toRupiah(stats.totalDp)}
              </h3>
              <p className="text-xs text-green-600 font-medium">
                Cashflow tersedia
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-red-300 transition-colors bg-red-50/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-gray-500 text-sm font-medium">
                  Piutang / Sisa
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {toRupiah(stats.totalKurang)}
              </h3>
              <p className="text-xs text-red-500 font-medium">
                Potensi pemasukan
              </p>
            </div>
          </div>

          {/* Production Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1 bg-gray-900 text-white p-5 rounded-xl flex flex-col justify-center items-center text-center shadow-md">
              <Shirt className="w-8 h-8 mb-2 text-gray-400" />
              <h4 className="text-3xl font-bold">{stats.totalItems}</h4>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                Total Pcs Baju
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Pending
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.statusCounts["pending"] || 0}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  Order
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between bg-blue-50/50">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin-slow" />
                <span className="text-xs font-bold text-blue-600 uppercase">
                  Proses
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {stats.onProcessCount}
                <span className="text-sm font-normal text-blue-400 ml-1">
                  Order
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                (Potong, Jahit, Packing)
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Selesai
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.statusCounts["completed"] || 0}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  Order
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
