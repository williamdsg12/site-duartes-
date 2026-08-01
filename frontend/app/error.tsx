"use client";

import { useEffect } from "react";
import { Wrench, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B3C5D] p-6 text-white text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[#FFC107]">
          <Wrench size={32} />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Duarte's Limpezas</h1>
        <p className="text-white/80 text-sm leading-relaxed">
          Ocorreu um pequeno imprevisto técnico ao carregar esta seção. Por favor, tente recarregar a página.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFC107] px-6 py-3 font-bold text-slate-900 shadow-lg hover:bg-amber-400 transition-colors"
        >
          <RefreshCw size={16} /> Recarregar Página
        </button>
      </div>
    </div>
  );
}
