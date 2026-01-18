"use client";

import { useState, useEffect, Fragment } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ExternalLink,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Calculator,
  Shirt,
  Search,
  Filter,
  X,
  Pencil,
  Trash2,
  Wallet,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Bell,
  MessageCircle,
  Phone,
} from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { useRouter, useSearchParams } from "next/navigation";
import NProgress from "nprogress"; // Pastikan huruf besar N

// --- TIPE DATA ---
type OrderItem = {
  id: string;
  product_name: string;
  category: string;
  quantity: number;
  notes: string;
  total_price: number;
};

type Order = {
  id: string;
  order_number: string;
  client_name: string;
  client_phone?: string;
  created_at: string;
  estimated_date?: string;
  current_status: string;
  grand_total: number;
  dp_amount: number;
  remaining_balance: number;
  order_items: OrderItem[];
};

// --- KOMPONEN UI ---
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  isLoading = false,
}: any) => {
  if (!isOpen) return null;
  const isDanger = type === "danger";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="p-6 text-center">
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              isDanger ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}
          >
            {isDanger ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <div className="text-sm text-gray-500 mb-6 leading-relaxed">
            {message}
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-gray-200 transition-all transform active:scale-95 text-sm flex items-center ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              } disabled:opacity-70`}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isDanger ? "Ya, Hapus" : "Ya, Lanjutkan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationToast = ({ show, message, type, onClose }: any) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[100] animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md ${
          type === "success"
            ? "bg-white/95 border-green-200 text-gray-800"
            : type === "update"
            ? "bg-blue-600/95 border-blue-500 text-white"
            : "bg-red-50/95 border-red-200 text-red-800"
        }`}
      >
        <div
          className={`p-1.5 rounded-full ${
            type === "update"
              ? "bg-white/20"
              : type === "success"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {type === "update" ? (
            <Bell className="w-4 h-4" />
          ) : type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
        </div>
        <div className="pr-2">
          <p className="text-sm font-bold">
            {type === "update"
              ? "Update Terdeteksi"
              : type === "success"
              ? "Berhasil"
              : "Gagal"}
          </p>
          <p
            className={`text-xs ${
              type === "update" ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-black/10 rounded-full transition"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// --- HELPERS ---
const toRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
const formatPhone = (phone?: string) => {
  if (!phone) return "-";
  return phone.replace(/(\d{4})(\d{4})(\d{3,})/, "$1-$2-$3");
};

const getEstimationStatus = (estDate?: string, status?: string) => {
  if (!estDate) return null;
  if (status === "completed" || status === "cancelled") return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(estDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0)
    return {
      color: "text-red-700 bg-red-100",
      text: `Telat ${Math.abs(diffDays)} Hari`,
      icon: true,
    };
  if (diffDays === 0)
    return {
      color: "text-orange-700 bg-orange-100",
      text: "Deadline Hari Ini",
      icon: true,
    };
  if (diffDays <= 3)
    return {
      color: "text-yellow-700 bg-yellow-100",
      text: `${diffDays} Hari Lagi`,
      icon: false,
    };
  return {
    color: "text-gray-500 bg-gray-100",
    text: formatDate(estDate),
    icon: false,
  };
};

export default function OrderTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // --- DEFINISI STATE MODAL ---
  type ModalState = {
    isOpen: boolean;
    title: string;
    message: any;
    type: "danger" | "success";
    onConfirm: () => void;
  };

  const defaultModalState: ModalState = {
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
  };

  const [modalConfig, setModalConfig] = useState<ModalState>(defaultModalState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "update";
  }>({ show: false, message: "", type: "success" });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const showToast = (message: string, type: "success" | "error" | "update") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
  };

  // --- TOAST SUKSES DARI NEW ORDER ---
  useEffect(() => {
    if (searchParams.get("success")) {
      setToast({
        show: true,
        message: "Pesanan baru berhasil dibuat!",
        type: "success",
      });
      router.replace("/admin/orders", { scroll: false });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
    }
  }, [searchParams, router]);

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      setIsProcessing(false);
      setModalConfig(defaultModalState);
    }, 300);
  };

  const handleWhatsApp = (order: Order) => {
    if (!order.client_phone) {
      alert("Nomor telepon klien tidak tersedia.");
      return;
    }
    let phone = order.client_phone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.substring(1);
    const invoiceLink = `${window.location.origin}/tracking/${order.order_number}`;
    const message = `Halo Kak *${
      order.client_name
    }* 👋,\n\nBerikut update status pesanan Anda *#${
      order.order_number
    }*.\nStatus saat ini: *${order.current_status.toUpperCase()}*\n\nCek detail & invoice digital disini:\n${invoiceLink}\n\nTerima kasih!`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  useEffect(() => {
    const channel = supabase
      .channel("realtime-orders-table")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          router.refresh();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // --- LOGIC HAPUS ORDER ---
  const clickDelete = (orderId: string) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Pesanan?",
      message:
        "Data yang dihapus permanen tidak dapat dikembalikan. Lanjutkan?",
      type: "danger",
      onConfirm: async () => {
        NProgress.start(); // 1. MULAI LOADING BAR
        setIsProcessing(true);
        try {
          const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", orderId);

          if (error) throw error;

          closeModal();
          showToast("Pesanan berhasil dihapus.", "success");
          router.refresh();
        } catch (error: any) {
          alert(error.message);
          closeModal();
        } finally {
          setIsProcessing(false);
          NProgress.done(); // 2. SELESAI LOADING BAR
        }
      },
    });
  };

  // --- LOGIC PELUNASAN ---
  const clickPayOff = (order: Order) => {
    if (order.remaining_balance <= 0) return;
    setModalConfig({
      isOpen: true,
      title: "Konfirmasi Pelunasan",
      type: "success",
      message: (
        <span>
          Lunasi sisa tagihan sebesar{" "}
          <strong className="text-gray-900 font-bold bg-green-100 px-1 rounded">
            {toRupiah(order.remaining_balance)}
          </strong>
          ?
        </span>
      ),
      onConfirm: async () => {
        NProgress.start(); // 1. MULAI LOADING BAR
        setIsProcessing(true);
        try {
          const newDp = (order.dp_amount || 0) + order.remaining_balance;
          const { error } = await supabase
            .from("orders")
            .update({ dp_amount: newDp, remaining_balance: 0 })
            .eq("id", order.id);

          if (error) throw error;

          await supabase.from("order_history").insert({
            order_id: order.id,
            title: "Pelunasan Pembayaran",
            description: `Pembayaran lunas via Admin. Total masuk: ${toRupiah(
              newDp
            )}.`,
            status: order.current_status,
          });

          closeModal();
          showToast("Pembayaran berhasil dilunasi!", "success");
          router.refresh();
        } catch (error: any) {
          alert(error.message);
          closeModal();
        } finally {
          setIsProcessing(false);
          NProgress.done(); // 2. SELESAI LOADING BAR
        }
      },
    });
  };

  const toggleExpand = (id: string) =>
    setExpandedOrderId(expandedOrderId === id ? null : id);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.client_name.toLowerCase().includes(searchLower) ||
      order.order_number.toLowerCase().includes(searchLower);
    const matchesStatus =
      statusFilter === "all" || order.current_status === statusFilter;
    const isPaid = order.remaining_balance <= 0;
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "lunas" && isPaid) ||
      (paymentFilter === "belum_lunas" && !isPaid);
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <>
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isLoading={isProcessing}
      />
      <NotificationToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="space-y-4">
        {/* ... (FILTER SECTION SAMA SEPERTI SEBELUMNYA) ... */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-gray-500 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Invoice ID atau Nama Klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 cursor-pointer appearance-none min-w-[160px]"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cutting">Cutting</option>
                <option value="production">Production</option>
                <option value="packing">Packing</option>
                <option value="completed">Selesai</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 cursor-pointer appearance-none min-w-[160px]"
              >
                <option value="all">Semua Pembayaran</option>
                <option value="lunas">Lunas</option>
                <option value="belum_lunas">Belum Lunas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                <th className="p-4 w-10"></th>
                <th className="p-4 font-semibold">Invoice ID</th>
                <th className="p-4 font-semibold">Klien & Kontak</th>
                <th className="p-4 font-semibold">Jadwal</th>
                <th className="p-4 font-semibold">Tagihan</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const totalItems =
                    order.order_items?.reduce(
                      (sum, item) => sum + (Number(item.quantity) || 0),
                      0
                    ) || 0;
                  const estStatus = getEstimationStatus(
                    order.estimated_date,
                    order.current_status
                  );
                  return (
                    <Fragment key={order.id}>
                      <tr
                        className={`transition-colors cursor-pointer ${
                          isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleExpand(order.id)}
                      >
                        {/* ... (KOLOM 1-5 SAMA) ... */}
                        <td className="p-4 text-center">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                            {order.order_number}
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            {totalItems} Items
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {order.client_name}
                              </div>
                              {order.client_phone ? (
                                <div
                                  className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"
                                  title="Klik tombol WA di kanan untuk chat"
                                >
                                  <Phone className="w-3 h-3" />
                                  {formatPhone(order.client_phone)}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-300 italic">
                                  - No Phone -
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{" "}
                              {formatDate(order.created_at)}
                            </span>
                            {order.estimated_date ? (
                              <span
                                className={`text-[10px] font-bold px-2 py-1 rounded-md w-fit flex items-center gap-1 ${estStatus?.color}`}
                              >
                                {estStatus?.icon && (
                                  <AlertCircle className="w-3 h-3" />
                                )}
                                {estStatus?.text}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-300 italic px-2">
                                - No Date -
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-bold text-gray-800">
                            {toRupiah(order.grand_total)}
                          </div>
                          <div
                            className={`text-xs mt-0.5 font-medium ${
                              order.remaining_balance > 0
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            {order.remaining_balance > 0
                              ? `Kurang: ${toRupiah(order.remaining_balance)}`
                              : "Lunas"}
                          </div>
                        </td>

                        <td
                          className="p-4 text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="w-40">
                            <OrderStatusSelect
                              orderNumber={order.order_number}
                              initialStatus={order.current_status}
                              onUpdate={() => {
                                showToast(
                                  `Status ${order.order_number} diperbarui!`,
                                  "success"
                                );
                                router.refresh();
                              }}
                            />
                          </div>
                        </td>

                        <td
                          className="p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* --- BAGIAN AKSI (LINK & BUTTONS) --- */}
                          <div className="flex justify-center gap-1">
                            {order.client_phone && (
                              <button
                                onClick={() => handleWhatsApp(order)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg tooltip"
                                title="Chat WA"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                            )}

                            <Link
                              href={`/tracking/${order.order_number}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg tooltip"
                              title="Lihat Tracking"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* EDIT BUTTON AS LINK */}

                            <Link
                              href={`/admin/orders/${order.order_number}/edit`}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg tooltip cursor-pointer inline-flex items-center justify-center"
                              title="Edit Order"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => clickPayOff(order)}
                              disabled={order.remaining_balance === 0}
                              className={`p-2 rounded-lg tooltip ${
                                order.remaining_balance === 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-400 hover:text-green-600 hover:bg-green-50 cursor-pointer"
                              } `}
                              title={
                                order.remaining_balance === 0
                                  ? "Pembayaran sudah lunas"
                                  : "Lunasi Pembayaran"
                              }
                            >
                              <Wallet className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => clickDelete(order.id)}
                              disabled={order.remaining_balance === 0}
                              className={`p-2 rounded-lg tooltip ${
                                order.remaining_balance === 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              }`}
                              title={
                                order.remaining_balance === 0
                                  ? "Order sudah lunas, tidak bisa dihapus"
                                  : "Hapus Order"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* --- DETAIL EXPANDED ROW (TIDAK BERUBAH) --- */}
                      {isExpanded && (
                        <tr className="bg-blue-50/30">
                          <td colSpan={7} className="p-0">
                            <div className="p-4 pl-16 pr-8 border-b border-blue-100 animate-in slide-in-from-top-2 duration-200">
                              <div className="flex flex-col md:flex-row gap-6 mb-4 bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                                <div className="flex-1">
                                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center">
                                    <Calculator className="w-3 h-3 mr-1" />{" "}
                                    Rincian Pembayaran
                                  </h4>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">
                                        Total Proyek
                                      </p>
                                      <p className="font-bold">
                                        {toRupiah(order.grand_total)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">DP Masuk</p>
                                      <p className="font-bold text-blue-600">
                                        {toRupiah(order.dp_amount)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">
                                        Sisa Tagihan
                                      </p>
                                      <p
                                        className={`font-bold ${
                                          order.remaining_balance > 0
                                            ? "text-red-600"
                                            : "text-green-600"
                                        }`}
                                      >
                                        {toRupiah(order.remaining_balance)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                      <th className="p-3 text-left font-medium">
                                        Item
                                      </th>
                                      <th className="p-3 text-left font-medium">
                                        Kategori
                                      </th>
                                      <th className="p-3 text-center font-medium">
                                        Qty
                                      </th>
                                      <th className="p-3 text-left font-medium">
                                        Catatan
                                      </th>
                                      <th className="p-3 text-right font-medium">
                                        Total
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {order.order_items &&
                                    order.order_items.length > 0 ? (
                                      order.order_items.map((item) => (
                                        <tr key={item.id}>
                                          <td className="p-3 font-medium text-gray-800 flex items-center gap-2">
                                            <Shirt className="w-3 h-3 text-gray-400" />
                                            {item.product_name}
                                          </td>
                                          <td className="p-3 text-gray-500 capitalize">
                                            {item.category}
                                          </td>
                                          <td className="p-3 text-center font-mono font-bold text-gray-700">
                                            {item.quantity || 0}
                                          </td>
                                          <td className="p-3 text-gray-500 italic text-xs">
                                            {item.notes || "-"}
                                          </td>
                                          <td className="p-3 text-right font-medium text-gray-700">
                                            {toRupiah(item.total_price)}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan={5}
                                          className="p-4 text-center text-gray-400"
                                        >
                                          Tidak ada detail item.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-gray-900 font-medium">
                        Tidak ada pesanan ditemukan
                      </p>
                      <p className="text-sm">
                        Coba ubah kata kunci atau filter status Anda.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          setPaymentFilter("all");
                        }}
                        className="mt-4 text-sm text-blue-600 hover:underline"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
