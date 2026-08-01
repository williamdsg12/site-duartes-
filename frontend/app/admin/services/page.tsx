"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Check, X, Wrench, Droplets, Waves, Gauge, Trash, Bug, Zap, Loader2 } from "lucide-react";

const ICONS = ["Droplets", "Waves", "Gauge", "Trash2", "Bug", "Wrench", "Zap"];

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  buttonLink: string | null;
  order: number;
  active: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    if (Array.isArray(data)) setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditing({
      id: "",
      title: "",
      description: "",
      icon: "Wrench",
      buttonText: "Solicitar orçamento",
      buttonLink: "",
      order: services.length + 1,
      active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const url = "/api/admin/services";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (res.ok) {
        setEditing(null);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, active: !s.active }),
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0B3C5D]" />
        Carregando Serviços...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Gerenciar Serviços</h1>
          <p className="text-sm text-slate-500">Adicione, edite ou altere a ordem dos serviços exibidos no site.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3C5D] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#072A42] transition-colors"
        >
          <Plus size={18} /> Adicionar Serviço
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
              s.active ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  Ordem: {s.order}
                </span>
                <button
                  onClick={() => toggleActive(s)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    s.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {s.active ? "Ativo" : "Inativo"}
                </button>
              </div>

              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">{s.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Ícone: {s.icon}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsNew(false);
                    setEditing(s);
                  }}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                {isNew ? "Adicionar Serviço" : "Editar Serviço"}
              </h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  required
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Ícone</label>
                  <select
                    value={editing.icon}
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none bg-white"
                  >
                    {ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Ordem</label>
                  <input
                    type="number"
                    value={editing.order}
                    onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Texto do Botão</label>
                <input
                  type="text"
                  value={editing.buttonText}
                  onChange={(e) => setEditing({ ...editing, buttonText: e.target.value })}
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
                  {saving ? "Salvando..." : "Salvar Serviço"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
