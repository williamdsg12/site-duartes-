"use client";

import { useEffect, useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    logoUrl: "",
    logoHeroUrl: "",
    faviconUrl: "",
    primaryColor: "",
    accentColor: "",
    footerText: "",
    copyrightText: "",
    waButtonText: "",
    callButtonText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setForm(data);
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
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
        Carregando Configurações...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Configurações Gerais &amp; Aparência</h1>
        <p className="text-sm text-slate-500">Configure os elementos visuais, logo, cores de destaque e rodape do site.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check size={18} className="text-emerald-600" /> Configurações salvas!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">URL do Logo (Navegação &amp; Rodapé)</label>
            <input
              type="text"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">URL do Favicon</label>
            <input
              type="text"
              value={form.faviconUrl}
              onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cor Primária (Hexadecimal)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.primaryColor || "#0B3C5D"}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="h-10 w-12 rounded-lg border p-1 cursor-pointer"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-sm font-mono focus:border-[#0B3C5D] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cor de Destaque / Accent (Hexadecimal)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.accentColor || "#FFC107"}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="h-10 w-12 rounded-lg border p-1 cursor-pointer"
              />
              <input
                type="text"
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="flex-1 rounded-xl border border-slate-300 p-2.5 text-sm font-mono focus:border-[#0B3C5D] focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Texto Explicativo do Rodapé</label>
            <textarea
              rows={2}
              value={form.footerText}
              onChange={(e) => setForm({ ...form, footerText: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Texto de Copyright</label>
            <input
              type="text"
              value={form.copyrightText}
              onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
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
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />} Salvar Aparência
          </button>
        </div>
      </form>
    </div>
  );
}
