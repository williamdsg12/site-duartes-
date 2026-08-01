"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex items-center justify-center bg-[#0B3C5D] p-6 text-white text-center font-sans">
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-bold">Duarte's Limpezas</h1>
          <p className="text-white/80 text-sm">
            Erro global de inicialização. Clique abaixo para reiniciar o sistema.
          </p>
          <button
            onClick={() => reset()}
            className="inline-block rounded-full bg-[#FFC107] px-6 py-3 font-bold text-slate-900 shadow-md"
          >
            Recarregar Aplicação
          </button>
        </div>
      </body>
    </html>
  );
}
