interface PromoSideCardProps {
  titulo?: string;
  chip?: string;
  copy?: string;
}

export default function PromoSideCard({
  titulo = "TIM PRÉ",
  chip = "XIP 5G",
  copy = "Recarregue no app Meu TIM e tenha WhatsApp o mês inteiro! Nas recargas a partir de R$30, você ainda recebe PIX de R$3 na conta!",
}: PromoSideCardProps) {
  // Separa chip em duas partes (XIP / 5G) para estilizar em cores diferentes
  const [chipRed, chipWhite] = chip.split(" ");

  return (
    <div className="space-y-2 text-center">
      <p className="text-[15px] md:text-[16px] font-black uppercase tracking-wider text-white">
        {titulo}{" "}
        <span className="text-tim-red">{chipRed}</span>
        {chipWhite && (
          <>
            {" "}
            <span className="text-white">{chipWhite}</span>
          </>
        )}
      </p>
      <p className="text-[12px] md:text-[13px] font-bold uppercase tracking-wider leading-[1.45] text-white">
        {copy}
      </p>
    </div>
  );
}
