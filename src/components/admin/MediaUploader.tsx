"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface MediaUploaderProps {
  module: "projects" | "experiences" | "skills" | "profile" | "achievements";
  onUploadSuccess: (url: string) => void;
  label?: string;
  accept?: string;
}

export function MediaUploader({
  module,
  onUploadSuccess,
  label = "Upload File ke Cloudinary",
  accept = "image/*,application/pdf",
}: MediaUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah media");
      }

      setSuccessUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono font-bold uppercase text-black dark:text-white">
        {label} (folder: portfolio/{module})
      </label>

      <div className="flex items-center gap-2">
        <label className="cursor-pointer px-4 py-2 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black transition-colors font-mono font-bold text-xs flex items-center gap-2 neo-lift-hover">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{loading ? "MENGUNGGAH..." : "PILIH FILE"}</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
        </label>

        {successUrl && (
          <span className="flex items-center gap-1 text-xs font-mono font-bold text-[#635BFF] dark:text-[#9D93FF]">
            <CheckCircle2 className="w-4 h-4 text-[#E2FF00]" /> Terunggah!
          </span>
        )}
      </div>

      {errorMsg && (
        <span className="flex items-center gap-1 text-xs font-mono text-[#FF6B35]">
          <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
        </span>
      )}
    </div>
  );
}
