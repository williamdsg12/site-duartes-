"use client";

import { useEffect, useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";

export default function AdminSeoPage() {
  const [form, setForm] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "",
    canonicalUrl: "",
    robots: "",
    schemaLd: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/seo")
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
      const res = await fetch("/api/admin/seo", {
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
        Carregando SEO...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Otimização para Buscadores (SEO)</h1>
        <p className="text-sm text-slate-500">Gerencie títulos, descrições meta, imagens de compartilhamento e marcas de dados estruturados.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check size={18} className="text-emerald-600" /> Configurações de SEO salvas com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Meta Title (Título do Google)</label>
            <input
              type="text"
              required
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Meta Description (Descrição no Google)</label>
            <textarea
              rows={3}
              required
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Palavras-chave (Keywords separadas por vírgula)</label>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Open Graph Title (Redes Sociais)</label>
              <input
                type="text"
                value={form.ogTitle}
                onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Open Graph Image (URL)</label>
              <input
                type="text"
                value={form.ogImage}
                onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">URL Canônica</label>
              <input
                type="text"
                value={form.canonicalUrl}
                onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Diretivas de Robôs (Robots)</label>
              <input
                type="text"
                value={form.robots}
                onChange={(e) => setForm({ ...form, robots: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Dados Estruturados JSON-LD (Schema.org)</label>
            <textarea
              rows={5}
              value={form.schemaLd}
              onChange={(e) => setForm({ ...form, schemaLd: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono focus:border-[#0B3C5D] focus:outline-none bg-slate-50"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C5D] px-6 py-3 font-bold text-white shadow-md hover:bg-[#072A42] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />} Salvar Configurações SEO
          </button>
        </div>
      </form>
    </div>
  );
}
