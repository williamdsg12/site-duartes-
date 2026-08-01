import Link from "next/link";
import { Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B3C5D] p-6 text-white text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[#FFC107]">
          <Wrench size={32} />
        </div>
        <h1 className="font-heading text-4xl font-extrabold">404 - Página Não Encontrada</h1>
        <p className="text-white/80 text-sm leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#FFC107] px-6 py-3 font-bold text-slate-900 shadow-lg hover:bg-amber-400 transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
