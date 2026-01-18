"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronDown, Loader2 } from "lucide-react";
import NProgress from "nprogress"; // 1. IMPORT NPROGRESS

type Props = {
  orderNumber: string;
  initialStatus: string;
  onUpdate: () => void;
};

// Map warna status agar cantik
const statusColors: any = {
  pending: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  confirmed: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  cutting: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  production: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  packing: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  completed: "bg-green-100 text-green-700 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-200",
};

export default function OrderStatusSelect({
  orderNumber,
  initialStatus,
  onUpdate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;

    // 2. MULAI LOADING BAR & STATE LOKAL
    NProgress.start();
    setLoading(true);

    try {
      // 3. Update Supabase
      const { error } = await supabase
        .from("orders")
        .update({ current_status: newStatus })
        .eq("order_number", orderNumber);

      if (error) throw error;

      // Update state lokal
      setStatus(newStatus);

      // Panggil callback parent (untuk refresh tabel & show toast)
      onUpdate();
    } catch (error: any) {
      alert("Gagal update status: " + error.message);
      // Kembalikan ke status lama jika gagal
      e.target.value = status;
    } finally {
      // 4. STOP LOADING BAR
      setLoading(false);
      NProgress.done();
    }
  };

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className={`appearance-none w-full py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold uppercase cursor-pointer transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:opacity-50 ${
          statusColors[status] || "bg-gray-100"
        }`}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cutting">Cutting</option>
        <option value="production">Production</option>
        <option value="packing">Packing</option>
        <option value="completed">Selesai</option>
        <option value="cancelled">Batal</option>
      </select>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60">
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </div>
  );
}
