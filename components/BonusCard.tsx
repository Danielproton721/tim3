import { splitValor } from "@/lib/phone-mask";

interface BonusCardProps {
  valor: number;
  titulo?: string;
  descricao?: string;
}

export default function BonusCard({
  valor,
  titulo = "BÔNUS SEMANAL",
  descricao = "+20GB de bônus para Navegar, redes sociais e vídeos por 30 dias",
}: BonusCardProps) {
  const { reais, centavos } = splitValor(valor);

  // Separa o título em duas palavras para empilhar (ex: "BÔNUS / SEMANAL")
  const [tituloLinha1, ...tituloRestoArr] = titulo.split(" ");
  const tituloLinha2 = tituloRestoArr.join(" ");

  return (
    <div className="rounded-xl border-2 border-[#00C853] bg-white px-4 py-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] sm:px-5 sm:py-3.5">
      <div className="flex items-center gap-3">
        {/* Bloco esquerdo: título empilhado + preço */}
        <div className="flex min-w-[100px] flex-col">
          <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider leading-[1.1] text-tim-blue-primary">
            {tituloLinha1}
            {tituloLinha2 && <><br />{tituloLinha2}</>}
          </span>
          <div className="mt-0.5 flex items-baseline">
            <span className="mr-0.5 text-[12px] font-black leading-none text-[#0B0F19] sm:text-[13px]">
              R$
            </span>
            <span className="text-[19px] sm:text-[22px] font-black leading-none text-[#0B0F19]">
              {reais}
            </span>
            <sup className="ml-[1px] text-[10px] sm:text-[12px] font-black leading-none text-[#0B0F19] relative top-[-0.55em]">
              {centavos}
            </sup>
          </div>
        </div>

        {/* Descrição à direita */}
        <p className="flex-1 text-[11.5px] sm:text-[12.5px] leading-[1.35] text-tim-gray-text">
          {descricao}
        </p>
      </div>
    </div>
  );
}
