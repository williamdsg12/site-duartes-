"use client";

import { useEffect, useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";

export default function AdminContactPage() {
  const [form, setForm] = useState({
    phoneDisplay: "",
    phoneRaw: "",
    email: "",
    address: "",
    city: "",
    hours: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/general")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            phoneDisplay: data.phoneDisplay || "",
            phoneRaw: data.phoneRaw || "",
            email: data.email || "",
            address: data.address || "",
            city: data.city || "",
            hours: data.hours || "",
          });
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0B3C5D]" />
        Carregando Contatos...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Canais de Contato</h1>
        <p className="text-sm text-slate-500">Configure os telefones, WhatsApp, e-mail e endereço exibidos no rodapé e botões de contato.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check size={18} className="text-emerald-600" /> Canais de contato salvos!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Telefone Principal (Exibição)</label>
            <input
              type="text"
              value={form.phoneDisplay}
              onChange={(e) => setForm({ ...form, phoneDisplay: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">WhatsApp (Apenas números: Ex 5544997069677)</label>
            <input
              type="text"
              value={form.phoneRaw}
              onChange={(e) => setForm({ ...form, phoneRaw: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">E-mail Comercial</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Horário de Atendimento</label>
            <input
              type="text"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Endereço</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cidade / Estado / CEP</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C5D] px-6 py-3 font-bold text-white shadow-md hover:bg-[#072A42] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />} Salvar Contatos
          </button>
        </div>
      </form>
    </div>
  );
}
