"use client";

import { Download, Database, ShieldCheck, RefreshCw } from "lucide-react";

export default function AdminBackupPage() {
  const handleDownloadBackup = () => {
    window.location.href = "/api/admin/backup";
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Backup &amp; Exportação de Dados</h1>
        <p className="text-sm text-slate-500">Exporte uma cópia completa de segurança em formato JSON de todo o conteúdo do site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#0B3C5D] flex items-center justify-center font-bold">
            <Download size={24} />
          </div>

          <h3 className="font-heading font-bold text-xl text-slate-900">Exportar Backup Completo</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Faça download instantâneo de todas as informações gerais, serviços, fotos da galeria, depoimentos, FAQs e dados de SEO em um arquivo JSON criptografado.
          </p>

          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C5D] px-6 py-3.5 font-bold text-white shadow-md hover:bg-[#072A42] transition-colors"
          >
            <Download size={18} /> Baixar Backup JSON
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>

          <h3 className="font-heading font-bold text-xl text-slate-900">Sincronização &amp; Integridade</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            O banco de dados SQLite local está totalmente sincronizado com Prisma ORM e preparado para migração imediata para PostgreSQL (Supabase).
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border text-xs text-slate-600 font-mono">
            DB Engine: Prisma ORM v5.22.0
          </div>
        </div>
      </div>
    </div>
  );
}
