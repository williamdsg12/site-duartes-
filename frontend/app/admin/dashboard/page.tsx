"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Image as ImageIcon,
  Wrench,
  Clock,
  Edit,
  PlusCircle,
  PhoneCall,
  Search,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    imagesCount: 0,
    servicesCount: 0,
    lastUpdate: "Carregando...",
  });
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/gallery").then((r) => r.json()),
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/logs").then((r) => r.json()),
    ])
      .then(([gallery, services, auditLogs]) => {
        setStats({
          imagesCount: Array.isArray(gallery) ? gallery.length : 0,
          servicesCount: Array.isArray(services) ? services.length : 0,
          lastUpdate: new Date().toLocaleString("pt-BR"),
        });
        if (Array.isArray(auditLogs)) {
          setLogs(auditLogs.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B3C5D] to-[#175C8A] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            CMS Ativo &amp; Sincronizado
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight">
            Painel Duarte&apos;s Limpezas
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base leading-relaxed">
            Gerencie todo o conteúdo do site institucional. Qualquer alteração feita no painel é refletida instantaneamente para os clientes.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">1.480+</div>
            <div className="text-xs font-medium text-slate-500">Visualizações no Mês</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ImageIcon size={24} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.imagesCount}</div>
            <div className="text-xs font-medium text-slate-500">Fotos na Galeria</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Wrench size={24} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.servicesCount}</div>
            <div className="text-xs font-medium text-slate-500">Serviços Cadastrados</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 truncate">{stats.lastUpdate}</div>
            <div className="text-xs font-medium text-slate-500">Última Sincronização</div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/admin/general"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-accent hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <Edit className="text-slate-400 group-hover:text-accent mb-3" size={24} />
            <div>
              <div className="font-bold text-slate-800 text-sm">Editar Site</div>
              <div className="text-xs text-slate-400 mt-1">Nome, slogan e sobre</div>
            </div>
          </Link>

          <Link
            href="/admin/gallery"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-accent hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <PlusCircle className="text-slate-400 group-hover:text-accent mb-3" size={24} />
            <div>
              <div className="font-bold text-slate-800 text-sm">Adicionar Fotos</div>
              <div className="text-xs text-slate-400 mt-1">Galeria de trabalhos</div>
            </div>
          </Link>

          <Link
            href="/admin/services"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-accent hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <Wrench className="text-slate-400 group-hover:text-accent mb-3" size={24} />
            <div>
              <div className="font-bold text-slate-800 text-sm">Editar Serviços</div>
              <div className="text-xs text-slate-400 mt-1">Cadastrar ou ordenar</div>
            </div>
          </Link>

          <Link
            href="/admin/contact"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-accent hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <PhoneCall className="text-slate-400 group-hover:text-accent mb-3" size={24} />
            <div>
              <div className="font-bold text-slate-800 text-sm">Editar Contatos</div>
              <div className="text-xs text-slate-400 mt-1">WhatsApp e telefones</div>
            </div>
          </Link>

          <Link
            href="/admin/seo"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-accent hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <Search className="text-slate-400 group-hover:text-accent mb-3" size={24} />
            <div>
              <div className="font-bold text-slate-800 text-sm">Editar SEO</div>
              <div className="text-xs text-slate-400 mt-1">Meta tags e Google</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-slate-900">Histórico Recente</h3>
          <Link
            href="/admin/logs"
            className="text-xs font-bold text-[#0B3C5D] hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowUpRight size={14} />
          </Link>
        </div>

        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">Nenhuma atividade registrada ainda.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800">{log.action}</div>
                    <div className="text-slate-400">{log.details || log.userEmail}</div>
                  </div>
                </div>
                <span className="text-slate-400 font-mono">
                  {new Date(log.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
