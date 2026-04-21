export interface ValorOption {
  valor: number;
  bonus: string;
  gb: number;
  destaque?: boolean;
}

export const VALORES_RECARGA: ValorOption[] = [
  { valor: 15, bonus: "", gb: 0 },
  { valor: 20, bonus: "+1GB", gb: 1 },
  { valor: 30, bonus: "+2GB", gb: 2, destaque: true },
  { valor: 40, bonus: "+3GB", gb: 3 },
  { valor: 50, bonus: "+5GB", gb: 5 },
  { valor: 60, bonus: "+5,5GB", gb: 5.5 },
  { valor: 70, bonus: "+6GB", gb: 6 },
  { valor: 80, bonus: "+7GB", gb: 7 },
  { valor: 90, bonus: "+8GB", gb: 8 },
  { valor: 100, bonus: "ILIMITADO", gb: 999 },
];

export const VALOR_PADRAO: ValorOption = VALORES_RECARGA.find((v) => v.destaque) ?? VALORES_RECARGA[0];
