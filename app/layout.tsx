import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIM Recarga — Recarregue seu celular com PIX em até 30 minutos",
  description:
    "Recarregue seu celular TIM com PIX de forma rápida e segura. Bônus semanal de até 50GB. Crédito em até 30 minutos para qualquer DDD.",
  keywords: ["recarga tim", "recarregar tim", "recarga celular", "pix tim", "bônus tim"],
  icons: {
    icon: [{ url: "/logo-tim-icon.svg", type: "image/svg+xml" }],
    apple: "/logo-tim-icon.svg",
  },
  openGraph: {
    title: "TIM Recarga — PIX em até 30 minutos",
    description: "Recarregue seu celular TIM com PIX e ganhe GB extras. Sem cadastro.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0029FF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
