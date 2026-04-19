export default function BannerPromo() {
  return (
    <div className="bg-tim-blue-primary">
      <div className="mx-auto max-w-[980px] px-6 pt-8 pb-4 text-center">
        <p className="text-[13px] md:text-[14px] font-bold uppercase tracking-wider text-white leading-relaxed">
          Recarregue no app Meu TIM e tenha WhatsApp o mês inteiro!
          <br className="hidden md:inline" /> Nas recargas a partir de{" "}
          <span className="text-tim-yellow">R$ 30</span>, você ainda recebe{" "}
          <span className="text-tim-yellow">PIX de R$ 3</span> na conta!
        </p>
      </div>
    </div>
  );
}
