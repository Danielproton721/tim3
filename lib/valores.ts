export interface ValorOption {
  valor: number;
  bonus: string;
  gb: number;
  destaque?: boolean;
}

export const VALORES_RECARGA: ValorOption[] = [
  { valor: 20.0, bonus: "+3GB", gb: 3 },
  { valor: 24.9, bonus: "+5GB", gb: 5 },
  { valor: 29.9, bonus: "+8GB", gb: 8 },
  { valor: 34.9, bonus: "+10GB", gb: 10 },
  { valor: 39.9, bonus: "+12GB", gb: 12 },
  { valor: 44.9, bonus: "+15GB", gb: 15 },
  { valor: 49.9, bonus: "+20GB", gb: 20, destaque: true },
  { valor: 69.9, bonus: "+30GB", gb: 30 },
  { valor: 99.9, bonus: "+50GB", gb: 50 },
];

export const VALOR_PADRAO: ValorOption = VALORES_RECARGA.find((v) => v.destaque) ?? VALORES_RECARGA[0];
