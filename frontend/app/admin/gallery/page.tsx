"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Edit3, Plus, X, Loader2, Check, ZoomIn } from "lucide-react";

interface GalleryMedia {
  id: string;
  title: string | null;
  src: string;
  fullSrc: string | null;
  alt: string;
  order: number;
  active: boolean;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchGallery = async () => {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    if (Array.isArray(data)) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          await fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              src: uploadData.url,
              fullSrc: uploadData.url,
              alt: files[i].name.replace(/\.[^/.]+$/, ""),
              order: items.length + i + 1,
              active: true,
            }),
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    setUploading(false);
    fetchGallery();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta foto da galeria?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0B3C5D]" />
        Carregando Galeria...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Gerenciar Galeria</h1>
          <p className="text-sm text-slate-500">Faça upload de fotos dos serviços executados para exibir no site.</p>
        </div>

        <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3C5D] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#072A42] transition-colors cursor-pointer">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload size={18} />}
          <span>{uploading ? "Enviando..." : "Upload de Fotos"}</span>
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Drag & Drop Upload Area */}
      <div className="border-2 border-dashed border-slate-300 bg-white rounded-3xl p-8 text-center hover:border-accent transition-colors">
        <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-sm">Arraste e solte fotos aqui ou clique para selecionar</h3>
        <p className="text-xs text-slate-400 mt-1">Formatos aceitos: JPG, PNG, WEBP, SVG (Compressão automática)</p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs h-48 md:h-56"
          >
            <Image
              src={item.src}
              alt={item.alt || "Foto Duarte's"}
              fill
              unoptimized={item.src.startsWith("http")}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => setPreview(item.src)}
                className="p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2.5 rounded-full bg-red-600/80 text-white hover:bg-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 text-white text-xs truncate">
              {item.alt}
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Lightbox Modal */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <button onClick={() => setPreview(null)} className="absolute top-6 right-6 text-white hover:text-slate-300">
            <X size={28} />
          </button>
          <img src={preview} alt="Preview" className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
}
