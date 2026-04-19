import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PixData {
  id: string;
  qrCode: string;
  copyPaste: string;
  expiresAt: string;
}

interface RechargeState {
  phone: string;
  phoneFormatted: string;
  valor: number;
  bonus: string;
  pixData: PixData | null;
  setPhone: (phoneFormatted: string, phoneClean: string) => void;
  setValor: (valor: number, bonus: string) => void;
  setPixData: (data: PixData | null) => void;
  reset: () => void;
}

const initialState = {
  phone: "",
  phoneFormatted: "",
  valor: 49.9,
  bonus: "+20GB",
  pixData: null as PixData | null,
};

export const useRechargeStore = create<RechargeState>()(
  persist(
    (set) => ({
      ...initialState,
      setPhone: (phoneFormatted, phoneClean) =>
        set({ phone: phoneClean, phoneFormatted }),
      setValor: (valor, bonus) => set({ valor, bonus }),
      setPixData: (pixData) => set({ pixData }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "recarga-tim",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? sessionStorage : (undefined as unknown as Storage))),
      partialize: (state) => ({
        phone: state.phone,
        phoneFormatted: state.phoneFormatted,
        valor: state.valor,
        bonus: state.bonus,
        pixData: state.pixData,
      }),
    }
  )
);
