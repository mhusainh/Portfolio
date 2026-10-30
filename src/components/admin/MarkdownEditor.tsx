"use client";

import React, { useState } from "react";
import { Bold, Italic, List, ListOrdered, Code, Eye, Edit3, Heading2 } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder = "Tulis deskripsi dengan Markdown... Gunakan - untuk poin, **tebal**, `kode`",
  rows = 4,
  required = false,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  const insertSnippet = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(label) as HTMLTextAreaElement | null;
    if (!textarea) {
      onChange(`${value}${prefix}teks${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || "teks";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const insertBullet = () => {
    insertSnippet("\n- ", "");
  };

  const insertNumbered = () => {
    insertSnippet("\n1. ", "");
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={label} className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-[#F4F4F0] dark:bg-[#1A1A1A] p-0.5 border border-black dark:border-white rounded-md">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 transition-colors ${
              tab === "write"
                ? "bg-[#635BFF] text-white shadow-[1px_1px_0px_0px_#000]"
                : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Tulis</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 transition-colors ${
              tab === "preview"
                ? "bg-[#E2FF00] text-black shadow-[1px_1px_0px_0px_#000]"
                : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Quick Toolbar */}
      {tab === "write" && (
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#FAFAFA] dark:bg-[#141414] border-2 border-b-0 border-black dark:border-white rounded-t-md text-xs font-mono">
          <button
            type="button"
            onClick={() => insertSnippet("**", "**")}
            title="Tebal (Bold)"
            className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded font-bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("*", "*")}
            title="Miring (Italic)"
            className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("### ", "")}
            title="Subjudul (H3)"
            className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={insertBullet}
            title="Poin Bullet (-)"
            className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded flex items-center gap-1"
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[10px]">Poin</span>
          </button>
          <button
            type="button"
            onClick={insertNumbered}
            title="Poin Angka (1.)"
            className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded flex items-center gap-1"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span className="text-[10px]">1. 2. 3.</span>
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("`", "`")}
            title="Kode Inline (`kode`)"
            className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-gray-500 ml-auto pr-1">Format Markdown</span>
        </div>
      )}

      {tab === "write" ? (
        <textarea
          id={label}
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-b-md text-xs font-mono text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635BFF] transition-all"
        />
      ) : (
        <div className="w-full min-h-[100px] p-3 bg-white dark:bg-[#000000] border-2 border-black dark:border-white rounded-md text-xs font-mono text-black dark:text-white overflow-y-auto">
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <span className="text-gray-400 italic">Belum ada konten untuk ditampilkan di preview.</span>
          )}
        </div>
      )}
    </div>
  );
}
