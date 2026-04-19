"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyPixButtonProps {
  code: string;
}

export default function CopyPixButton({ code }: CopyPixButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={cn(
        "group flex w-full items-center justify-center gap-3 rounded-xl px-6 py-[18px] text-base font-bold transition-all duration-200",
        copied
          ? "bg-tim-green text-white hover:bg-tim-green-dark"
          : "bg-tim-yellow text-[#1F2937] hover:bg-tim-yellow-dark shadow-btn-yellow"
      )}
    >
      {copied ? (
        <Check size={20} strokeWidth={2.5} />
      ) : (
        <Copy size={20} strokeWidth={2.2} />
      )}
      {copied ? "Código PIX copiado!" : "Copiar código PIX"}
    </button>
  );
}
