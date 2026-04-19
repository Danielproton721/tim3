"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRechargeStore } from "@/lib/store";
import { formatBrl } from "@/lib/phone-mask";

export default function SucessoPage() {
  const router = useRouter();
  const { phone, phoneFormatted, valor, reset } = useRechargeStore();

  useEffect(() => {
    if (!phone) router.replace("/");
  }, [phone, router]);

  function handleNovaRecarga() {
    reset();
    router.push("/");
  }

  return (
    <div className="min-h-[calc(100vh-102px)] bg-tim-blue-primary">
      <div className="mx-auto max-w-[560px] px-6 pb-20 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-tim-green shadow-xl shadow-tim-green/40"
          >
            <Check size={56} strokeWidth={3} className="text-white" />
          </motion.div>

          <h2 className="mt-8 text-[32px] font-bold text-white leading-tight">
            Pagamento confirmado!
          </h2>

          <p className="mt-4 max-w-[460px] text-[16px] leading-7 text-white/85">
            Seu crédito de <strong className="text-tim-yellow">{formatBrl(valor)}</strong> será adicionado ao número{" "}
            <strong className="text-white">{phoneFormatted}</strong> em até{" "}
            <strong>30 minutos</strong>.
          </p>

          <p className="mt-3 text-[14px] text-white/70">
            Você receberá uma notificação assim que a recarga for processada.
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 md:max-w-[320px]">
            <button
              type="button"
              onClick={handleNovaRecarga}
              className="w-full rounded-xl bg-tim-yellow px-10 py-4 text-[16px] font-bold text-tim-blue-primary shadow-btn-yellow transition-all duration-200 hover:bg-tim-yellow-dark hover:-translate-y-0.5 active:translate-y-0"
            >
              Fazer nova recarga
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
