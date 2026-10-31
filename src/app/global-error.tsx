"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center p-6 font-mono bg-[#FAFAFA] dark:bg-[#0A0A0A] text-black dark:text-white">
        <div className="max-w-md w-full bg-white dark:bg-[#121212] border-4 border-black dark:border-white p-6 rounded-xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#FFF] flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#FF6B35] text-white border-2 border-black rounded-lg flex items-center justify-center font-black text-xl mb-3 shadow-[2px_2px_0px_0px_#000]">
            !
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">Terjadi Kesalahan Sistem</h2>
          <p className="text-xs text-black/70 dark:text-white/70 mb-4 leading-relaxed">
            Koneksi ke database sedang padat atau mengalami cold-start. Silakan klik tombol di bawah untuk memuat ulang.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-[#E2FF00] text-black font-black uppercase text-xs tracking-wider border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </body>
    </html>
  );
}
