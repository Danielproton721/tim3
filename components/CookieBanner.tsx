"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "tim-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const handle = (value: "accepted" | "dismissed") => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-6 md:max-w-[420px]"
    >
      <div className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
        <p className="text-[14px] font-bold text-gray-900 leading-snug">
          Nosso site armazena cookies para melhorar a sua navegação.
        </p>
        <p className="mt-2 text-[13px] text-gray-700 leading-relaxed">
          Ao continuar, entendemos que você está de acordo com a{" "}
          <Link href="#" className="text-tim-blue-primary font-medium hover:underline">
            Política de Privacidade da TIM
          </Link>
        </p>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => handle("dismissed")}
            className="rounded-full border-2 border-tim-blue-primary px-5 py-2 text-[13px] font-semibold text-tim-blue-primary transition-colors hover:bg-tim-blue-primary/5"
          >
            Dispensar
          </button>
          <button
            type="button"
            onClick={() => handle("accepted")}
            className="rounded-full bg-tim-blue-primary px-6 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Aceitar
          </button>
        </div>

        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={() => handle("dismissed")}
            className="text-[12px] font-medium text-tim-blue-primary hover:underline"
          >
            Alterar preferências
          </button>
        </div>
      </div>
    </div>
  );
}
