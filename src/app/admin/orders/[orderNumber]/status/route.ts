import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const allowed = new Set([
  "pending",
  "confirmed",
  "cutting",
  "production",
  "packing",
  "completed",
  "cancelled",
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const body = await req.json().catch(() => ({}));
  const status = String(body.status || "").toLowerCase();

  if (!allowed.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // 1) Ambil order (butuh id untuk insert history)
  const { data: order, error: findErr } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, current_status")
    .eq("order_number", orderNumber)
    .single();

  if (findErr || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 2) Update status di table orders
  const { error: updErr } = await supabaseAdmin
    .from("orders")
    .update({ current_status: status })
    .eq("id", order.id);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  // 3) Insert history (optional tapi bagus untuk timeline)
  const titleMap: Record<string, string> = {
    pending: "Menunggu DP",
    confirmed: "DP Masuk / Pesanan Dikonfirmasi",
    cutting: "Pemotongan Kain",
    production: "Proses Sablon & Jahit",
    packing: "QC & Packing",
    completed: "Pesanan Selesai",
  };

  await supabaseAdmin.from("order_history").insert({
    order_id: order.id,
    status,
    title: titleMap[status] ?? "Update Status",
    description: body.description ?? `Status diubah ke: ${status}`,
  });

  return NextResponse.json({ ok: true });
}
