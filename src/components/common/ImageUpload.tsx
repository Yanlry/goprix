"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

function resizeToBlob(file: File, maxSize = 1200): Promise<{ blob: Blob; ext: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const isPng = file.type === "image/png" || file.type === "image/webp";
    const mime = isPng ? "image/png" : "image/jpeg";
    const ext = isPng ? "png" : "jpg";
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("blob")); return; }
          resolve({ blob, ext, mime });
        }, mime, isPng ? undefined : 0.88);
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ value, onChange, label = "Photo" }: ImageUploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handle = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    setUploadError("");
    try {
      const { blob, ext, mime } = await resizeToBlob(file);
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(filename, blob, { contentType: mime, upsert: false });

      if (error) throw error;

      const { data } = supabase.storage.from("images").getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch {
      setUploadError("Erreur lors de l'upload. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (value?.includes("supabase.co/storage")) {
      const parts = value.split("/images/");
      const filename = parts[1];
      if (filename) await supabase.storage.from("images").remove([filename]);
    }
    onChange("");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handle(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handle(f);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {uploadError && (
        <p className="text-xs text-red-500 mb-2">{uploadError}</p>
      )}

      {value ? (
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-2xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
            <img src={value} alt="Aperçu" className="w-full h-full object-contain p-2" />
          </div>
          <button type="button" onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow">
            <X className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => ref.current?.click()}
            className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg hover:bg-black/70 transition-colors">
            Changer
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
          }`}
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Upload en cours...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                {dragging
                  ? <Upload className="w-5 h-5 text-purple-600" />
                  : <ImageIcon className="w-5 h-5 text-purple-400" />}
              </div>
              <p className="text-sm font-medium text-gray-600">
                {dragging ? "Relâchez pour télécharger" : "Cliquez ou glissez une image"}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
