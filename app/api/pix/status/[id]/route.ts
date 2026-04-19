import { NextResponse } from "next/server";
import { getPixMockStore } from "@/lib/pix-store-memory";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getPagouTransaction, normalizeStatus } from "@/lib/pagou";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PAID_AFTER_MS = 180_000;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  }

  const provider = (process.env.PIX_PROVIDER ?? "pagou").toLowerCase();

  // ========== MOCK ==========
  if (provider === "mock") {
    const store = getPixMockStore();
    const record = store.get(id);
    if (!record) return NextResponse.json({ status: "expired" });
    const now = Date.now();
    if (now > new Date(record.expiresAt).getTime()) {
      return NextResponse.json({ status: "expired" });
    }
    const paidAfter = Number(process.env.PIX_MOCK_PAID_AFTER_MS) || DEFAULT_PAID_AFTER_MS;
    if (record.paidAt || now - record.createdAt >= paidAfter) {
      record.paidAt ??= now;
      return NextResponse.json({ status: "paid" });
    }
    return NextResponse.json({ status: "pending" });
  }

  // ========== PAGOU + SUPABASE (com fallback p/ memória) ==========
  // 1) Tenta achar o registro na Supabase.
  let pagouId: string | null = null;
  let expiresAtIso: string | null = null;
  let alreadyPaid = false;

  try {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("pix_transactions")
      .select("id, pagou_id, status, expires_at, paid_at")
      .eq("id", id)
      .maybeSingle();

    if (!error && row) {
      pagouId = (row.pagou_id as string) ?? null;
      expiresAtIso = (row.expires_at as string) ?? null;
      alreadyPaid = row.status === "paid" || Boolean(row.paid_at);
    }
  } catch {
    /* Supabase indisponível — cai pro in-memory */
  }

  // 2) Se não achou na Supabase, tenta no store em memória (fallback do create).
  if (!pagouId) {
    const store = getPixMockStore();
    const record = store.get(id) as
      | { pagouId?: string; expiresAt: string; paidAt?: number }
      | undefined;
    if (record) {
      pagouId = record.pagouId ?? id; // se não tem pagouId, o próprio id É o pagou id
      expiresAtIso = record.expiresAt;
      alreadyPaid = Boolean(record.paidAt);
    }
  }

  if (!pagouId) {
    // nem Supabase nem memória → id inválido
    return NextResponse.json({ status: "expired" });
  }

  if (alreadyPaid) {
    return NextResponse.json({ status: "paid" });
  }

  // 3) Consulta a Pagou
  try {
    const tx = await getPagouTransaction(pagouId);
    const normalized = normalizeStatus(tx.status);

    if (normalized === "paid") {
      // Persiste tanto na Supabase (se tiver) quanto na memória
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from("pix_transactions")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", id);
      } catch { /* ignore */ }
      const record = getPixMockStore().get(id);
      if (record) record.paidAt = Date.now();
      return NextResponse.json({ status: "paid" });
    }

    if (normalized === "expired") {
      return NextResponse.json({ status: "expired" });
    }

    // Pendente: mesmo que o timer visual zere, não marcamos expired aqui
    // (usuário pode pagar em atraso; a Pagou é a fonte da verdade)
    return NextResponse.json({ status: "pending" });
  } catch (err) {
    console.error("[api/pix/status] erro Pagou:", err);
    // Se até a Pagou falhar, responde pending pro client tentar de novo
    return NextResponse.json({ status: "pending" });
  }
}
