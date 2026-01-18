"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Phone, // Import Icon Phone
} from "lucide-react";

type OrderItem = {
  id: string;
  product_name: string;
  category: string;
  quantity: number;
  notes: string;
  price_per_unit: number;
  total_price: number;
};

type OrderHistory = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
};

type Order = {
  id: string;
  order_number: string;
  client_name: string;
  client_phone?: string; // <--- Field Baru (Optional)
  grand_total: number;
  dp_amount: number;
  remaining_balance: number;
  current_status: string;
  created_at: string;
  estimated_date?: string;
  order_items: OrderItem[];
  order_history: OrderHistory[];
};

type Props = {
  params: Promise<any>;
};

export default function TrackingPage({ params }: Props) {
  const resolvedParams = use(params);
  const orderParam =
    resolvedParams.orderId || resolvedParams.id || resolvedParams.orderNumber;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (!orderParam) return;
    const fetchOrder = async () => {
      try {
        let { data, error: err } = await supabase
          .from("orders")
          .select(`*, order_items(*), order_history(*)`)
          .eq("order_number", orderParam)
          .single();
        if ((err || !data) && orderParam.length > 20) {
          const uuidRes = await supabase
            .from("orders")
            .select(`*, order_items(*), order_history(*)`)
            .eq("id", orderParam)
            .single();
          if (!uuidRes.error) {
            data = uuidRes.data;
            err = null;
          }
        }
        if (err) throw err;
        if (!data) throw new Error("Data tidak ditemukan.");
        setOrder(data as Order);
      } catch (err: any) {
        setError("Pesanan tidak ditemukan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderParam]);

  useEffect(() => {
    if (order)
      document.title = `Invoice-${order.order_number}-${order.client_name}`;
  }, [order]);

  const toRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper untuk sensor nomor HP
  const maskPhone = (phone?: string) => {
    if (!phone || phone.length < 8) return "-";
    // Tampilkan 4 digit awal, sensor tengah, tampilkan 3 digit akhir
    return phone.substring(0, 4) + "****" + phone.substring(phone.length - 3);
  };

  const statusLabels: Record<string, string> = {
    pending: "Menunggu Konfirmasi",
    confirmed: "Dikonfirmasi",
    cutting: "Proses Potong",
    production: "Proses Jahit",
    packing: "Packing",
    completed: "Selesai",
  };
  const statusSteps = [
    "pending",
    "confirmed",
    "cutting",
    "production",
    "packing",
    "completed",
  ];
  const currentStepIndex = statusSteps.indexOf(
    order?.current_status || "pending"
  );
  const progressPercent = ((currentStepIndex + 1) / statusSteps.length) * 100;
  const handlePrint = () => window.print();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  if (error || !order)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-12 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto print:hidden">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/tracking"
            className="flex items-center text-gray-500 hover:text-blue-600 font-medium transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Utama
          </Link>
        </div>

        {/* STATUS CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6 overflow-hidden">
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-gray-500 uppercase">
                Status Pesanan
              </span>
              <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-100">
                {statusLabels[order.current_status]}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center mb-6">
            {statusSteps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[10px] md:text-xs font-medium ${
                      isActive ? "text-blue-700" : "text-gray-400"
                    }`}
                  >
                    {statusLabels[step].replace(/^[^\s]+\s/, "")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* --- BAGIAN ESTIMASI --- */}
          {order.estimated_date ? (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between bg-blue-50/60 p-5 rounded-xl border-blue-100">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm border border-blue-100">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">
                    Estimasi Selesai Pengerjaan
                  </p>
                  <h4 className="text-lg font-bold text-gray-800">
                    {formatDate(order.estimated_date)}
                  </h4>
                </div>
              </div>

              {order.current_status !== "completed" &&
                order.current_status !== "cancelled" && (
                  <div className="mt-3 md:mt-0 md:text-right w-full md:w-auto">
                    <span className="inline-block bg-white text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 shadow-sm">
                      {new Date(order.estimated_date) >= new Date()
                        ? `${Math.ceil(
                            (new Date(order.estimated_date).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} Hari Lagi`
                        : "Hari ini / Lewat Jadwal"}
                    </span>
                  </div>
                )}
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-gray-400 text-xs italic">
              Estimasi tanggal selesai belum ditentukan oleh admin.
            </div>
          )}
        </div>

        {/* INVOICE CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="p-8 bg-gray-900 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Invoice Pemesanan
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  #{order.order_number}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Total Pembayaran
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {toRupiah(order.grand_total)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-8 text-gray-800">
            <div className="flex justify-between border-b border-gray-100 pb-6 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                  Pelanggan
                </p>
                <h3 className="text-lg font-bold">{order.client_name}</h3>

                {/* TAMPILAN WHATSAPP SENSOR */}
                {order.client_phone && (
                  <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-mono tracking-wide">
                      {maskPhone(order.client_phone)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                  Tanggal
                </p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="text-left py-3 font-medium">Item</th>
                    <th className="text-center py-3 font-medium">Qty</th>
                    <th className="text-right py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4">
                        <p className="font-bold text-gray-800">
                          {item.product_name}
                        </p>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 text-center font-bold">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right font-bold text-gray-800">
                        {toRupiah(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{toRupiah(order.grand_total)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-blue-600 font-medium">
                <span>DP / Uang Muka</span>
                <span>- {toRupiah(order.dp_amount)}</span>
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Sisa Pembayaran</span>
                <span
                  className={`text-xl font-bold ${
                    order.remaining_balance > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {toRupiah(order.remaining_balance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handlePrint}
            className="flex cursor-pointer items-center gap-2 bg-gray-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-black transition-all"
          >
            <Printer className="w-5 h-5" /> Cetak / Simpan PDF
          </button>
        </div>

        {/* COLLAPSIBLE HISTORY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-full flex justify-between items-center p-6 md:p-8 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" /> Riwayat Pesanan
            </h3>
            {isHistoryOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {isHistoryOpen && (
            <div className="p-6 md:p-8 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
              {order.order_history && order.order_history.length > 0 ? (
                <div className="border-l-2 border-gray-100 ml-3 space-y-8 mt-4">
                  {order.order_history
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((history, idx) => (
                      <div key={idx} className="relative pl-8">
                        <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-4 border-blue-100 shadow-sm"></span>
                        <h4 className="font-bold text-gray-800">
                          {history.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {history.description}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {new Date(history.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4 italic">
                  Belum ada riwayat tercatat.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PRINT LAYOUT A5 */}
      <div
        className="fixed -top-[9999px] left-0 w-[210mm] bg-white p-10 print:static print:w-full print:p-0"
        style={{ color: "#000000", backgroundColor: "#ffffff", height: "auto" }}
      >
        <div
          className="pb-4 mb-6 flex justify-between items-end"
          style={{ borderBottom: "2px solid #000000" }}
        >
          <div>
            <h1
              className="text-3xl font-bold uppercase tracking-tight mb-1"
              style={{ color: "#000000" }}
            >
              INVOICE
            </h1>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: "#4b5563" }}
            >
              KARDINAL KONVEKSI
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-xs font-bold uppercase"
              style={{ color: "#6b7280" }}
            >
              Nomor Order
            </p>
            <p
              className="text-lg font-bold font-mono"
              style={{ color: "#000000" }}
            >
              {order.order_number}
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-8 text-sm">
          <div className="w-1/2">
            <p
              className="text-[10px] font-bold uppercase mb-1"
              style={{ color: "#6b7280" }}
            >
              Kepada
            </p>
            <h3 className="text-base font-bold" style={{ color: "#000000" }}>
              {order.client_name}
            </h3>
            {order.client_phone && (
              <p className="text-xs mt-1" style={{ color: "#4b5563" }}>
                {maskPhone(order.client_phone)}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: "#4b5563" }}>
              Status: {statusLabels[order.current_status]}
            </p>
          </div>
          <div className="w-1/2 text-right">
            <p
              className="text-[10px] font-bold uppercase mb-1"
              style={{ color: "#6b7280" }}
            >
              Tanggal
            </p>
            <p className="text-base font-medium" style={{ color: "#000000" }}>
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid #000000" }}>
                <th
                  className="py-2 text-left font-bold uppercase text-xs"
                  style={{ color: "#000000" }}
                >
                  Deskripsi
                </th>
                <th
                  className="py-2 text-center font-bold uppercase text-xs w-20"
                  style={{ color: "#000000" }}
                >
                  Qty
                </th>
                <th
                  className="py-2 text-right font-bold uppercase text-xs w-32"
                  style={{ color: "#000000" }}
                >
                  Harga
                </th>
                <th
                  className="py-2 text-right font-bold uppercase text-xs w-32"
                  style={{ color: "#000000" }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.order_items?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td className="py-3 pr-2 align-top">
                    <p
                      className="font-bold text-sm"
                      style={{ color: "#000000" }}
                    >
                      {item.product_name}
                    </p>
                    <p className="text-xs" style={{ color: "#4b5563" }}>
                      {item.category} {item.notes && `• ${item.notes}`}
                    </p>
                  </td>
                  <td
                    className="py-3 text-center align-top font-medium"
                    style={{ color: "#000000" }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    className="py-3 text-right align-top font-mono text-sm"
                    style={{ color: "#000000" }}
                  >
                    {toRupiah(item.price_per_unit)}
                  </td>
                  <td
                    className="py-3 text-right align-top font-bold font-mono text-sm"
                    style={{ color: "#000000" }}
                  >
                    {toRupiah(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="flex justify-end pt-4"
          style={{ borderTop: "1px solid #000000" }}
        >
          <div className="w-1/2">
            <div
              className="flex justify-between py-1 text-xs"
              style={{ color: "#374151" }}
            >
              <span>Subtotal</span>
              <span className="font-mono">{toRupiah(order.grand_total)}</span>
            </div>
            <div
              className="flex justify-between py-1 text-xs pb-2 mb-2"
              style={{ color: "#374151", borderBottom: "1px solid #e5e7eb" }}
            >
              <span>DP (Dibayar)</span>
              <span className="font-mono">- {toRupiah(order.dp_amount)}</span>
            </div>
            <div className="flex justify-between py-3 items-center">
              <span
                className="font-bold text-sm uppercase"
                style={{ color: "#000000" }}
              >
                Sisa Tagihan
              </span>
              <span
                className="font-bold text-xl font-mono"
                style={{ color: "#000000" }}
              >
                {toRupiah(order.remaining_balance)}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "60px",
            paddingTop: "20px",
            textAlign: "center",
            borderTop: "1px solid #d1d5db",
          }}
        >
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "#6b7280", marginBottom: "4px" }}
          >
            Terima kasih atas kepercayaan Anda
          </p>
          <p className="text-[10px]" style={{ color: "#9ca3af" }}>
            Dokumen ini dihasilkan secara otomatis oleh komputer.
          </p>
        </div>
      </div>
      <style jsx global>{`
        @media print {
          @page {
            margin: 15mm;
            size: auto;
          }
          body {
            margin: 0;
            background: white;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
