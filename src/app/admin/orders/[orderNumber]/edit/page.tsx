"use client";

import { useState, useEffect, use, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Calculator,
  Calendar,
  Phone, // Import Icon Phone
} from "lucide-react";

type OrderItem = {
  id: string;
  product_name: string;
  category: string;
  quantity: number;
  notes: string;
  price: number;
};

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export default function EditOrderPage({ params }: Props) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.orderNumber;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [orderData, setOrderData] = useState({
    id: "",
    order_number: "",
    client_name: "",
    client_phone: "", // <--- FIELD BARU
    current_status: "pending",
    estimated_date: "",
    dp_amount: 0,
    original_dp: 0,
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const originalDataRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: order, error } = await supabase
          .from("orders")
          .select(`*, order_items(*)`)
          .eq("order_number", orderNumber)
          .single();
        if (error || !order) throw new Error("Order tidak ditemukan");

        const initialHeader = {
          id: order.id,
          order_number: order.order_number,
          client_name: order.client_name,
          client_phone: order.client_phone || "", // <--- LOAD DARI DB
          current_status: order.current_status,
          estimated_date: order.estimated_date || "",
          dp_amount: order.dp_amount || 0,
          original_dp: order.dp_amount || 0,
        };
        setOrderData(initialHeader);

        let mappedItems: OrderItem[] = [];
        if (order.order_items) {
          mappedItems = order.order_items.map((item: any) => ({
            id: item.id,
            product_name: item.product_name,
            category: item.category,
            quantity: item.quantity,
            notes: item.notes || "",
            price: item.price_per_unit || 0,
          }));
          setItems(mappedItems);
        }

        originalDataRef.current = {
          header: initialHeader,
          items: JSON.parse(JSON.stringify(mappedItems)),
        };
      } catch (err: any) {
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [orderNumber]);

  const grandTotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const remainingBalance = grandTotal - orderData.dp_amount;

  const handleItemChange = (id: string, field: keyof OrderItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        product_name: "",
        category: "atasan",
        quantity: 1,
        notes: "",
        price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1)
      setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const generateChangeLog = (currentUser: string) => {
    const changes: string[] = [];
    const original = originalDataRef.current;
    if (!original) return `Data diupdate oleh ${currentUser}.`;

    if (orderData.client_name !== original.header.client_name)
      changes.push(
        `Nama klien berubah: "${original.header.client_name}" -> "${orderData.client_name}"`
      );

    // LOGIKA PERUBAHAN NO HP
    if (orderData.client_phone !== original.header.client_phone)
      changes.push(
        `No HP berubah: "${original.header.client_phone}" -> "${orderData.client_phone}"`
      );

    if (orderData.current_status !== original.header.current_status)
      changes.push(
        `Status berubah: ${original.header.current_status} -> ${orderData.current_status}`
      );
    if (orderData.estimated_date !== original.header.estimated_date)
      changes.push(
        `Estimasi selesai berubah: ${
          original.header.estimated_date || "-"
        } -> ${orderData.estimated_date}`
      );

    const dpDiff = orderData.dp_amount - original.header.original_dp;
    if (dpDiff > 0)
      changes.push(
        `Menambahkan pembayaran DP sebesar Rp ${new Intl.NumberFormat(
          "id-ID"
        ).format(dpDiff)}`
      );

    const oldTotal = original.items.reduce(
      (acc: number, i: any) => acc + i.quantity * i.price,
      0
    );
    if (grandTotal !== oldTotal)
      changes.push(
        `Nilai proyek berubah: Rp ${new Intl.NumberFormat("id-ID").format(
          grandTotal - oldTotal
        )}`
      );

    if (changes.length === 0)
      return `Data disimpan ulang oleh ${currentUser} tanpa perubahan signifikan.`;
    return changes.join(". ") + ".";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    NProgress.start();
    setIsSaving(true);
    setErrorMessage(null);

    if (items.some((i) => i.quantity <= 0)) {
      setErrorMessage("Qty minimal 1.");
      setIsSaving(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const actorName =
        user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";
      const historyDescription = generateChangeLog(actorName);

      const { error: orderError } = await supabase
        .from("orders")
        .update({
          client_name: orderData.client_name,
          client_phone: orderData.client_phone, // <--- UPDATE KE DB
          current_status: orderData.current_status,
          estimated_date: orderData.estimated_date || null,
          grand_total: grandTotal,
          dp_amount: orderData.dp_amount,
          remaining_balance: remainingBalance,
        })
        .eq("id", orderData.id);

      if (orderError) throw orderError;

      await supabase.from("order_items").delete().eq("order_id", orderData.id);
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: orderData.id,
          product_name: item.product_name,
          category: item.category,
          quantity: item.quantity,
          notes: item.notes,
          price_per_unit: item.price,
          total_price: item.quantity * item.price,
        }))
      );

      if (itemsError) throw itemsError;

      await supabase.from("order_history").insert([
        {
          order_id: orderData.id,
          title: "Order Diperbarui",
          description: historyDescription,
          status: orderData.current_status,
          actor_name: actorName,
        },
      ]);

      router.push("/admin/orders");
      router.refresh();
    } catch (error: any) {
      setErrorMessage("Gagal Update: " + error.message);
      NProgress.done();
    } finally {
      setIsSaving(false);
    }
  };

  const toRupiah = (num: number) => new Intl.NumberFormat("id-ID").format(num);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/orders"
            className="flex items-center text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Batal Edit
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            Edit Order: {orderData.order_number}
          </h1>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 text-gray-700">
            {/* GRID UTAMA DIPERLUAS JADI 3 KOLOM AGAR NO HP MASUK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* KOLOM 1: Invoice & Klien */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    No. Invoice
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={orderData.order_number}
                    className="w-full p-2 bg-gray-100 border rounded font-mono font-bold text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Nama Klien
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.client_name}
                    onChange={(e) =>
                      setOrderData({
                        ...orderData,
                        client_name: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* KOLOM 2: WhatsApp & Status */}
              <div className="space-y-4">
                {/* FIELD WHATSAPP BARU */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="08123456789"
                      value={orderData.client_phone}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          client_phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full p-2 pl-9 border rounded"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Status
                  </label>
                  <select
                    value={orderData.current_status}
                    onChange={(e) =>
                      setOrderData({
                        ...orderData,
                        current_status: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded bg-white"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✅ Confirmed</option>
                    <option value="cutting">✂️ Cutting</option>
                    <option value="production">🔨 Production</option>
                    <option value="packing">📦 Packing</option>
                    <option value="completed">🎉 Completed</option>
                  </select>
                </div>
              </div>

              {/* KOLOM 3: Estimasi (Sendiri agar jelas) */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Estimasi Selesai
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={orderData.estimated_date}
                    onChange={(e) =>
                      setOrderData({
                        ...orderData,
                        estimated_date: e.target.value,
                      })
                    }
                    className="w-full p-2 pl-9 border rounded bg-white text-sm"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  Kosongkan jika belum ada target tanggal selesai.
                </p>
              </div>
            </div>
          </div>

          {/* ... (BAGIAN ITEM DAN KALKULATOR PEMBAYARAN DIBAWAH TETAP SAMA) ... */}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Item Pesanan
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 font-bold hover:underline flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Tambah Baris
              </button>
            </div>
            <div className="space-y-3 text-gray-700">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded border border-gray-100 items-start"
                >
                  <div className="col-span-12 md:col-span-4">
                    <input
                      type="text"
                      placeholder="Nama Produk"
                      value={item.product_name}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "product_name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 text-sm border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Catatan"
                      value={item.notes}
                      onChange={(e) =>
                        handleItemChange(item.id, "notes", e.target.value)
                      }
                      className="w-full p-1 text-xs text-gray-500 bg-transparent border-none focus:ring-0 mt-1"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-2">
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
                  <div className="col-span-3 md:col-span-1">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 text-sm border rounded text-center"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2">
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
                        className="w-full pl-8 p-2 text-sm border rounded text-right"
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2 text-right py-2 font-bold text-gray-700">
                    Rp {toRupiah(item.quantity * item.price)}
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-2 text-red-400 hover:bg-red-50 rounded disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="w-full md:w-1/2 bg-blue-50 p-5 rounded-xl border border-blue-100">
                <h3 className="text-blue-800 font-bold mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" /> Update Pembayaran
                </h3>
                <div className="flex justify-between text-sm text-blue-900 mb-2">
                  <span>Sudah Terbayar (DP Lama):</span>
                  <span className="font-bold">
                    {toRupiah(orderData.original_dp)}
                  </span>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-blue-600 font-bold uppercase mb-1 block">
                    Tambah Pembayaran Baru (+)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-3 text-blue-400 font-bold">
                        Rp
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          const tambahan = parseInt(e.target.value) || 0;
                          setOrderData((prev) => ({
                            ...prev,
                            dp_amount: prev.original_dp + tambahan,
                          }));
                        }}
                        className="w-full pl-10 p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 font-bold text-blue-900 text-lg bg-white"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-blue-400 mt-2">
                    Masukkan nominal pembayaran tahap ini saja.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/3 space-y-3 text-right pt-2">
                <div className="flex justify-between text-gray-500">
                  <span>Grand Total Proyek:</span>
                  <span className="font-bold text-gray-800 text-lg">
                    Rp {toRupiah(grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-blue-600 border-b border-dashed border-blue-200 pb-2">
                  <span>Total Uang Masuk (DP):</span>
                  <span className="font-bold">
                    Rp {toRupiah(orderData.dp_amount)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-600">Sisa Tagihan:</span>
                  <span
                    className={`text-3xl font-bold ${
                      remainingBalance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    Rp {toRupiah(remainingBalance)}
                  </span>
                </div>
                {remainingBalance <= 0 && (
                  <div className="bg-green-100 text-green-700 text-center py-2 rounded font-bold text-sm mt-2">
                    ✅ LUNAS
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pb-10 gap-3">
            <Link
              href="/admin/orders"
              className="bg-gray-100 text-gray-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-200"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-70 text-lg cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              Update Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
