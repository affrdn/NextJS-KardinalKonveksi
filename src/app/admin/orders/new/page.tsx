"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Calculator,
  Calendar,
} from "lucide-react";
import NProgress from "nprogress";

// Tipe Data Lokal untuk Form Item
type OrderItemForm = {
  id: string; // ID sementara untuk key React
  product_name: string;
  category: string;
  quantity: number;
  notes: string;
  price: number;
};

export default function NewOrderPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- 1. STATE FORM HEADER ---
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    order_number: `INV-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(
      4,
      "0"
    )}`, // Auto Generate ID
    estimated_date: "",
    current_status: "pending",
    dp_amount: 0,
  });

  // --- 2. STATE ITEMS ---
  const [items, setItems] = useState<OrderItemForm[]>([
    {
      id: "item-1",
      product_name: "",
      category: "atasan",
      quantity: 1,
      notes: "",
      price: 0,
    },
  ]);

  // --- HELPER FUNCTIONS ---
  const handleHeaderChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (
    id: string,
    field: keyof OrderItemForm,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        product_name: "",
        category: "atasan",
        quantity: 1,
        notes: "",
        price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Kalkulasi Total
  const grandTotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const remainingBalance = grandTotal - formData.dp_amount;

  // Helper Rupiah
  const toRupiah = (num: number) => new Intl.NumberFormat("id-ID").format(num);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    NProgress.start();
    setIsSaving(true);
    setErrorMessage(null);

    // Validasi Sederhana
    if (!formData.client_name) {
      setErrorMessage("Nama Klien wajib diisi.");
      setIsSaving(false);
      return;
    }
    if (items.some((i) => !i.product_name)) {
      setErrorMessage("Nama Produk tidak boleh kosong.");
      setIsSaving(false);
      return;
    }

    try {
      // 0. Ambil Info Admin (Actor)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const actorName =
        user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

      // 1. Insert Header Order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            order_number: formData.order_number,
            client_name: formData.client_name,
            client_phone: formData.client_phone,
            estimated_date: formData.estimated_date || null,
            current_status: formData.current_status,
            grand_total: grandTotal,
            dp_amount: formData.dp_amount,
            remaining_balance: remainingBalance,
            created_by: actorName, // Kolom baru (optional)
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Items
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: orderData.id, // Pakai ID dari hasil insert header
          product_name: item.product_name,
          category: item.category,
          quantity: item.quantity,
          notes: item.notes,
          price_per_unit: item.price,
          total_price: item.quantity * item.price,
        }))
      );

      if (itemsError) throw itemsError;

      // 3. Insert History Log Awal
      await supabase.from("order_history").insert([
        {
          order_id: orderData.id,
          title: "Pesanan Dibuat",
          description: `Order baru dibuat oleh ${actorName}. Total: Rp ${toRupiah(
            grandTotal
          )}`,
          status: formData.current_status,
          actor_name: actorName,
        },
      ]);

      // Sukses -> Redirect
      router.push("/admin/orders");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Gagal menyimpan: " + error.message);
      NProgress.done();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/orders"
            className="flex items-center text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Batal
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Buat Pesanan Baru</h1>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. INFORMASI UTAMA (HEADER) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 text-gray-500">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
              Informasi Pelanggan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* No Invoice (Read Only / Editable) */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-semibold">
                  No. Invoice (Auto)
                </label>
                <input
                  type="text"
                  value={formData.order_number}
                  onChange={(e) =>
                    handleHeaderChange("order_number", e.target.value)
                  }
                  className="w-full p-2 bg-gray-50 border rounded font-mono font-bold text-blue-600 focus:bg-white transition-colors"
                  placeholder="INV-..."
                  required
                />
              </div>

              {/* Nama Klien */}
              <div className="lg:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block font-semibold">
                  Nama Klien / Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) =>
                    handleHeaderChange("client_name", e.target.value)
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Contoh: Budi Santoso / SMA Negeri 1"
                  required
                />
              </div>

              {/* INPUT NOMOR WHATSAPP BARU */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  className="w-full p-2 border  rounded focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="08123456789"
                  required
                  value={formData.client_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      client_phone: e.target.value.replace(/\D/g, ""),
                    })
                  } // Hanya angka
                />
              </div>

              {/* Status Awal */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-semibold">
                  Status Awal
                </label>
                <select
                  value={formData.current_status}
                  onChange={(e) =>
                    handleHeaderChange("current_status", e.target.value)
                  }
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="cutting">✂️ Cutting</option>
                  <option value="production">🔨 Production</option>
                </select>
              </div>

              {/* Estimasi Selesai */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-semibold">
                  Estimasi Selesai
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.estimated_date}
                    onChange={(e) =>
                      handleHeaderChange("estimated_date", e.target.value)
                    }
                    className="w-full p-2 pl-9 border rounded bg-white text-sm"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. RINCIAN ITEM PRODUK */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 text-gray-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Daftar Item
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" /> Tambah Baris
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 items-start relative group"
                >
                  <span className="absolute -left-2 top-4 bg-gray-200 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold text-gray-500">
                    {index + 1}
                  </span>

                  {/* Produk & Note */}
                  <div className="col-span-12 md:col-span-5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 hidden md:block">
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Produk (Misal: Kaos Polo)"
                      value={item.product_name}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "product_name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 text-sm border rounded mb-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Catatan (Ukuran, Warna, Sablon...)"
                      value={item.notes}
                      onChange={(e) =>
                        handleItemChange(item.id, "notes", e.target.value)
                      }
                      className="w-full p-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-blue-200"
                    />
                  </div>

                  {/* Kategori */}
                  <div className="col-span-6 md:col-span-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 hidden md:block">
                      Kategori
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleItemChange(item.id, "category", e.target.value)
                      }
                      className="w-full p-2 text-sm border rounded bg-white"
                    >
                      <option value="setelan">Setelan</option>
                      <option value="atasan">Atasan</option>
                      <option value="bawahan">Bawahan</option>
                      <option value="aksesoris">Aksesoris</option>
                    </select>
                  </div>

                  {/* Qty & Harga */}
                  <div className="col-span-3 md:col-span-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 hidden md:block text-center">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 text-sm border rounded text-center "
                    />
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 hidden md:block">
                      Harga Satuan
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-gray-400 text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.price || ""}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "price",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full pl-8 p-2 text-sm border rounded text-right font-medium"
                      />
                    </div>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="col-span-12 md:col-span-2 flex flex-col items-end justify-center h-full pt-1">
                    <p className="text-[10px] text-gray-400 uppercase mb-1 md:hidden">
                      Subtotal
                    </p>
                    <p className="font-bold text-gray-700 text-sm">
                      Rp {toRupiah(item.quantity * item.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. PEMBAYARAN & TOTAL */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              {/* Input DP */}
              <div className="w-full md:w-1/2 bg-blue-50 p-5 rounded-xl border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" /> Pembayaran Awal (DP)
                </h3>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-blue-500 font-bold">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.dp_amount || ""}
                    onChange={(e) =>
                      handleHeaderChange(
                        "dp_amount",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full pl-10 p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 font-bold text-blue-900 text-xl bg-white"
                  />
                </div>
                <p className="text-xs text-blue-500 mt-2">
                  Masukkan nominal uang muka yang diterima saat ini.
                </p>
              </div>

              {/* Kalkulasi Akhir */}
              <div className="w-full md:w-1/3 space-y-3 text-right">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Total Item ({items.length})</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between text-gray-800 text-lg">
                  <span className="font-medium">Grand Total</span>
                  <span className="font-bold">Rp {toRupiah(grandTotal)}</span>
                </div>
                <div className="flex justify-between text-blue-600 text-sm border-b border-dashed border-blue-200 pb-2">
                  <span>DP / Uang Muka</span>
                  <span>- Rp {toRupiah(formData.dp_amount)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-600">Sisa Tagihan</span>
                  <span
                    className={`text-2xl font-bold ${
                      remainingBalance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    Rp {toRupiah(remainingBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-4 pb-12">
            <Link
              href="/admin/orders"
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center disabled:opacity-70 disabled:cursor-wait transition"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              Simpan Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
