"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User, X, CheckCircle2 } from "lucide-react";

interface AppointmentModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function AppointmentModal({ onClose, onSaved }: AppointmentModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [serviceTitle, setServiceTitle] = useState("Limpeza de Caixa d'Água");
  const [address, setAddress] = useState("Paranavaí - PR");
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("08:00");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !serviceTitle) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          serviceTitle,
          address,
          scheduledAt,
          timeSlot,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar agendamento");

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Falha ao criar agendamento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0B3C5D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="text-amber-400" size={20} />
            <h3 className="font-heading font-extrabold text-lg">Novo Agendamento na Agenda</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800 text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nome do Cliente *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Serviço Agendado *</label>
            <select
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none bg-white font-semibold"
            >
              <option value="Limpeza de Caixa d'Água">Limpeza de Caixa d'Água</option>
              <option value="Desentupimento Residencial / Comercial">Desentupimento Residencial / Comercial</option>
              <option value="Limpeza Pós-Obra">Limpeza Pós-Obra</option>
              <option value="Limpeza de Fossa / Caixa de Gordura">Limpeza de Fossa / Caixa de Gordura</option>
              <option value="Hidrojateamento">Hidrojateamento</option>
              <option value="Dedetização & Controle de Pragas">Dedetização &amp; Controle de Pragas</option>
              <option value="Manutenção Hidráulica e Elétrica">Manutenção Hidráulica e Elétrica</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Endereço da Execução *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua XXX, Nº Y, Bairro, Cidade"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Data *</label>
              <input
                type="date"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Horário *</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="08:00"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Observações / Detalhes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chave na portaria, acesso pelo portão lateral..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0B3C5D] outline-none text-xs"
            />
          </div>

          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span>Sincronização com <strong>Google Calendar</strong> habilitada para integrações posteriores.</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#0B3C5D] hover:bg-[#072A42] text-white rounded-xl font-bold text-xs shadow-md disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
