import { cn } from "@/lib/utils";

interface BonusAlertCardProps {
  valor: string; // "20" ou "39,90"
  bonusGb: number; // 3, 5...
  descricao: string; // "+ WHATSAPP ILIMITADO"
  maisVendido?: boolean;
}

export default function BonusAlertCard({
  valor,
  bonusGb,
  descricao,
  maisVendido,
}: BonusAlertCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-tim-yellow px-4 py-3.5 md:px-5 md:py-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]",
        "transition-transform duration-200 hover:-translate-y-0.5"
      )}
    >
      {maisVendido && (
        <span className="absolute -top-2.5 right-4 rounded-md bg-tim-blue-primary px-2.5 py-[3px] text-[9.5px] font-bold uppercase tracking-[0.08em] text-white shadow-md">
          Mais vendido
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        {/* esquerda — valor */}
        <div>
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-tim-blue-primary">
            A partir de
          </p>
          <p className="mt-0.5 whitespace-nowrap text-[20px] md:text-[26px] font-black leading-none text-tim-blue-primary">
            R$ {valor}
          </p>
        </div>

        {/* direita — bonus + descricao */}
        <div className="text-right">
          <p className="text-[19px] md:text-[22px] font-black leading-none text-tim-blue-primary">
            +{bonusGb}GB
          </p>
          <p className="mt-1.5 max-w-[170px] text-[9.5px] md:text-[10.5px] font-bold uppercase tracking-wider text-tim-blue-primary/90 leading-[1.25]">
            {descricao}
          </p>
        </div>
      </div>
    </div>
  );
}
