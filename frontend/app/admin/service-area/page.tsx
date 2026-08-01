"use client";

import { useEffect, useState } from "react";
import { Save, Check, Plus, X, Loader2 } from "lucide-react";

export default function AdminServiceAreaPage() {
  const [form, setForm] = useState({
    badgeText: "",
    title: "",
    description: "",
    cities: [] as string[],
    mapUrl: "",
  });
  const [newCity, setNewCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/service-area")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            badgeText: data.badgeText || "",
            title: data.title || "",
            description: data.description || "",
            cities: Array.isArray(data.cities) ? data.cities : [],
            mapUrl: data.mapUrl || "",
          });
        }
        setLoading(false);
      });
  }, []);

  const handleAddCity = () => {
    if (!newCity.trim()) return;
    if (form.cities.includes(newCity.trim())) return;
    setForm({ ...form, cities: [...form.cities, newCity.trim()] });
    setNewCity("");
  };

  const handleRemoveCity = (city: string) => {
    setForm({ ...form, cities: form.cities.filter((c) => c !== city) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/service-area", {
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
        Carregando Área de Atendimento...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Área de Atendimento</h1>
        <p className="text-sm text-slate-500">Altere o texto explicativo, a lista de cidades atendidas e o mapa interativo.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check size={18} className="text-emerald-600" /> Área de atendimento atualizada!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Título Destaque</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Descrição</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Cidades Atendidas</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Digite o nome de uma cidade..."
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCity();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0B3C5D] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCity}
                className="px-5 py-3 rounded-xl bg-[#0B3C5D] text-white font-bold text-sm"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.cities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700"
                >
                  {city}
                  <button type="button" onClick={() => handleRemoveCity(city)} className="text-slate-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">URL de Incorporação do Google Maps</label>
            <input
              type="text"
              value={form.mapUrl}
              onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
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
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />} Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
