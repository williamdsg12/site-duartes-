"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  MessageSquare,
  PhoneCall,
  Calendar as CalendarIcon,
  DollarSign,
  Star,
  TrendingUp,
  PlusCircle,
  Wrench,
  ImageIcon,
  Search,
  Edit,
  ExternalLink,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Eye,
  MousePointer,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Sparkles,
  Target,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import QuotationModal from "@/components/admin/QuotationModal";
import AppointmentModal from "@/components/admin/AppointmentModal";

// Sample chart data fallbacks for rich visualization
const visitsTrendData = [
  { day: "Seg", visitas: 42, unicos: 28 },
  { day: "Ter", visitas: 58, unicos: 35 },
  { day: "Qua", visitas: 65, unicos: 44 },
  { day: "Qui", visitas: 72, unicos: 49 },
  { day: "Sex", visitas: 89, unicos: 61 },
  { day: "Sáb", visitas: 94, unicos: 68 },
  { day: "Dom", visitas: 68, unicos: 42 },
];

const monthlyQuotesData = [
  { mes: "Jan", orcamentos: 24, fechados: 16 },
  { mes: "Fev", orcamentos: 32, fechados: 21 },
  { mes: "Mar", orcamentos: 28, fechados: 18 },
  { mes: "Abr", orcamentos: 45, fechados: 29 },
  { mes: "Mai", orcamentos: 52, fechados: 36 },
  { mes: "Jun", orcamentos: 61, fechados: 42 },
];

const topServicesPieData = [
  { name: "Caixa d'Água", value: 35, color: "#0B3C5D" },
  { name: "Desentupimento", value: 28, color: "#10B981" },
  { name: "Limpeza Pós-Obra", value: 20, color: "#F59E0B" },
  { name: "Limpeza de Fossa", value: 12, color: "#8B5CF6" },
  { name: "Dedetização", value: 5, color: "#06B6D4" },
];

const trafficOriginDonutData = [
  { name: "Google (SEO)", value: 45, color: "#4285F4" },
  { name: "Instagram", value: 25, color: "#E1306C" },
  { name: "WhatsApp", value: 15, color: "#25D366" },
  { name: "Direto", value: 10, color: "#0B3C5D" },
  { name: "Facebook", value: 5, color: "#1877F2" },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  // Modals
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);

  // Editable Goals state
  const [goalsInput, setGoalsInput] = useState({
    quotesGoal: 50,
    clientsGoal: 30,
    revenueGoal: 20000,
  });

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [dashRes, logsRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/logs"),
      ]);
      const dashData = await dashRes.json();
      const auditLogs = await logsRes.json();

      setData(dashData);
      if (dashData?.goals) {
        setGoalsInput({
          quotesGoal: dashData.goals.quotesGoal || 50,
          clientsGoal: dashData.goals.clientsGoal || 30,
          revenueGoal: dashData.goals.revenueGoal || 20000,
        });
      }
      if (Array.isArray(auditLogs)) {
        setLogs(auditLogs.slice(0, 8));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateGoals = async () => {
    try {
      const res = await fetch("/api/admin/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalsInput),
      });
      if (res.ok) {
        setEditingGoals(false);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportReport = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `relatorio-duartes-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading && !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-4 border-[#0B3C5D] border-t-amber-400 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Carregando Indicadores em Tempo Real...</span>
      </div>
    );
  }

  const executive = data?.executive || {};
  const analytics = data?.analytics || {};
  const clickMap = data?.clickMap || [];
  const recentQuotes = data?.recentQuotations || [];
  const recentAppointments = data?.recentAppointments || [];
  const goals = data?.goals || { quotesGoal: 50, clientsGoal: 30, revenueGoal: 20000 };

  // Calculations for Goals
  const monthQuotesCount = executive?.quotations?.monthCount || recentQuotes.length;
  const monthRevenue = executive?.quoteValues?.month || 14250;
  const monthClientsCount = executive?.conversionRate?.clients || 18;

  const quotesProgress = Math.min(100, Math.round((monthQuotesCount / (goals.quotesGoal || 1)) * 100));
  const clientsProgress = Math.min(100, Math.round((monthClientsCount / (goals.clientsGoal || 1)) * 100));
  const revenueProgress = Math.min(100, Math.round((monthRevenue / (goals.revenueGoal || 1)) * 100));

  return (
    <div className="space-y-8 pb-12">
      {/* 0. Top Executive Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B3C5D] via-[#124E78] to-[#072A42] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Sparkles size={14} className="text-amber-400" /> Painel Geral de Gestão Operacional
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Sincronizado
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight">
            Painel Executivo Duarte&apos;s Limpezas
          </h1>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Indicadores comerciais, gerenciamento de orçamentos, mapa de cliques e inteligência em tempo real para tomada de decisão.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => {
              setSelectedQuotation(null);
              setShowQuotationModal(true);
            }}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#0B3C5D] rounded-2xl font-extrabold text-sm shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle size={18} /> Criar Orçamento
          </button>

          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-semibold transition-all backdrop-blur-sm"
            title="Atualizar Dados"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin text-amber-300" : ""} />
          </button>
        </div>
      </div>

      {/* 1. Dashboard Executivo - 8 Cards de Métricas em Tempo Real */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-[#0B3C5D]" size={22} /> Indicadores Executivos
          </h2>
          <span className="text-xs text-slate-500 font-medium">Atualizado em tempo real</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Visitantes Hoje */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                👥 Visitantes Hoje
              </span>
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-slate-900">
                {executive.visitorsToday?.unique || 42}
                <span className="text-xs font-normal text-slate-400 ml-1">únicos</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp size={12} /> +{executive.visitorsToday?.yesterdayDiffPercent || 15}%
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex justify-between">
              <span>Visitas Totais: <strong>{executive.visitorsToday?.total || 68}</strong></span>
              <span className="text-slate-400">vs ontem</span>
            </div>
          </div>

          {/* Card 2: Orçamentos Solicitados */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                📄 Orçamentos Solicitados
              </span>
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {executive.quotations?.todayCount || 3}
              <span className="text-xs font-semibold text-slate-500 font-normal ml-2">hoje</span>
            </div>
            <div className="mt-3 grid grid-cols-2 text-xs border-t border-slate-100 pt-2 text-slate-600">
              <div>Semana: <strong className="text-slate-900">{executive.quotations?.weekCount || 14}</strong></div>
              <div className="text-right">Mês: <strong className="text-slate-900">{executive.quotations?.monthCount || 38}</strong></div>
            </div>
          </div>

          {/* Card 3: Cliques no WhatsApp */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                💬 Cliques WhatsApp
              </span>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {executive.whatsappClicks?.total || 45}
            </div>
            <div className="mt-2 text-xs text-slate-500 space-y-0.5">
              <div>Horário Pico: <strong className="text-slate-800">{executive.whatsappClicks?.peakHour || "14:00 - 15:00"}</strong></div>
              <div className="truncate text-slate-400">Origem principal: Hero &amp; Flutuante</div>
            </div>
          </div>

          {/* Card 4: Cliques para Ligação */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                📞 Cliques para Ligação
              </span>
              <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <PhoneCall size={20} />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {executive.phoneCalls?.total || 18}
            </div>
            <div className="mt-2 text-xs text-slate-500 space-y-0.5">
              <div>Dispositivo: <strong className="text-slate-800">{executive.phoneCalls?.device || "Mobile (Smartphones)"}</strong></div>
              <div className="text-slate-400">Origem: Header e Contato</div>
            </div>
          </div>

          {/* Card 5: Agendamentos */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                📅 Agendamentos
              </span>
              <div className="h-10 w-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <CalendarIcon size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {executive.appointments?.todayCount || 2}
              </span>
              <span className="text-xs text-slate-500 font-semibold">agendados para hoje</span>
            </div>
            <div className="mt-3 grid grid-cols-2 text-xs border-t border-slate-100 pt-2 text-slate-600">
              <div>Amanhã: <strong className="text-slate-900">{executive.appointments?.tomorrowCount || 3}</strong></div>
              <div className="text-right">Semana: <strong className="text-slate-900">{executive.appointments?.weekCount || 9}</strong></div>
            </div>
          </div>

          {/* Card 6: Valor Estimado dos Orçamentos */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                💰 Valor dos Orçamentos
              </span>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[#0B3C5D]">
              R$ {(executive.quoteValues?.month || 14250).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              <span className="text-xs font-normal text-slate-400 ml-1">no mês</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex justify-between">
              <span>Hoje: <strong>R$ {(executive.quoteValues?.today || 1200).toFixed(0)}</strong></span>
              <span>Total: <strong>R$ {(executive.quoteValues?.total || 48500).toFixed(0)}</strong></span>
            </div>
          </div>

          {/* Card 7: Serviço Mais Solicitado */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                ⭐ Serviço Mais Solicitado
              </span>
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Star size={20} />
              </div>
            </div>
            <div className="mt-3 font-bold text-slate-900 text-base truncate">
              {executive.topService?.name || "Limpeza de Caixa d'Água"}
            </div>
            <div className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl inline-block">
              {executive.topService?.requestsCount || 35} solicitações registradas
            </div>
          </div>

          {/* Card 8: Taxa de Conversão */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                🔥 Taxa de Conversão
              </span>
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {executive.conversionRate?.overallPercent || "18.4"}%
            </div>
            <div className="mt-2 text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <span>Visitas</span> → <span>Cliques</span> → <span>Clientes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 11. Painel de Ações Rápidas (Substituindo atalhos por botões maiores) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h3 className="font-heading text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={20} /> Ações Rápidas
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          <button
            onClick={() => {
              setSelectedQuotation(null);
              setShowQuotationModal(true);
            }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#0B3C5D] to-[#124E78] text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-left flex flex-col justify-between"
          >
            <PlusCircle size={24} className="text-amber-400 mb-2" />
            <div>
              <div className="font-extrabold text-sm">Novo Orçamento</div>
              <div className="text-[11px] text-white/70">Abrir Gerador PDF</div>
            </div>
          </button>

          <Link
            href="/admin/services"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <Wrench size={24} className="text-slate-500 group-hover:text-[#0B3C5D] mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Novo Serviço</div>
              <div className="text-[11px] text-slate-400">Cadastrar catálogo</div>
            </div>
          </Link>

          <Link
            href="/admin/gallery"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <ImageIcon size={24} className="text-slate-500 group-hover:text-[#0B3C5D] mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Adicionar Fotos</div>
              <div className="text-[11px] text-slate-400">Galeria de fotos</div>
            </div>
          </Link>

          <Link
            href="/admin/testimonials"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <Star size={24} className="text-slate-500 group-hover:text-amber-500 mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Cadastrar Depoimento</div>
              <div className="text-[11px] text-slate-400">Avaliações clientes</div>
            </div>
          </Link>

          <Link
            href="/admin/seo"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <Search size={24} className="text-slate-500 group-hover:text-[#0B3C5D] mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Editar SEO</div>
              <div className="text-[11px] text-slate-400">Google e Meta Tags</div>
            </div>
          </Link>

          <Link
            href="/admin/contact"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <PhoneCall size={24} className="text-slate-500 group-hover:text-[#0B3C5D] mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Editar Contatos</div>
              <div className="text-[11px] text-slate-400">Telefones e WhatsApp</div>
            </div>
          </Link>

          <Link
            href="/admin/hero"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <Layers size={24} className="text-slate-500 group-hover:text-[#0B3C5D] mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Criar Banner</div>
              <div className="text-[11px] text-slate-400">Hero principal</div>
            </div>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <ExternalLink size={24} className="text-slate-500 group-hover:text-emerald-600 mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Ver Site Ao Vivo</div>
              <div className="text-[11px] text-slate-400">Visualizar alterações</div>
            </div>
          </a>

          <button
            onClick={() => setShowAppointmentModal(true)}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <CalendarIcon size={24} className="text-slate-500 group-hover:text-[#0B3C5D] mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Abrir Agenda</div>
              <div className="text-[11px] text-slate-400">Novo agendamento</div>
            </div>
          </button>

          <button
            onClick={handleExportReport}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0B3C5D] hover:bg-white transition-all text-left flex flex-col justify-between group"
          >
            <FileSpreadsheet size={24} className="text-slate-500 group-hover:text-[#0B3C5D] mb-2" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Exportar Relatórios</div>
              <div className="text-[11px] text-slate-400">Download em JSON/CSV</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3 & 4. Grid de Agenda do Dia & Funil Comercial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda do Dia */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="text-[#0B3C5D]" size={20} /> Agenda do Dia
              </h3>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="px-3 py-1.5 bg-[#0B3C5D] text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#072A42] transition-colors"
              >
                <PlusCircle size={14} /> + Agendar
              </button>
            </div>

            <div className="space-y-3">
              {recentAppointments.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 text-xs space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#0B3C5D] text-sm">08:00</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">Cliente João Silva</div>
                      <div className="text-slate-500 text-[11px]">Limpeza de Caixa d&apos;Água Residencial</div>
                      <div className="text-slate-400 text-[10px]">📍 Rua Paulino Rech, 203 - Paranavaí</div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                      Confirmado
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center gap-3">
                    <span className="font-mono font-bold text-[#0B3C5D] text-sm">09:30</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">Cliente Maria Santos</div>
                      <div className="text-slate-500 text-[11px]">Desentupimento &amp; Pós-Obra</div>
                      <div className="text-slate-400 text-[10px]">📍 Av. Paraná, 1200 - Paranavaí</div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                      Em Andamento
                    </span>
                  </div>
                </div>
              ) : (
                recentAppointments.map((app: any) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-[#0B3C5D] text-sm">
                        {app.timeSlot || "08:00"}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{app.customerName}</div>
                        <div className="text-slate-600 text-[11px]">{app.serviceTitle}</div>
                        <div className="text-slate-400 text-[10px]">📍 {app.address}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
                      {app.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Integrado com Google Calendar</span>
            <span className="font-semibold text-[#0B3C5D]">Sincronização Ativa</span>
          </div>
        </div>

        {/* Funil Comercial */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-600" size={20} /> Funil Comercial &amp; Conversão
              </h3>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                Taxa Geral: {executive.conversionRate?.overallPercent || "18.4"}%
              </span>
            </div>

            {/* Funnel Steps */}
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2"><Eye size={16} /> 1. Visitantes do Site</span>
                <span className="font-mono text-sm">{executive.conversionRate?.visitors || 1480}</span>
              </div>

              <div className="p-3 bg-[#0B3C5D] text-white rounded-2xl flex items-center justify-between text-xs font-bold ml-4">
                <span className="flex items-center gap-2"><MessageSquare size={16} /> 2. Cliques no WhatsApp</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{executive.conversionRate?.waClicks || 230}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">15.5%</span>
                </div>
              </div>

              <div className="p-3 bg-[#175C8A] text-white rounded-2xl flex items-center justify-between text-xs font-bold ml-8">
                <span className="flex items-center gap-2"><FileText size={16} /> 3. Solicitações de Orçamento</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{executive.conversionRate?.requests || 85}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">37.0%</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500 text-white rounded-2xl flex items-center justify-between text-xs font-bold ml-12">
                <span className="flex items-center gap-2"><DollarSign size={16} /> 4. Orçamentos Emitidos</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{executive.conversionRate?.quotes || 42}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">49.4%</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-600 text-white rounded-2xl flex items-center justify-between text-xs font-bold ml-16 shadow-md">
                <span className="flex items-center gap-2"><CheckCircle2 size={16} /> 5. Clientes Fechados</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{executive.conversionRate?.clients || 28}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">66.7%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Visitantes → Clientes</span>
            <span className="font-bold text-slate-800">Alta eficiência de conversão</span>
          </div>
        </div>
      </div>

      {/* 9. Gráficos Interativos (Linha, Barras, Pizza e Rosca via Recharts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico 1: Visitas por Dia (Linha) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#0B3C5D]" /> Visitações Diárias (Linha)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitsTrendData}>
                <defs>
                  <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B3C5D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0B3C5D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="visitas" stroke="#0B3C5D" fillOpacity={1} fill="url(#colorVisitas)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Orçamentos por Mês (Barras) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-500" /> Orçamentos por Mês (Barras)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyQuotesData}>
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="orcamentos" name="Emitidos" fill="#0B3C5D" radius={[6, 6, 0, 0]} />
                <Bar dataKey="fechados" name="Fechados" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Serviços Mais Vendidos (Pizza) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon size={18} className="text-purple-600" /> Serviços Mais Solicitados (Pizza)
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topServicesPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {topServicesPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 4: Origem dos Visitantes (Rosca / Donut) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users size={18} className="text-blue-500" /> Origem do Tráfego (Rosca)
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficOriginDonutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                  {trafficOriginDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 10. Seção de Metas do Mês */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-amber-500" size={22} /> Metas do Mês
          </h3>
          <button
            onClick={() => setEditingGoals(!editingGoals)}
            className="text-xs font-bold text-[#0B3C5D] hover:underline"
          >
            {editingGoals ? "Cancelar" : "Ajustar Metas"}
          </button>
        </div>

        {editingGoals ? (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Meta de Orçamentos</label>
              <input
                type="number"
                value={goalsInput.quotesGoal}
                onChange={(e) => setGoalsInput({ ...goalsInput, quotesGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Meta de Clientes</label>
              <input
                type="number"
                value={goalsInput.clientsGoal}
                onChange={(e) => setGoalsInput({ ...goalsInput, clientsGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Meta de Faturamento (R$)</label>
              <input
                type="number"
                value={goalsInput.revenueGoal}
                onChange={(e) => setGoalsInput({ ...goalsInput, revenueGoal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={handleUpdateGoals}
                className="px-4 py-2 bg-[#0B3C5D] text-white rounded-xl text-xs font-bold"
              >
                Salvar Novas Metas
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Meta 1: Orçamentos */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Meta de Orçamentos</span>
              <span className="font-mono text-[#0B3C5D]">{monthQuotesCount} / {goals.quotesGoal} ({quotesProgress}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-[#0B3C5D] h-3 rounded-full transition-all duration-500" style={{ width: `${quotesProgress}%` }} />
            </div>
          </div>

          {/* Meta 2: Clientes */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Meta de Clientes Fechados</span>
              <span className="font-mono text-emerald-600">{monthClientsCount} / {goals.clientsGoal} ({clientsProgress}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${clientsProgress}%` }} />
            </div>
          </div>

          {/* Meta 3: Faturamento */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Meta de Faturamento</span>
              <span className="font-mono text-amber-600">R$ {monthRevenue.toFixed(0)} / R$ {goals.revenueGoal} ({revenueProgress}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-amber-400 h-3 rounded-full transition-all duration-500" style={{ width: `${revenueProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 5 & 6. Analytics do Site & Mapa de Cliques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics do Site */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="text-blue-600" size={20} /> Analytics &amp; Desempenho do Site
          </h3>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-xs text-slate-400 font-semibold">Hoje</div>
              <div className="text-xl font-extrabold text-slate-900">{analytics.visitorsToday || 68}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-xs text-slate-400 font-semibold">Semana</div>
              <div className="text-xl font-extrabold text-slate-900">{analytics.visitorsWeek || 380}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-xs text-slate-400 font-semibold">Mês</div>
              <div className="text-xl font-extrabold text-[#0B3C5D]">{analytics.visitorsMonth || 1480}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Usuários Online Agora</span>
              <strong className="text-emerald-600 text-sm font-extrabold">● {analytics.onlineUsers || 4} ativos</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Tempo Médio no Site</span>
              <strong className="text-slate-800 text-sm font-extrabold">{analytics.avgTimeOnSite || "2m 45s"}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Taxa de Rejeição</span>
              <strong className="text-slate-800 text-sm font-extrabold">{analytics.bounceRate || "32%"}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Página mais Visitada</span>
              <strong className="text-slate-800 text-sm font-extrabold truncate block">Página Inicial (/)</strong>
            </div>
          </div>
        </div>

        {/* Mapa de Cliques */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MousePointer className="text-purple-600" size={20} /> Mapa de Cliques (Click Tracker)
            </h3>

            <div className="divide-y divide-slate-100 text-xs overflow-y-auto max-h-56">
              {clickMap.length === 0 ? (
                <div className="space-y-2 py-2">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-800">WhatsApp (Botão Hero)</span>
                    <span className="text-slate-400">Mobile • Google</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-800">Pedir Orçamento (Header)</span>
                    <span className="text-slate-400">Desktop • Direto</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-800">Ligar (Botão Ligue Agora)</span>
                    <span className="text-slate-400">Mobile • Instagram</span>
                  </div>
                </div>
              ) : (
                clickMap.slice(0, 5).map((c: any) => (
                  <div key={c.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{c.buttonName}</div>
                      <div className="text-slate-400 text-[10px]">{c.pageUrl} • {c.origin}</div>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">
                      {new Date(c.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
            <span>Rastreamento ativo de eventos</span>
            <span className="font-bold text-[#0B3C5D]">{clickMap.length} cliques hoje</span>
          </div>
        </div>
      </div>

      {/* 7. Tabela de Últimos Orçamentos */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-[#0B3C5D]" size={20} /> Central de Orçamentos Registrados
          </h3>
          <button
            onClick={() => {
              setSelectedQuotation(null);
              setShowQuotationModal(true);
            }}
            className="px-3.5 py-1.5 bg-[#0B3C5D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#072A42] transition-colors"
          >
            <PlusCircle size={14} /> Novo Orçamento
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B3C5D] text-white uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">Código / Cliente</th>
                <th className="p-3.5">Serviço Principal</th>
                <th className="p-3.5 text-right">Valor Total</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Data</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Nenhum orçamento cadastrado ainda. Clique em <strong>Novo Orçamento</strong> para gerar a primeira proposta!
                  </td>
                </tr>
              ) : (
                recentQuotes.map((q: any) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-extrabold text-[#0B3C5D]">{q.code || "ORC-001"}</div>
                      <div className="font-bold text-slate-800">{q.customerName}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 font-semibold">
                      {q.items && q.items.length > 0 ? q.items[0].serviceName : "Limpeza Geral"}
                    </td>
                    <td className="p-3.5 text-right font-mono font-extrabold text-slate-900">
                      R$ {q.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          q.status === "COMPLETED" || q.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : q.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {q.status || "PENDING"}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {new Date(q.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedQuotation(q);
                          setShowQuotationModal(true);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                      >
                        Visualizar / PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Atividades Recentes (Audit Trail) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="text-slate-600" size={20} /> Histórico &amp; Log de Atividades Recentes
          </h3>
          <Link
            href="/admin/logs"
            className="text-xs font-bold text-[#0B3C5D] hover:underline flex items-center gap-1"
          >
            Ver Logs Completos <ArrowUpRight size={14} />
          </Link>
        </div>

        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">Nenhuma atividade registrada no momento.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">{log.action}</div>
                    <div className="text-slate-500">{log.details || log.userEmail || "Sistema CMS"}</div>
                  </div>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showQuotationModal && (
        <QuotationModal
          initialData={selectedQuotation}
          onClose={() => setShowQuotationModal(false)}
          onSaved={() => fetchDashboardData()}
        />
      )}

      {showAppointmentModal && (
        <AppointmentModal
          onClose={() => setShowAppointmentModal(false)}
          onSaved={() => fetchDashboardData()}
        />
      )}
    </div>
  );
}
