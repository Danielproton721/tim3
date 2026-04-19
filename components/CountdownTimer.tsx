"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { mmss } from "@/lib/utils";

interface CountdownTimerProps {
  expiresAt: string; // ISO
  totalSeconds?: number; // default 300 (5min)
  onExpire?: () => void;
}

export default function CountdownTimer({
  expiresAt,
  totalSeconds = 300,
  onExpire,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<number>(() => {
    const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    return Math.min(totalSeconds, diff);
  });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setRemaining(Math.min(totalSeconds, diff));
      if (diff <= 0) onExpire?.();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, totalSeconds, onExpire]);

  const pct = Math.max(0, Math.min(100, (remaining / totalSeconds) * 100));
  const expired = remaining <= 0;

  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col items-center">
      <div className="flex items-center gap-2 text-white">
        <Clock size={20} strokeWidth={2.2} />
        <span className="text-[28px] font-bold tabular-nums leading-none">
          {mmss(remaining)}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-tim-yellow transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[12px] text-white/70">
        {expired ? "Código PIX expirado" : "Tempo restante para pagamento"}
      </p>
    </div>
  );
}
