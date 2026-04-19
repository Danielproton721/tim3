import { Gift, Zap, Lock, Smartphone, ShieldCheck, Sparkles } from "lucide-react";

const BENEFICIOS = [
  {
    icon: Gift,
    title: "Bônus exclusivos",
    description: "Ganhe GB extras em recargas selecionadas, válidos por até 30 dias.",
  },
  {
    icon: Zap,
    title: "Recarga instantânea",
    description: "Crédito entra em até 30 minutos direto no seu número TIM.",
  },
  {
    icon: Lock,
    title: "Pagamento seguro",
    description: "PIX com criptografia de ponta a ponta. Simples, rápido e sem cadastro.",
  },
];

const DIFERENCIAIS = [
  {
    icon: Smartphone,
    title: "Para qualquer celular",
    description: "Aceitamos recargas para qualquer DDD e linha no Brasil.",
  },
  {
    icon: ShieldCheck,
    title: "100% oficial",
    description: "Integração direta com o ecossistema TIM — seu crédito não cai em conta errada.",
  },
  {
    icon: Sparkles,
    title: "Bônus semanal",
    description: "Toda semana uma recarga com GB extras para navegar à vontade.",
  },
];

export default function BeneficiosSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="text-[clamp(28px,3.6vw,36px)] font-bold text-[#1F2937]">
            Benefícios da Recarga TIM
          </h2>
          <p className="mt-4 text-base text-tim-gray-text">
            Aproveite vantagens exclusivas ao recarregar pelo nosso site.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BENEFICIOS.map((b) => (
            <BenefitCard key={b.title} {...b} />
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DIFERENCIAIS.map((b) => (
            <BenefitCard key={b.title} {...b} variant="outline" />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  description,
  variant = "filled",
}: {
  icon: typeof Gift;
  title: string;
  description: string;
  variant?: "filled" | "outline";
}) {
  const base =
    variant === "filled"
      ? "bg-tim-gray-bg"
      : "bg-white border border-gray-200";
  return (
    <div
      className={`${base} rounded-2xl p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-tim-blue-primary/10 text-tim-blue-primary">
        <Icon size={28} strokeWidth={2.2} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#1F2937]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-tim-gray-text">{description}</p>
    </div>
  );
}
