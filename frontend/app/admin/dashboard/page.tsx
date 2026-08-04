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
  Database,
  Activity,
  ShieldCheck,
  UserCheck,
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

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
      const [dashRes, logsRes, meRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/logs"),
        fetch("/api/auth/me"),
      ]);
      const dashData = await dashRes.json();
      const auditLogs = await logsRes.json();
      const meData = await meRes.json();

      if (meData.authenticated) {
        setCurrentUser(meData.user);
      }

      setData(dashData);
      if (dashData?.goals) {
        setGoalsInput({
          quotesGoal: dashData.goals.quotesGoal || 50,
          clientsGoal: dashData.goals.clientsGoal || 30,
          revenueGoal: dashData.goals.revenueGoal || 20000,
        });
      }
      if (Array.isArray(auditLogs)) {
        setLogs(auditLogs);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveGoals = async () => {
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
    } catch (err) {
      console.error("Erro ao salvar metas:", err);
    }
  };

  // Time-based & Session-based Greeting Calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia ☀️";
    if (hour < 18) return "Boa tarde 🌤️";
    return "Boa noite 🌙";
  };

  const userName = currentUser?.name ? currentUser.name.split(" ")[0] : "Duarte";

  const isFirstLoginToday = () => {
    if (!currentUser?.previousLoginAt) return true;
    const prev = new Date(currentUser.previousLoginAt);
    const today = new Date();
    return (
      prev.getDate() !== today.getDate() ||
      prev.getMonth() !== today.getMonth() ||
      prev.getFullYear() !== today.getFullYear()
    );
  };

  const welcomeSubtext = isFirstLoginToday()
    ? `Seja bem-vindo, ${userName}! Desejamos um excelente trabalho hoje.`
    : `Que bom te ver novamente, ${userName}! Tenha um ótimo restante de trabalho.`;

  const formatLastAccess = () => {
    const dt = currentUser?.previousLoginAt || currentUser?.lastLoginAt;
    if (!dt) return "Primeiro acesso";
    const dateObj = new Date(dt);
    const today = new Date();

    const isToday =
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear();

    const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (isToday) return `Hoje às ${timeStr}`;
    return `${dateObj.toLocaleDateString("pt-BR")} às ${timeStr}`;
  };

  const executive = data?.executive || {
    visitorsToday: { unique: 0, total: 0, yesterdayDiffPercent: 0 },
    quotations: { todayCount: 0, weekCount: 0, monthCount: 0 },
    whatsappClicks: { total: 0, peakHour: "--:--", topOrigin: "Hero & Flutuante" },
    phoneCalls: { total: 0, device: "Mobile (Smartphones)", origin: "Header & Contato" },
    appointments: { todayCount: 0, tomorrowCount: 0, weekCount: 0 },
    quoteValues: { today: 0, month: 0, total: 0 },
    topService: { name: "Limpeza de Caixa d'Água", requestsCount: 0 },
    conversionRate: { visitors: 0, waClicks: 0, requests: 0, quotes: 0, clients: 0, overallPercent: 0 },
  };

  const goals = data?.goals || goalsInput;
  const recentQuotes = data?.recentQuotations || [];

  // Charts
  const visitsTrend = data?.charts?.visitsTrend || [
    { day: "Seg", visitas: 0, unicos: 0 },
    { day: "Ter", visitas: 0, unicos: 0 },
    { day: "Qua", visitas: 0, unicos: 0 },
    { day: "Qui", visitas: 0, unicos: 0 },
    { day: "Sex", visitas: 0, unicos: 0 },
    { day: "Sáb", visitas: 0, unicos: 0 },
    { day: "Dom", visitas: 0, unicos: 0 },
  ];

  const topServicesPie = data?.charts?.topServicesPie || [
    { name: "Caixa d'Água", value: 1, color: "#0092E4" },
  ];

  const trafficOriginDonut = data?.charts?.trafficOriginDonut || [
    { name: "Direto", value: 1, color: "#0092E4" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 🚀 Header Principal Executivo com Saudação Personalizada */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B3C5D] via-[#0092E4] to-[#072A42] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-2">
          {/* Greeting Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black tracking-wider border border-amber-400/30">
              <Sparkles size={14} /> Olá, {userName}! {getGreeting()}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Única Ativa
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white">
            Painel Executivo Duarte&apos;s Limpezas
          </h1>
          <p className="text-white/90 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
            {welcomeSubtext}
          </p>

          {/* Last Access Display */}
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-white/70">
            <Clock size={14} className="text-amber-300" />
            <span>Último acesso: <strong className="text-white font-extrabold">{formatLastAccess()}</strong></span>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            href="/admin/quotations"
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#0B3C5D] rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle size={18} /> Central de Orçamentos ERP
          </Link>

          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all shadow-md"
            title="Atualizar dados em tempo real"
          >
            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Ambient background Glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 📊 1. GRUPO DE 8 INDICADORES EXECUTIVOS EM TEMPO REAL */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-heading text-lg font-black text-[#0B3C5D] flex items-center gap-2">
            <BarChart3 size={20} className="text-[#0092E4]" /> Indicadores Comerciais &amp; Operacionais
          </h2>
          <span className="text-xs text-slate-500 font-medium">Atualizado via PostgreSQL</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Visitantes Hoje */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                👥 Visitantes Hoje
              </div>
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <Users size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {executive.visitorsToday.unique}{" "}
                <span className="text-xs font-normal text-slate-400">únicos</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5 pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  Visitas Totais: <strong>{executive.visitorsToday.total}</strong>
                </span>
                <span
                  className={`font-bold flex items-center gap-0.5 ${
                    executive.visitorsToday.yesterdayDiffPercent >= 0
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  <TrendingUp size={13} /> {executive.visitorsToday.yesterdayDiffPercent}% vs ontem
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Orçamentos Solicitados */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                📄 Orçamentos Solicitados
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                <FileText size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {executive.quotations.todayCount}{" "}
                <span className="text-xs font-normal text-slate-400">hoje</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5 pt-2 border-t border-slate-100 font-medium">
                <span className="text-slate-500">
                  Semana: <strong>{executive.quotations.weekCount}</strong>
                </span>
                <span className="text-slate-700">
                  Mês: <strong>{executive.quotations.monthCount}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Cliques no WhatsApp */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                💬 Cliques no WhatsApp
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <MessageSquare size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {executive.whatsappClicks.total}
              </div>
              <div className="text-xs mt-1.5 pt-2 border-t border-slate-100 text-slate-500 font-medium truncate">
                Horário Pico: <strong className="text-slate-800">{executive.whatsappClicks.peakHour}</strong>
              </div>
            </div>
          </div>

          {/* Card 4: Cliques para Ligação */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                📞 Cliques p/ Ligação
              </div>
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                <PhoneCall size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {executive.phoneCalls.total}
              </div>
              <div className="text-xs mt-1.5 pt-2 border-t border-slate-100 text-slate-500 font-medium truncate">
                Dispositivo: <strong className="text-slate-800">{executive.phoneCalls.device}</strong>
              </div>
            </div>
          </div>

          {/* Card 5: Agendamentos */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                📅 Agendamentos
              </div>
              <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600">
                <CalendarIcon size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {executive.appointments.todayCount}{" "}
                <span className="text-xs font-normal text-slate-400">hoje</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5 pt-2 border-t border-slate-100 font-medium text-slate-500">
                <span>Amanhã: <strong>{executive.appointments.tomorrowCount}</strong></span>
                <span>Semana: <strong>{executive.appointments.weekCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Card 6: Valor Estimado dos Orçamentos */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                💰 Valor dos Orçamentos
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <DollarSign size={20} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#0B3C5D] font-mono tracking-tight">
                R$ {executive.quoteValues.month.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5 pt-2 border-t border-slate-100 font-medium text-slate-500">
                <span>Hoje: R$ {executive.quoteValues.today.toFixed(0)}</span>
                <span>Total: R$ {executive.quoteValues.total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Card 7: Serviço Mais Solicitado */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ⭐ Serviço Mais Solicitado
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                <Star size={20} />
              </div>
            </div>
            <div>
              <div className="text-base font-black text-slate-900 truncate">
                {executive.topService.name}
              </div>
              <div className="text-xs mt-1.5 pt-2 border-t border-slate-100 text-slate-500 font-medium">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                  {executive.topService.requestsCount} solicitações
                </span>
              </div>
            </div>
          </div>

          {/* Card 8: Taxa de Conversão */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                📈 Taxa de Conversão
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
                <TrendingUp size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {executive.conversionRate.overallPercent}%
              </div>
              <div className="text-xs mt-1.5 pt-2 border-t border-slate-100 text-slate-500 font-medium truncate">
                Visitas → Cliques → Clientes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 2. PAINEL DE GRÁFICOS E METAS MENSAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico 1: Tendência de Visitas nos Últimos 7 Dias */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading font-black text-lg text-[#0B3C5D] flex items-center gap-2">
                <Activity size={18} className="text-[#0092E4]" /> Tráfego de Acessos ao Site (7 Dias)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Comparativo entre total de visitas e visitantes únicos
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
              Tempo Real
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitsTrend}>
                <defs>
                  <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0092E4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0092E4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorUnicos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B3C5D",
                    borderRadius: "12px",
                    color: "#fff",
                    border: "none",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitas"
                  name="Visitas Totais"
                  stroke="#0092E4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisitas)"
                />
                <Area
                  type="monotone"
                  dataKey="unicos"
                  name="Visitantes Únicos"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUnicos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metas Mensais da Empresa */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-heading font-black text-lg text-[#0B3C5D] flex items-center gap-2">
                <Target size={18} className="text-amber-500" /> Metas do Mês
              </h3>
              <button
                onClick={() => setEditingGoals(!editingGoals)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
              >
                {editingGoals ? "Cancelar" : "Editar"}
              </button>
            </div>

            {editingGoals ? (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meta de Orçamentos</label>
                  <input
                    type="number"
                    value={goalsInput.quotesGoal}
                    onChange={(e) =>
                      setGoalsInput({ ...goalsInput, quotesGoal: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meta de Clientes</label>
                  <input
                    type="number"
                    value={goalsInput.clientsGoal}
                    onChange={(e) =>
                      setGoalsInput({ ...goalsInput, clientsGoal: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meta de Faturamento (R$)</label>
                  <input
                    type="number"
                    value={goalsInput.revenueGoal}
                    onChange={(e) =>
                      setGoalsInput({ ...goalsInput, revenueGoal: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <button
                  onClick={handleSaveGoals}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-[#0B3C5D] font-extrabold text-xs rounded-xl shadow-md"
                >
                  Salvar Novas Metas
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {/* Meta 1: Faturamento */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Faturamento Mensal</span>
                    <span className="text-[#0B3C5D]">
                      R$ {executive.quoteValues.month.toFixed(0)} / R$ {goals.revenueGoal.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (executive.quoteValues.month / Math.max(goals.revenueGoal, 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Meta 2: Orçamentos */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Propostas Emitidas</span>
                    <span className="text-[#0B3C5D]">
                      {executive.quotations.monthCount} / {goals.quotesGoal}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0092E4] to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (executive.quotations.monthCount / Math.max(goals.quotesGoal, 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Meta 3: Clientes Aprovados */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Clientes Aprovados</span>
                    <span className="text-[#0B3C5D]">
                      {executive.conversionRate.clients} / {goals.clientsGoal}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (executive.conversionRate.clients / Math.max(goals.clientsGoal, 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🍕 3. GRÁFICOS DE PIZZA & ORIGEM DE TRÁFEGO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por Serviços Solicitação */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#0B3C5D] flex items-center gap-2">
            <PieIcon size={18} className="text-[#0092E4]" /> Distribuição por Serviços Mais Solicitados
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topServicesPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topServicesPie.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Origem de Tráfego dos Visitantes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#0B3C5D] flex items-center gap-2">
            <MousePointer size={18} className="text-emerald-600" /> Canal de Origem dos Visitantes
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficOriginDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {trafficOriginDonut.map((entry: any, index: number) => (
                    <Cell key={`cell-orig-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 📋 4. TABELA DE ORÇAMENTOS RECENTES & AUDITORIA */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-black text-base text-[#0B3C5D] flex items-center gap-2">
            <FileText size={18} className="text-[#0092E4]" /> Últimas Propostas Comerciais Registradas
          </h3>
          <Link
            href="/admin/quotations"
            className="text-xs font-extrabold text-[#0092E4] hover:underline flex items-center gap-1"
          >
            Ver Todos no ERP <ChevronRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B3C5D] text-white uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Cidade/UF</th>
                <th className="p-3">Data</th>
                <th className="p-3 text-right">Total (R$)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentQuotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Nenhum orçamento cadastrado ainda. Clique em <strong>Central de Orçamentos ERP</strong> para criar o primeiro!
                  </td>
                </tr>
              ) : (
                recentQuotes.map((q: any) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-extrabold text-[#0B3C5D]">{q.code || "ORC-001"}</td>
                    <td className="p-3 font-bold text-slate-900">{q.customerName}</td>
                    <td className="p-3 text-slate-600">{q.customerCity || "Paranavaí"} - {q.customerState || "PR"}</td>
                    <td className="p-3 font-mono text-slate-500">{new Date(q.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3 text-right font-mono font-extrabold text-slate-900">
                      R$ {q.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          q.status === "COMPLETED" || q.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {q.status || "PENDING"}
                      </span>
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
