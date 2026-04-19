"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BonusCard from "@/components/BonusCard";
import ValorCard from "@/components/ValorCard";
import { useRechargeStore } from "@/lib/store";
import { VALORES_RECARGA, VALOR_PADRAO } from "@/lib/valores";
import { createPixClient } from "@/lib/pix-api";
import { formatBrl } from "@/lib/phone-mask";

export default function RecargaStep2() {
  const router = useRouter();
  const { phone, phoneFormatted, valor, bonus, setValor, setPixData } = useRechargeStore();

  const [selected, setSelected] = useState<{ valor: number; bonus: string }>({
    valor: valor || VALOR_PADRAO.valor,
    bonus: bonus || VALOR_PADRAO.bonus,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phone) router.replace("/recarga");
  }, [phone, router]);

  useEffect(() => {
    setValor(selected.valor, selected.bonus);
  }, [selected, setValor]);

  const bonusValor = useMemo(
    () => VALORES_RECARGA.find((v) => v.destaque)?.valor ?? 49.9,
    []
  );

  async function handleRecarregar() {
    if (!phone) {
      router.push("/recarga");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const data = await createPixClient({
        phone,
        valor: selected.valor,
        description: `Recarga TIM - ${formatBrl(selected.valor)} - ${phoneFormatted}`,
      });
      setPixData(data);
      router.push("/pagamento");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao gerar PIX";
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-tim-blue-primary md:min-h-[calc(100vh-102px)]">
      <div className="mx-auto max-w-[1100px] px-4 pb-10 pt-4 sm:px-6 md:pt-8 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-white">
            Fazer uma recarga TIM
          </h2>

          {/* Grid topo — número + bonus semanal */}
          <div className="mt-4 grid gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
            {/* Número */}
            <div>
              <label className="mb-1.5 block text-[12px] md:text-[13px] font-medium text-white/90">
                Número TIM que receberá a recarga
              </label>
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm md:px-5 md:py-3.5">
                <span className="text-[14px] md:text-[16px] font-medium text-[#1F2937]">
                  {phoneFormatted || "(00) 00000-0000"}
                </span>
                <button
                  type="button"
                  onClick={() => router.push("/recarga")}
                  className="text-[13px] font-semibold text-tim-blue-primary transition-colors hover:underline"
                >
                  Alterar
                </button>
              </div>
            </div>

            {/* Bônus semanal */}
            <div>
              <span className="mb-1.5 block text-[12px] md:text-[13px] font-medium text-white/90">
                Valor da recarga
              </span>
              <BonusCard valor={bonusValor} />
            </div>
          </div>

          {/* Grid 3x3 de valores — 3 cols até no mobile (match Image #4) */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3 md:mt-7 md:gap-4">
            {VALORES_RECARGA.map((v) => {
              const isSelected =
                selected.valor === v.valor && selected.bonus === v.bonus;
              return (
                <ValorCard
                  key={v.valor}
                  valor={v.valor}
                  bonus={v.bonus}
                  destaque={v.destaque}
                  selected={isSelected}
                  onClick={() => setSelected({ valor: v.valor, bonus: v.bonus })}
                />
              );
            })}
          </div>

          {error && (
            <div role="alert" className="mt-5 rounded-lg bg-red-100 p-3.5 text-sm text-red-900">
              {error}
            </div>
          )}

          <div className="mt-6 md:mt-8">
            <button
              type="button"
              onClick={handleRecarregar}
              disabled={submitting}
              className="w-full rounded-xl bg-tim-yellow px-6 py-[14px] text-[15px] font-bold text-[#0B0F19] shadow-btn-yellow transition-all duration-200 hover:bg-tim-yellow-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 md:ml-auto md:w-auto md:min-w-[260px] md:text-[16px]"
            >
              {submitting ? "Gerando PIX..." : `Recarregar`}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
