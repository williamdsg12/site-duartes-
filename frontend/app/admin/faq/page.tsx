"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, X, Loader2 } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = async () => {
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    if (Array.isArray(data)) setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditing({
      id: "",
      question: "",
      answer: "",
      order: faqs.length + 1,
      active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const url = "/api/admin/faq";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (res.ok) {
        setEditing(null);
        fetchFaqs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta pergunta frequente?")) return;
    try {
      const res = await fetch(`/api/admin/faq?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0B3C5D]" />
        Carregando FAQ...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Perguntas Frequentes (FAQ)</h1>
          <p className="text-sm text-slate-500">Cadastre e organize as dúvidas frequentes dos clientes.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3C5D] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#072A42] transition-colors"
        >
          <Plus size={18} /> Adicionar Pergunta
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1 space-y-1">
              <h3 className="font-heading font-bold text-base text-slate-900">{f.question}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.answer}</p>
            </div>
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
              <button
                onClick={() => {
                  setIsNew(false);
                  setEditing(f);
                }}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                <Edit3 size={18} />
              </button>
              <button onClick={() => handleDelete(f.id)} className="p-2 text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                {isNew ? "Nova Pergunta FAQ" : "Editar FAQ"}
              </h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Pergunta</label>
                <input
                  type="text"
                  required
                  value={editing.question}
                  onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Resposta</label>
                <textarea
                  rows={4}
                  required
                  value={editing.answer}
                  onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 rounded-xl border text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0B3C5D] text-sm font-bold text-white shadow-md hover:bg-[#072A42] transition-colors"
                >
                  {saving ? "Salvando..." : "Salvar Pergunta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
