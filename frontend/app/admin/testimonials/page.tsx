"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Star, X, Loader2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  photo: string | null;
  order: number;
  active: boolean;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditing({
      id: "",
      name: "",
      role: "Cliente",
      text: "",
      rating: 5,
      photo: "",
      order: items.length + 1,
      active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const url = "/api/admin/testimonials";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (res.ok) {
        setEditing(null);
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este depoimento?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0B3C5D]" />
        Carregando Depoimentos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Gerenciar Depoimentos</h1>
          <p className="text-sm text-slate-500">Cadastre e edite as avaliações de clientes exibidas na página inicial.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3C5D] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#072A42] transition-colors"
        >
          <Plus size={18} /> Adicionar Depoimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={16} fill={s < item.rating ? "currentColor" : "none"} className={s < item.rating ? "" : "text-slate-200"} />
                ))}
              </div>
              <p className="text-slate-700 italic text-sm mb-4 leading-relaxed line-clamp-4">&ldquo;{item.text}&rdquo;</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-slate-900">{item.name}</div>
                <div className="text-xs text-slate-400">{item.role}</div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditing(item);
                  }}
                  className="p-2 text-slate-600 hover:text-slate-900"
                >
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                {isNew ? "Novo Depoimento" : "Editar Depoimento"}
              </h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cidade / Cargo</label>
                <input
                  type="text"
                  value={editing.role}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Estrelas (1 a 5)</label>
                <select
                  value={editing.rating}
                  onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) || 5 })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none bg-white"
                >
                  <option value={5}>5 Estrelas ★★★★★</option>
                  <option value={4}>4 Estrelas ★★★★☆</option>
                  <option value={3}>3 Estrelas ★★★☆☆</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Depoimento</label>
                <textarea
                  rows={4}
                  required
                  value={editing.text}
                  onChange={(e) => setEditing({ ...editing, text: e.target.value })}
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
                  {saving ? "Salvando..." : "Salvar Depoimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
