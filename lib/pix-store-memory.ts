// Armazenamento em memória apenas para o MOCK da API.
// Em produção substitua pela integração real com o gateway PIX.
export interface PixRecord {
  id: string;
  phone: string;
  valor: number;
  description: string;
  copyPaste: string;
  qrCode: string;
  createdAt: number;
  expiresAt: string;
  paidAt?: number;
}

type Store = Map<string, PixRecord>;

const globalStore = globalThis as unknown as { __pixStore?: Store };
export function getPixMockStore(): Store {
  if (!globalStore.__pixStore) {
    globalStore.__pixStore = new Map();
  }
  return globalStore.__pixStore;
}

// Gera uma string de PIX copia-e-cola no formato EMV válido sintaticamente
// (prefixos reais + GUI do Banco Central + tamanho correto de cada campo).
// Não é aceito por bancos reais — é só para renderização do QR e cópia.
export function buildCopyPasteMock(record: Omit<PixRecord, "copyPaste" | "qrCode">): string {
  const pad = (s: string | number, l: number) => String(s).padStart(l, "0");
  const tlv = (id: string, value: string) => `${id}${pad(value.length, 2)}${value}`;
  const pixGui = tlv("00", "br.gov.bcb.pix");
  const pixKey = tlv(
    "25",
    `pix.tim.recarga/qr/cob/${record.id}`
  );
  const mai = tlv("26", pixGui + pixKey);
  const payload =
    tlv("00", "01") +
    mai +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", record.valor.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", "RECARGA TIM") +
    tlv("60", "SAO PAULO") +
    tlv("62", tlv("05", record.id.slice(0, 20))) +
    "6304";
  return payload + crc16(payload);
}

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function randomId(): string {
  // UUID v4 manual para evitar dep de lib.
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${h.slice(0, 4).join("")}-${h.slice(4, 6).join("")}-${h.slice(6, 8).join("")}-${h.slice(8, 10).join("")}-${h.slice(10, 16).join("")}`;
}
