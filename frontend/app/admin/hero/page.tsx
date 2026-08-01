"use client";

import { useEffect, useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";

export default function AdminHeroPage() {
  const [form, setForm] = useState({
    badgeText: "",
    titleLine1: "",
    titleLine2: "",
    titleLine3: "",
    subtitle: "",
    videoUrl: "",
    posterUrl: "",
    button1Text: "",
    button1Link: "",
    button2Text: "",
    button2Link: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/hero")
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
      const res = await fetch("/api/admin/hero", {
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
        Carregando Banner Principal...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Banner Principal (Hero)</h1>
        <p className="text-sm text-slate-500">Altere a frase principal, vídeo de fundo e botões de destaque do site.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check size={18} className="text-emerald-600" /> Hero Banner atualizado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Selo Superior / Badge
            </label>
            <input
              type="text"
              value={form.badgeText}
              onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Título Linha 1
            </label>
            <input
              type="text"
              value={form.titleLine1}
              onChange={(e) => setForm({ ...form, titleLine1: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Título Linha 2 (Destaque Amarelo)
            </label>
            <input
              type="text"
              value={form.titleLine2}
              onChange={(e) => setForm({ ...form, titleLine2: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Título Linha 3
            </label>
            <input
              type="text"
              value={form.titleLine3}
              onChange={(e) => setForm({ ...form, titleLine3: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Subtítulo / Parágrafo Explicativo
            </label>
            <textarea
              rows={3}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              URL do Vídeo de Fundo (.mp4)
            </label>
            <input
              type="text"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Imagem de Poster (Carregamento)
            </label>
            <input
              type="text"
              value={form.posterUrl}
              onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Texto Botão 1
            </label>
            <input
              type="text"
              value={form.button1Text}
              onChange={(e) => setForm({ ...form, button1Text: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Link Botão 1
            </label>
            <input
              type="text"
              value={form.button1Link}
              onChange={(e) => setForm({ ...form, button1Link: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Texto Botão 2
            </label>
            <input
              type="text"
              value={form.button2Text}
              onChange={(e) => setForm({ ...form, button2Text: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Link Botão 2
            </label>
            <input
              type="text"
              value={form.button2Link}
              onChange={(e) => setForm({ ...form, button2Link: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C5D] px-6 py-3 font-bold text-white shadow-md hover:bg-[#072A42] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />} Salvar Banner
          </button>
        </div>
      </form>
    </div>
  );
}
