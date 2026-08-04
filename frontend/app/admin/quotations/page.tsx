"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Printer,
  Send,
  Mail,
  Trash2,
  Save,
  Plus,
  Calculator,
  UserCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  X,
  FileSpreadsheet,
  MapPin,
} from "lucide-react";
import QuotationPdfView from "@/components/admin/QuotationPdfView";

interface Item {
  serviceName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export default function AdminQuotationsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableServices, setAvailableServices] = useState<any[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minValFilter, setMinValFilter] = useState("");
  const [maxValFilter, setMaxValFilter] = useState("");

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("Paranavaí");
  const [customerState, setCustomerState] = useState("PR");
  const [customerCep, setCustomerCep] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [expirationDate, setExpirationDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [discount, setDiscount] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([
    {
      serviceName: "Limpeza de Caixa d'Água Residencial",
      quantity: 1,
      unitPrice: 250,
      subtotal: 250,
    },
  ]);

  // ViaCEP integration state
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepMessage, setCepMessage] = useState("");

  const [saving, setSaving] = useState(false);
  const [pdfQuotation, setPdfQuotation] = useState<any | null>(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set("search", searchQuery);
      if (statusFilter && statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (minValFilter) queryParams.set("minVal", minValFilter);
      if (maxValFilter) queryParams.set("maxVal", maxValFilter);

      const res = await fetch(`/api/admin/quotations?${queryParams.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuotations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAvailableServices(data);
      })
      .catch(() => {});
  }, []);

  // ViaCEP Auto-Fill Handler
  const handleCepChange = (rawCep: string) => {
    setCustomerCep(rawCep);
    const clean = rawCep.replace(/\D/g, "");
    if (clean.length === 8) {
      setLoadingCep(true);
      setCepMessage("🔍 Buscando endereço via ViaCEP...");
      fetch(`https://viacep.com.br/ws/${clean}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) {
            setCepMessage("⚠️ CEP não encontrado. Preencha o endereço manualmente.");
          } else {
            const street = data.logradouro
              ? `${data.logradouro}${data.bairro ? `, ${data.bairro}` : ""}`
              : customerAddress;
            if (street) setCustomerAddress(street);
            if (data.localidade) setCustomerCity(data.localidade);
            if (data.uf) setCustomerState(data.uf);
            setCepMessage("✅ Endereço preenchido automaticamente via ViaCEP!");
            setTimeout(() => setCepMessage(""), 4000);
          }
        })
        .catch(() => {
          setCepMessage("⚠️ Erro ao consultar ViaCEP.");
        })
        .finally(() => setLoadingCep(false));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotations();
  };

  // Recalculate Subtotal and Total
  const subtotal = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  const total = Math.max(0, subtotal - discount);

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      item.quantity = Number(item.quantity) || 1;
      item.unitPrice = Number(item.unitPrice) || 0;
      item.subtotal = item.quantity * item.unitPrice;
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        serviceName: availableServices[0]?.title || "Desentupimento e Manutenção",
        quantity: 1,
        unitPrice: 150,
        subtotal: 150,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingCode("");
    setCustomerName("");
    setCpfCnpj("");
    setCustomerPhone("");
    setCustomerWhatsapp("");
    setCustomerEmail("");
    setCustomerAddress("");
    setCustomerCity("Paranavaí");
    setCustomerState("PR");
    setCustomerCep("");
    setCepMessage("");
    setNotes("");
    setPaymentMethod("PIX");
    setExpirationDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setDiscount(0);
    setItems([
      {
        serviceName: "Limpeza de Caixa d'Água Residencial",
        quantity: 1,
        unitPrice: 250,
        subtotal: 250,
      },
    ]);
  };

  const loadForEdit = (q: any) => {
    setEditingId(q.id);
    setEditingCode(q.code || "");
    setCustomerName(q.customerName || "");
    setCpfCnpj(q.cpfCnpj || "");
    setCustomerPhone(q.customerPhone || "");
    setCustomerWhatsapp(q.customerWhatsapp || q.customerPhone || "");
    setCustomerEmail(q.customerEmail || "");
    setCustomerAddress(q.customerAddress || "");
    setCustomerCity(q.customerCity || "Paranavaí");
    setCustomerState(q.customerState || "PR");
    setCustomerCep(q.customerCep || "");
    setNotes(q.notes || "");
    setPaymentMethod(q.paymentMethod || "PIX");
    setExpirationDate(
      q.expirationDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    setDiscount(q.discount || 0);
    setItems(
      q.items && q.items.length > 0
        ? q.items.map((i: any) => ({
            serviceName: i.serviceName || i.description || "Serviço",
            quantity: i.quantity || 1,
            unitPrice: i.unitPrice || i.valor || 0,
            subtotal: i.subtotal || (i.quantity || 1) * (i.unitPrice || i.valor || 0),
          }))
        : [
            {
              serviceName: "Limpeza de Caixa d'Água Residencial",
              quantity: 1,
              unitPrice: 250,
              subtotal: 250,
            },
          ]
    );
    setActiveTab("form");
  };

  const handleSaveQuotation = async () => {
    if (!customerName.trim()) {
      alert("Por favor, preencha o Nome do Cliente.");
      return null;
    }

    setSaving(true);
    try {
      const payload = {
        customerName,
        cpfCnpj,
        customerPhone,
        customerWhatsapp: customerWhatsapp || customerPhone,
        customerEmail,
        customerAddress,
        customerCity,
        customerState,
        customerCep,
        notes,
        paymentMethod,
        expirationDate,
        subtotal,
        discount,
        total,
        items,
      };

      const url = editingId ? `/api/admin/quotations/${editingId}` : "/api/admin/quotations";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar orçamento");
      const savedData = await res.json();

      setEditingId(savedData.id);
      setEditingCode(savedData.code);
      fetchQuotations();
      setSaving(false);
      return savedData;
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar orçamento no banco de dados.");
      setSaving(false);
      return null;
    }
  };

  const handleGeneratePdf = async (qData?: any) => {
    let q = qData;
    if (!q) {
      if (editingId) {
        q = {
          id: editingId,
          code: editingCode,
          customerName,
          cpfCnpj,
          customerPhone,
          customerWhatsapp,
          customerEmail,
          customerAddress,
          customerCity,
          customerState,
          customerCep,
          notes,
          subtotal,
          discount,
          total,
          paymentMethod,
          expirationDate,
          items,
        };
      } else {
        q = await handleSaveQuotation();
      }
    }
    if (q) setPdfQuotation(q);
  };

  const handleSendWhatsapp = async (qData?: any) => {
    let q = qData;
    if (!q) q = await handleSaveQuotation();
    if (!q) return;

    const phone = (q.customerWhatsapp || q.customerPhone || "").replace(/\D/g, "");
    const waTarget = phone ? (phone.startsWith("55") ? phone : `55${phone}`) : "5544997069677";

    const servicesList = q.items && q.items.length > 0
      ? q.items.map((i: any) => `• ${i.serviceName || i.description || "Serviço"} (${i.quantity}x)`).join("\n")
      : "• Serviço de Manutenção Duarte's";

    const msg = `Olá, ${q.customerName}! 👋\n\nSegue o orçamento referente ao serviço solicitado de:\n\n${servicesList}\n\n💰 Total: R$ ${q.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}\n\nO documento em PDF / imagem está pronto para sua análise.\n\nCaso tenha qualquer dúvida, estaremos à disposição.\n\nAgradecemos pela preferência!\n\nDuarte's Manutenção em Geral\n📞 (44) 9 9706-9677`;

    window.open(`https://wa.me/${waTarget}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSendEmail = async (qData?: any) => {
    let q = qData;
    if (!q) q = await handleSaveQuotation();
    if (!q) return;

    const subject = encodeURIComponent(`Orçamento Duarte's Manutenção em Geral - ${q.code || q.customerName}`);
    const body = encodeURIComponent(
      `Olá ${q.customerName},\n\nConforme solicitado, enviamos o orçamento de serviços da Duarte's Manutenção em Geral.\n\nCódigo: ${q.code || "ORC"}\nTotal: R$ ${q.total.toFixed(2)}\nForma de Pagamento: ${q.paymentMethod}\n\nFicamos à disposição.`
    );
    window.open(`mailto:${q.customerEmail || ""}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleDuplicate = (q: any) => {
    setEditingId(null);
    setEditingCode("");
    setCustomerName(`${q.customerName} (Cópia)`);
    setCpfCnpj(q.cpfCnpj || "");
    setCustomerPhone(q.customerPhone || "");
    setCustomerWhatsapp(q.customerWhatsapp || "");
    setCustomerEmail(q.customerEmail || "");
    setCustomerAddress(q.customerAddress || "");
    setCustomerCity(q.customerCity || "Paranavaí");
    setCustomerState(q.customerState || "PR");
    setCustomerCep(q.customerCep || "");
    setNotes(q.notes || "");
    setPaymentMethod(q.paymentMethod || "PIX");
    setExpirationDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setDiscount(q.discount || 0);
    setItems(
      q.items && q.items.length > 0
        ? q.items.map((i: any) => ({
            serviceName: i.serviceName || i.description || "Serviço",
            quantity: i.quantity || 1,
            unitPrice: i.unitPrice || i.valor || 0,
            subtotal: i.subtotal || (i.quantity || 1) * (i.unitPrice || i.valor || 0),
          }))
        : []
    );
    setActiveTab("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este orçamento permanentemente?")) return;
    try {
      const res = await fetch(`/api/admin/quotations/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchQuotations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const totalAmount = quotations.reduce((acc, q) => acc + (q.total || 0), 0);
  const approvedCount = quotations.filter(
    (q) => q.status === "APPROVED" || q.status === "COMPLETED"
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B3C5D] via-[#124E78] to-[#072A42] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
            📄 Módulo de Gestão ERP
          </span>
          <h1 className="font-heading text-3xl font-black tracking-tight">
            Central de Orçamentos Duarte&apos;s
          </h1>
          <p className="mt-1 text-white/80 text-xs sm:text-sm">
            Gerencie propostas comerciais, emita PDF idêntico ao modelo oficial e compartilhe via WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetForm();
              setActiveTab("form");
            }}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-[#0B3C5D] rounded-2xl font-extrabold text-sm shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle size={18} /> Novo Orçamento
          </button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{quotations.length}</div>
            <div className="text-xs font-medium text-slate-500">Orçamentos Emitidos</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B3C5D]">
              R$ {totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-medium text-slate-500">Valor Total Acumulado</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{approvedCount}</div>
            <div className="text-xs font-medium text-slate-500">Propostas Aprovadas</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 flex items-center gap-2 shadow-xs">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === "list"
              ? "bg-[#0B3C5D] text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText size={18} /> Aba 1: Meus Orçamentos ({quotations.length})
        </button>

        <button
          onClick={() => {
            if (activeTab !== "form") resetForm();
            setActiveTab("form");
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === "form"
              ? "bg-[#0B3C5D] text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <PlusCircle size={18} /> Aba 2: Novo Orçamento {editingId ? "(Editando)" : ""}
        </button>
      </div>

      {/* TAB 1: MEUS ORÇAMENTOS */}
      {activeTab === "list" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          {/* Search & Filter Bar */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Nome, Cidade, CPF ou CNPJ..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0B3C5D] outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-[#0B3C5D] outline-none"
              >
                <option value="ALL">Todos os Status</option>
                <option value="PENDING">Pendente</option>
                <option value="APPROVED">Aprovado</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <input
                type="number"
                value={minValFilter}
                onChange={(e) => setMinValFilter(e.target.value)}
                placeholder="Valor mín."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0B3C5D] outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#0B3C5D] hover:bg-[#072A42] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
              >
                <Filter size={14} /> Filtrar
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setMinValFilter("");
                  setMaxValFilter("");
                  fetchQuotations();
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
                title="Limpar Filtros"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </form>

          {/* Quotations Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B3C5D] text-white uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Nº Orçamento</th>
                  <th className="p-3.5">Cliente / CPF-CNPJ</th>
                  <th className="p-3.5">Cidade / UF</th>
                  <th className="p-3.5">Data</th>
                  <th className="p-3.5 text-right">Valor Total</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Carregando orçamentos do banco de dados...
                    </td>
                  </tr>
                ) : quotations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Nenhum orçamento encontrado. Clique na <strong>Aba 2: Novo Orçamento</strong> para criar uma proposta comercial!
                    </td>
                  </tr>
                ) : (
                  quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-extrabold text-[#0B3C5D]">
                        {q.code || "ORC-001"}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{q.customerName}</div>
                        {q.cpfCnpj && <div className="text-[10px] text-slate-400 font-mono">CPF/CNPJ: {q.cpfCnpj}</div>}
                      </td>
                      <td className="p-3.5 text-slate-700">
                        {q.customerCity || "Paranavaí"} - {q.customerState || "PR"}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">
                        {new Date(q.createdAt).toLocaleDateString("pt-BR")}
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
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleGeneratePdf(q)}
                            className="p-1.5 bg-slate-100 hover:bg-[#0B3C5D] hover:text-white text-slate-700 rounded-lg transition-colors"
                            title="Gerar PDF Profissional"
                          >
                            <Printer size={15} />
                          </button>

                          <button
                            onClick={() => handleSendWhatsapp(q)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-lg transition-colors"
                            title="Compartilhar no WhatsApp"
                          >
                            <Send size={15} />
                          </button>

                          <button
                            onClick={() => handleSendEmail(q)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg transition-colors"
                            title="Enviar por E-mail"
                          >
                            <Mail size={15} />
                          </button>

                          <button
                            onClick={() => loadForEdit(q)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 rounded-lg transition-colors"
                            title="Editar Orçamento"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            onClick={() => handleDuplicate(q)}
                            className="p-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 rounded-lg transition-colors"
                            title="Duplicar Orçamento"
                          >
                            <Copy size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors"
                            title="Excluir Orçamento"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NOVO ORÇAMENTO (FORMULÁRIO COMPLETO COM VIACEP) */}
      {activeTab === "form" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-8 text-slate-800">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-heading font-black text-xl text-[#0B3C5D]">
                {editingId ? `Editar Orçamento ${editingCode}` : "Formulário de Novo Orçamento ERP"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Preencha as informações abaixo para gerar a proposta comercial oficial da Duarte&apos;s
              </p>
            </div>
            {editingId && (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs">
                Editando Código {editingCode}
              </span>
            )}
          </div>

          {/* Section 1: Customer Data & ViaCEP */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <UserCheck size={16} /> 1. Dados do Cliente &amp; Endereço (ViaCEP)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João da Silva / Construtora Duarte"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CPF ou CNPJ</label>
                <input
                  type="text"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CEP (Busca Automática)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerCep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="87702-430"
                    maxLength={9}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none font-mono font-bold text-[#0B3C5D]"
                  />
                  {loadingCep && (
                    <div className="absolute right-3 top-2.5 text-xs text-amber-500 font-bold animate-pulse">
                      Buscando...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(44) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="(44) 99706-9677"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Logradouro e Bairro (Auto-preenchido pelo CEP)
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Rua / Av., Bairro, Número"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cidade</label>
                <input
                  type="text"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="Paranavaí"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado (UF)</label>
                <input
                  type="text"
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value)}
                  placeholder="PR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none uppercase font-semibold"
                />
              </div>
            </div>

            {cepMessage && (
              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs font-semibold border border-blue-200 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600 shrink-0" />
                <span>{cepMessage}</span>
              </div>
            )}
          </div>

          {/* Section 2: Services List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                2. Serviços do Orçamento
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0B3C5D] text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus size={16} /> Adicionar Serviço
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-5">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Descrição do Serviço
                    </label>
                    <input
                      type="text"
                      value={item.serviceName}
                      onChange={(e) => handleItemChange(idx, "serviceName", e.target.value)}
                      placeholder="Nome do serviço"
                      list="services-list"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#0B3C5D] bg-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Qtd</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-center font-bold focus:ring-2 focus:ring-[#0B3C5D] bg-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Valor Unit. (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-right font-mono font-bold focus:ring-2 focus:ring-[#0B3C5D] bg-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 text-right">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Subtotal
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">
                      R$ {item.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <datalist id="services-list">
              {availableServices.map((s) => (
                <option key={s.id} value={s.title} />
              ))}
            </datalist>
          </div>

          {/* Section 3: Conditions & Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="space-y-4 text-xs">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                3. Condições Comerciais
              </h3>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                >
                  <option value="PIX">PIX (À Vista com Desconto)</option>
                  <option value="À vista (Dinheiro / Débito)">À vista (Dinheiro / Débito)</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Parcelado em até 3x">Parcelado em até 3x</option>
                  <option value="Faturamento para 30 dias (Empresas)">Faturamento p/ 30 dias</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Validade do Orçamento</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações do Orçamento</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Garantia de 90 dias, acesso livre ao imóvel..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Resumo de Valores
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Serviços:</span>
                  <span className="font-mono font-semibold">
                    R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Desconto (R$):</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1 border border-slate-200 rounded-lg text-right font-mono font-semibold text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  />
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-sm">Total Geral:</span>
                  <span className="font-mono font-black text-2xl text-[#0B3C5D]">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {editingCode && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Código de Orçamento registrado: <strong>{editingCode}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("list");
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Voltar para Lista
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSendWhatsapp()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Send size={16} /> WhatsApp
              </button>

              <button
                type="button"
                onClick={() => handleSendEmail()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Mail size={16} /> E-mail
              </button>

              <button
                type="button"
                onClick={() => handleGeneratePdf()}
                className="px-4 py-2.5 bg-[#0B3C5D] hover:bg-[#072A42] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Printer size={16} /> Gerar PDF Profissional
              </button>

              <button
                type="button"
                onClick={() => handleSaveQuotation()}
                disabled={saving}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0B3C5D] rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
              >
                <Save size={16} /> {saving ? "Salvando..." : "Salvar Orçamento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Printable Overlay */}
      {pdfQuotation && (
        <QuotationPdfView quotation={pdfQuotation} onClose={() => setPdfQuotation(null)} />
      )}
    </div>
  );
}
