"use client";

import { useEffect, useState } from "react";
import { History, Shield, Loader2, Monitor, Globe } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  userEmail: string | null;
  ip: string;
  details: string | null;
  createdAt: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0B3C5D]" />
        Carregando Logs de Acesso e Auditoria...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-heading text-2xl font-black text-slate-900 flex items-center gap-2">
          <Shield className="text-[#0092E4]" size={24} /> Histórico de Acessos &amp; Logs de Auditoria
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Registro completo de usuários, data, hora, IP, navegador e sistema operacional das ações realizadas no painel.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#0B3C5D] text-white uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4 pl-6">Data / Hora</th>
                <th className="p-4">Ação</th>
                <th className="p-4">Usuário</th>
                <th className="p-4">Endereço IP</th>
                <th className="p-4 pr-6">Navegador &amp; Sistema Operacional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-sans">
                    Nenhum registro de log encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 text-slate-600 font-bold whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          log.action === "LOGIN"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.action === "LOGOUT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{log.userEmail || "Sistema"}</td>
                    <td className="p-4 text-slate-500 font-semibold">{log.ip || "127.0.0.1"}</td>
                    <td className="p-4 pr-6 text-slate-700 font-sans font-medium">
                      {log.details || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
