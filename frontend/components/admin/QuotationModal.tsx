"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Printer,
  Send,
  Mail,
  Copy,
  X,
  Calculator,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import QuotationPdfView from "./QuotationPdfView";

interface Item {
  serviceName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface QuotationModalProps {
  initialData?: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function QuotationModal({ initialData, onClose, onSaved }: QuotationModalProps) {
  const [customerName, setCustomerName] = useState(initialData?.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(initialData?.customerPhone || "");
  const [customerWhatsapp, setCustomerWhatsapp] = useState(initialData?.customerWhatsapp || "");
  const [customerEmail, setCustomerEmail] = useState(initialData?.customerEmail || "");
  const [customerAddress, setCustomerAddress] = useState(initialData?.customerAddress || "");
  const [customerCity, setCustomerCity] = useState(initialData?.customerCity || "Paranavaí - PR");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || "PIX");
  const [expirationDate, setExpirationDate] = useState(
    initialData?.expirationDate ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [discount, setDiscount] = useState<number>(initialData?.discount || 0);
  const [items, setItems] = useState<Item[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [
          {
            serviceName: "Limpeza de Caixa d'Água Residencial",
            quantity: 1,
            unitPrice: 250,
            subtotal: 250,
          },
        ]
  );

  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [savedQuotation, setSavedQuotation] = useState<any>(initialData || null);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAvailableServices(data);
      })
      .catch(() => {});
  }, []);

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

  const handleSave = async () => {
    if (!customerName.trim()) {
      alert("Por favor, preencha o nome do cliente.");
      return null;
    }

    setSaving(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        customerWhatsapp: customerWhatsapp || customerPhone,
        customerEmail,
        customerAddress,
        customerCity,
        notes,
        paymentMethod,
        expirationDate,
        subtotal,
        discount,
        total,
        items,
      };

      const url = initialData?.id
        ? `/api/admin/quotations/${initialData.id}`
        : "/api/admin/quotations";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar orçamento");
      const data = await res.json();

      setSavedQuotation(data);
      onSaved();
      setSaving(false);
      return data;
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar orçamento.");
      setSaving(false);
      return null;
    }
  };

  const handleGeneratePdf = async () => {
    let q = savedQuotation;
    if (!q) {
      q = await handleSave();
    }
    if (q) {
      setShowPdf(true);
    }
  };

  const handleSendWhatsapp = async () => {
    let q = savedQuotation;
    if (!q) q = await handleSave();
    if (!q) return;

    const phone = (customerWhatsapp || customerPhone || "").replace(/\D/g, "");
    const waTarget = phone ? (phone.startsWith("55") ? phone : `55${phone}`) : "5544997069677";

    const msg = `Olá *${customerName}*! 👋%0A%0ASegue o seu orçamento da *Duarte's Limpezas e Desentupidora*:%0A%0A📄 *Código:* ${q.code || "ORC-DUARTE"}%0A💰 *Valor Total:* R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%0A💳 *Forma de Pagamento:* ${paymentMethod}%0A📅 *Validade:* ${expirationDate}%0A%0A*Itens:*%0A${items.map((i) => `• ${i.serviceName} (${i.quantity}x) = R$ ${i.subtotal.toFixed(2)}`).join("%0A")}%0A%0AQualquer dúvida estamos à disposição!`;

    window.open(`https://wa.me/${waTarget}?text=${msg}`, "_blank");
  };

  const handleSendEmail = async () => {
    let q = savedQuotation;
    if (!q) q = await handleSave();
    if (!q) return;

    const subject = encodeURIComponent(`Orçamento Duarte's Limpezas - ${q.code || customerName}`);
    const body = encodeURIComponent(
      `Olá ${customerName},\n\nConforme solicitado, enviamos o orçamento de serviços da Duarte's Limpezas.\n\nTotal: R$ ${total.toFixed(2)}\nForma de Pagamento: ${paymentMethod}\nValidade: ${expirationDate}\n\nFicamos à disposição.`
    );
    window.open(`mailto:${customerEmail || ""}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleDuplicate = () => {
    setSavedQuotation(null);
    setCustomerName(`${customerName} (Cópia)`);
    alert("Orçamento duplicado! Ajuste os valores e clique em Salvar.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Header */}
        <div className="bg-[#0B3C5D] text-white px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-400 text-[#0B3C5D] flex items-center justify-center font-bold">
              <Calculator size={22} />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl">
                {initialData?.id ? "Editar Orçamento" : "Central de Orçamentos - Novo Orçamento"}
              </h2>
              <p className="text-xs text-white/70">
                Gere propostas comerciais modernas e envie diretamente via WhatsApp ou PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto text-slate-800">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <UserCheck size={16} /> 1. Dados do Cliente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Telefone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(44) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="(44) 99706-9677"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Endereço</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Rua / Av., Número, Bairro"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cidade / Estado</label>
                <input
                  type="text"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="Paranavaí - PR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Services List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider">
                2. Serviços do Orçamento
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0B3C5D] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
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
                      Serviço
                    </label>
                    <input
                      type="text"
                      value={item.serviceName}
                      onChange={(e) => handleItemChange(idx, "serviceName", e.target.value)}
                      placeholder="Nome do serviço"
                      list="services-list"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Qtd</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] bg-white"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#0B3C5D] bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2 text-right">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Subtotal
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
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

          {/* Payment Method & Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                3. Condições do Orçamento
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B3C5D]"
                >
                  <option value="PIX">PIX (À Vista com Desconto)</option>
                  <option value="À vista (Dinheiro / Débito)">À vista (Dinheiro / Débito)</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Parcelado em até 3x">Parcelado em até 3x</option>
                  <option value="Faturamento para 30 dias (Empresas)">Faturamento p/ 30 dias</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Validade do Orçamento</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Observações Gerais</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruções de acesso, detalhes da equipe ou garantia..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Resumo de Valores
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal Serviços:</span>
                  <span className="font-mono font-semibold">
                    R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-600">
                  <span>Desconto (R$):</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1 border border-slate-200 rounded-lg text-right font-mono font-semibold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-base">Total Geral:</span>
                  <span className="font-mono font-extrabold text-2xl text-[#0B3C5D]">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {savedQuotation && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Orçamento registrado com código <strong>{savedQuotation.code}</strong>.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-8 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDuplicate}
              className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Copy size={16} /> Duplicar
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Mail size={16} /> E-mail
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSendWhatsapp}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send size={16} /> WhatsApp
            </button>

            <button
              type="button"
              onClick={handleGeneratePdf}
              className="px-4 py-2.5 bg-[#0B3C5D] hover:bg-[#072A42] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer size={16} /> Gerar PDF
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0B3C5D] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {saving ? "Salvando..." : "Salvar Orçamento"}
            </button>
          </div>
        </div>
      </div>

      {/* PDF View Modal Overlay */}
      {showPdf && (
        <QuotationPdfView
          quotation={{
            code: savedQuotation?.code,
            customerName,
            customerPhone,
            customerWhatsapp,
            customerEmail,
            customerAddress,
            customerCity,
            notes,
            subtotal,
            discount,
            total,
            paymentMethod,
            expirationDate,
            items,
          }}
          onClose={() => setShowPdf(false)}
        />
      )}
    </div>
  );
}
