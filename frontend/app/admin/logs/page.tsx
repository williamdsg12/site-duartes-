"use client";

import { useEffect, useState } from "react";
import { History, Shield, Loader2 } from "lucide-react";

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
        Carregando Audit Logs...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Logs de Auditoria &amp; Segurança</h1>
        <p className="text-sm text-slate-500">Histórico de ações, alterações de conteúdo e logins realizados no sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Data / Hora</th>
                <th className="p-4">Ação</th>
                <th className="p-4">Usuário</th>
                <th className="p-4">IP</th>
                <th className="p-4 pr-6">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-4 pl-6 text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-4 font-bold text-[#0B3C5D]">{log.action}</td>
                  <td className="p-4 text-slate-700">{log.userEmail || "Sistema"}</td>
                  <td className="p-4 text-slate-400">{log.ip}</td>
                  <td className="p-4 pr-6 text-slate-600 font-sans">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
