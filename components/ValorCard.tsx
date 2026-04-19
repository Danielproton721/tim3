"use client";

import { Check } from "lucide-react";
import { splitValor } from "@/lib/phone-mask";
import { cn } from "@/lib/utils";

interface ValorCardProps {
  valor: number;
  bonus: string;
  destaque?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default function ValorCard({
  valor,
  bonus,
  destaque,
  selected,
  onClick,
}: ValorCardProps) {
  const { reais, centavos } = splitValor(valor);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Selecionar recarga de R$ ${reais},${centavos} com bônus ${bonus}`}
      className={cn(
        "group relative flex min-h-[82px] w-full flex-col items-center justify-center rounded-xl p-2 transition-all duration-150 sm:min-h-[96px] sm:p-2.5",
        selected
          ? "bg-white -translate-y-0.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] ring-2 ring-[#00C853]"
          : "bg-[#1E51EB] border border-white/10 text-white hover:border-white/30 hover:-translate-y-0.5 hover:bg-[#2259F5]"
      )}
    >
      {destaque && (
        <span
          className={cn(
            "absolute left-1/2 -top-[9px] -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-[2px] text-[8.5px] font-bold uppercase tracking-[0.06em] shadow-md sm:px-2.5 sm:text-[9.5px]",
            "bg-tim-yellow text-[#0B0F19]"
          )}
        >
          Mais vendido
        </span>
      )}

      {/* R$ no topo */}
      <span
        className={cn(
          "text-[9px] sm:text-[10px] font-semibold uppercase leading-none",
          selected ? "text-[#0B0F19]/70" : "text-white/80"
        )}
      >
        R$
      </span>

      {/* Número + centavos sempre em superscript */}
      <div className="mt-0.5 flex items-baseline leading-none">
        <span
          className={cn(
            "font-black leading-none text-[20px] sm:text-[24px] md:text-[26px]",
            selected ? "text-[#0B0F19]" : "text-white"
          )}
        >
          {reais}
        </span>
        <sup
          className={cn(
            "ml-[2px] text-[10px] sm:text-[12px] font-black leading-none relative top-[-0.55em]",
            selected ? "text-[#0B0F19]" : "text-white"
          )}
        >
          {centavos}
        </sup>
      </div>

      {/* Bônus */}
      <span
        className={cn(
          "mt-1 text-[9.5px] sm:text-[11px] font-bold",
          selected ? "text-tim-blue-primary" : "text-tim-yellow"
        )}
      >
        {bonus}
      </span>

      {selected && (
        <span className="absolute bottom-1 right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#00C853] sm:bottom-1.5 sm:right-1.5 sm:h-5 sm:w-5">
          <Check size={10} strokeWidth={3} className="text-white" />
        </span>
      )}
    </button>
  );
}
