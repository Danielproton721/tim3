import type { PixData } from "./store";

export interface CreatePixPayload {
  phone: string;
  valor: number;
  description: string;
}

export async function createPixClient(payload: CreatePixPayload): Promise<PixData> {
  const res = await fetch("/api/pix/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(err.error ?? "Falha ao criar cobrança PIX");
  }
  const data = await res.json();
  return {
    id: data.pixId,
    qrCode: data.qrCode,
    copyPaste: data.copyPaste,
    expiresAt: data.expiresAt,
  };
}

export type PixStatus = "pending" | "paid" | "expired";

export async function getPixStatus(id: string): Promise<PixStatus> {
  const res = await fetch(`/api/pix/status/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao consultar status");
  const data = (await res.json()) as { status: PixStatus };
  return data.status;
}
