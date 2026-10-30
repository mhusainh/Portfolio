"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface SmartIconCheckerProps {
  onSelectIcon: (url: string, iconType: string) => void;
  initialSkillName?: string;
}

export function SmartIconChecker({ onSelectIcon, initialSkillName = "" }: SmartIconCheckerProps) {
  const [skillName, setSkillName] = useState(initialSkillName);
  const [loading, setLoading] = useState(false);
  const [foundIcon, setFoundIcon] = useState<{ url: string; source: string } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleCheck = async () => {
    if (!skillName.trim()) return;
    setLoading(true);
    setFoundIcon(null);
    setNotFound(false);

    try {
      const res = await fetch(`/api/check-icon?name=${encodeURIComponent(skillName)}`);
      const data = await res.json();

      if (res.ok && data.found) {
        setFoundIcon({ url: data.url, source: data.source });
        onSelectIcon(data.url, `web_${data.source}`);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3.5 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg">
      <span className="text-xs font-mono font-bold uppercase text-black dark:text-white">
        SMART ICON CHECKER (Devicon / Simple Icons CDN)
      </span>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Ketik misal: Laravel, PHP, Excel, Word..."
          className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-black dark:text-white"
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading || !skillName.trim()}
          className="px-3.5 py-1.5 bg-[#635BFF] text-white font-mono font-black text-xs uppercase border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>CHECK ICON</span>
        </button>
      </div>

      {foundIcon && (
        <div className="flex items-center gap-3 p-2 bg-[#E2FF00]/20 border-2 border-[#E2FF00] rounded-md text-xs font-mono">
          <div className="w-8 h-8 bg-white border border-black p-1 flex items-center justify-center rounded-sm">
            <img src={foundIcon.url} alt="Preview" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-black dark:text-white flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E2FF00]" /> Ditemukan di {foundIcon.source}!
            </span>
            <span className="text-[10px] opacity-75 truncate block max-w-xs">{foundIcon.url}</span>
          </div>
        </div>
      )}

      {notFound && (
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#FF6B35]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Tidak ditemukan di CDN. Silakan upload file manual ke Cloudinary atau input URL.</span>
        </div>
      )}
    </div>
  );
}
