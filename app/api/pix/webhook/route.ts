import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getSecret } from "@/lib/secrets";
import { normalizeStatus } from "@/lib/pagou";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Postback da Pagou (https://pagouai.readme.io/reference/formato-dos-postbacks).
 * A Pagou chama com o body do evento. Autenticamos via token na query string
 * (configurado em app_secrets.PAGOU_WEBHOOK_SECRET), que foi inserido na URL
 * quando criamos a transação.
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const providedToken = url.searchParams.get("t");
    const expectedToken = await getSecret("PAGOU_WEBHOOK_SECRET").catch(() => null);

    if (!expectedToken || !providedToken || providedToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    // A Pagou envia { id, type, objectId, url, data }.
    const payload = body as {
      type?: string;
      objectId?: string | number;
      data?: { id?: string | number; status?: string };
    };

    if (payload?.type !== "transaction") {
      // Ignora eventos que não são de transação (checkout, transfer...)
      return NextResponse.json({ ok: true, ignored: payload?.type ?? "unknown" });
    }

    const pagouId = String(payload.objectId ?? payload.data?.id ?? "");
    const statusRaw = payload.data?.status ?? "";
    const normalized = normalizeStatus(statusRaw);

    if (!pagouId) {
      return NextResponse.json({ error: "objectId ausente" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const update: Record<string, unknown> = {
      status: statusRaw || "updated",
      postback_raw: body,
    };
    if (normalized === "paid") {
      update.status = "paid";
      update.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("pix_transactions")
      .update(update)
      .eq("pagou_id", pagouId);

    if (error) {
      console.error("[webhook] supabase update failed", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pagouId, status: normalized });
  } catch (err) {
    console.error("[webhook] unhandled", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "erro" },
      { status: 500 }
    );
  }
}

// Health check (Pagou às vezes faz GET pra validar a URL)
export async function GET() {
  return NextResponse.json({ ok: true, service: "recarga-tim-pix-webhook" });
}
