"use client";

import { useEffect, useState } from "react";
import { Save, Check, Loader2, RefreshCw, Key, Instagram } from "lucide-react";

export default function AdminSocialPage() {
  const [form, setForm] = useState({
    instagram: "",
    instaToken: "",
    facebook: "",
    whatsapp: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
    activeInsta: true,
    activeFb: true,
    activeWa: true,
    activeYt: false,
    activeTt: false,
    activeLi: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/social")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            instagram: data.instagram || "",
            instaToken: data.instaToken || "",
            facebook: data.facebook || "",
            whatsapp: data.whatsapp || "",
            youtube: data.youtube || "",
            tiktok: data.tiktok || "",
            linkedin: data.linkedin || "",
            activeInsta: data.activeInsta ?? true,
            activeFb: data.activeFb ?? true,
            activeWa: data.activeWa ?? true,
            activeYt: data.activeYt ?? false,
            activeTt: data.activeTt ?? false,
            activeLi: data.activeLi ?? false,
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
      const res = await fetch("/api/admin/social", {
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

  const handleSyncInstagram = async () => {
    setSyncing(true);
    setSyncMsg("");

    try {
      const res = await fetch("/api/admin/social", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setSyncMsg(data.message || "Posts sincronizados com sucesso!");
      } else {
        setSyncMsg(data.error || "Erro ao sincronizar posts do Instagram");
      }
    } catch (err) {
      setSyncMsg("Erro de conexão ao sincronizar com Instagram");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0B3C5D]" />
        Carregando Redes Sociais...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Redes Sociais &amp; Instagram</h1>
        <p className="text-sm text-slate-500">Configure os links sociais e o Token do Instagram para atualizar o carrossel do site automaticamente.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check size={18} className="text-emerald-600" /> Redes sociais atualizadas!
        </div>
      )}

      {syncMsg && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-sm font-semibold flex items-center justify-between gap-2">
          <span>{syncMsg}</span>
          <button onClick={() => setSyncMsg("")} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">Fechar</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-5">
        <div className="space-y-4">
          {/* Instagram Block */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.activeInsta}
                onChange={(e) => setForm({ ...form, activeInsta: e.target.checked })}
                className="h-5 w-5 rounded text-[#0B3C5D]"
              />
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                  <Instagram size={16} className="text-pink-600" /> Instagram (@usuario ou URL Perfil)
                </label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="https://instagram.com/duarteslimpezacaixadeagua"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0B3C5D] focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center gap-1.5">
                <Key size={14} className="text-amber-500" /> Token de Acesso do Instagram Graph API (Opcional)
              </label>
              <input
                type="password"
                value={form.instaToken}
                onChange={(e) => setForm({ ...form, instaToken: e.target.value })}
                placeholder="Insira o Access Token do Instagram Graph API..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono focus:border-[#0B3C5D] focus:outline-none bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ao preencher este token, o site puxará os posts do perfil em tempo real diretamente da API Oficial do Instagram.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSyncInstagram}
                disabled={syncing}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw size={14} />} Sincronizar Posts do Instagram Agora
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
            <input
              type="checkbox"
              checked={form.activeFb}
              onChange={(e) => setForm({ ...form, activeFb: e.target.checked })}
              className="h-5 w-5 rounded text-[#0B3C5D]"
            />
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Facebook URL</label>
              <input
                type="text"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0B3C5D] focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
            <input
              type="checkbox"
              checked={form.activeWa}
              onChange={(e) => setForm({ ...form, activeWa: e.target.checked })}
              className="h-5 w-5 rounded text-[#0B3C5D]"
            />
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">WhatsApp Direct Link</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0B3C5D] focus:outline-none bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C5D] px-6 py-3 font-bold text-white shadow-md hover:bg-[#072A42] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />} Salvar Redes Sociais
          </button>
        </div>
      </form>
    </div>
  );
}
