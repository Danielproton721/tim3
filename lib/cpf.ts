/**
 * Gerador de CPF válido (passa no dígito verificador).
 * Usado pro fluxo de recarga anônimo — a Pagou exige `document.number`
 * válido, mas para recarga de crédito pré-pago não coletamos CPF do
 * comprador (pagamento por PIX não precisa). Se no futuro o compliance
 * exigir CPF real, trocar por coleta no formulário.
 */
export function generateValidCpf(): string {
  const base: number[] = [];
  for (let i = 0; i < 9; i++) base.push(Math.floor(Math.random() * 10));

  const digits = base.slice();
  for (let d = 0; d < 2; d++) {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (digits.length + 1 - i);
    }
    const check = ((sum * 10) % 11) % 10;
    digits.push(check);
  }

  return digits.join("");
}

/**
 * Valida um CPF (apenas formato + dígito verificador).
 * Não checa se o CPF existe na Receita.
 */
export function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);
  for (let d = 0; d < 2; d++) {
    const len = 9 + d;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += digits[i] * (len + 1 - i);
    }
    const check = ((sum * 10) % 11) % 10;
    if (check !== digits[len]) return false;
  }
  return true;
}
