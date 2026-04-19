"use client";

import dynamic from "next/dynamic";

const QRCodeCanvas = dynamic(
  () => import("qrcode.react").then((m) => m.QRCodeCanvas),
  { ssr: false, loading: () => <QRPlaceholder /> }
);

interface PixQRCodeProps {
  value: string;
  size?: number;
}

export default function PixQRCode({ value, size = 180 }: PixQRCodeProps) {
  return (
    <div
      className="mx-auto flex items-center justify-center rounded-2xl bg-white p-5 shadow-lg"
      style={{ width: 220, height: 220 }}
      aria-label="QR Code PIX"
      role="img"
    >
      <QRCodeCanvas
        value={value || " "}
        size={size}
        level="M"
        includeMargin={false}
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  );
}

function QRPlaceholder() {
  return (
    <div className="h-[180px] w-[180px] animate-pulse rounded-md bg-gray-200" />
  );
}
