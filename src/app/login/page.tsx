"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal masuk");
        return;
      }

      // Store local flag and redirect to admin
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_username", data.user?.username || username);
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFFFFF] dark:bg-[#000000]">
      <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#000000] border-4 border-black dark:border-white rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFFFFF] p-6 md:p-8">
        {/* Terminal / System Header */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#E2FF00] border-2 border-black rounded-md">
              <Lock className="w-4 h-4 text-black" />
            </div>
            <span className="font-mono font-black text-xs uppercase tracking-wider text-black dark:text-[#FFFFFF]">
              ADMIN CONSOLE // AUTH
            </span>
          </div>
          <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 border border-white rounded-sm">
            SYS:ACTIVE
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF] mb-2">
          PANEL MASUK
        </h1>
        <p className="text-xs md:text-sm text-[#4A4A4A] dark:text-[#FFFFFF]/80 mb-6 font-mono">
          Masukkan username dan password admin untuk mengelola portofolio.
        </p>

        {/* Error Feedback State */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-[#FF6B35] text-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2 text-xs font-mono font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono font-black uppercase text-black dark:text-[#FFFFFF] mb-1">
              USERNAME
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                autoCapitalize="none"
                className="w-full px-3 py-2.5 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg text-black dark:text-[#FFFFFF] font-mono text-sm shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] focus:bg-[#E2FF00]/10"
              />
              <User className="w-4 h-4 text-black/50 dark:text-white/50 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-black uppercase text-black dark:text-[#FFFFFF] mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg text-black dark:text-[#FFFFFF] font-mono text-sm shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] focus:bg-[#E2FF00]/10"
              />
              <Lock className="w-4 h-4 text-black/50 dark:text-white/50 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-[#E2FF00] text-black font-black uppercase text-sm tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "MEMVERIFIKASI..." : "MASUK KE DASHBOARD"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#4A4A4A] dark:border-white/40 flex items-center justify-between text-xs font-mono font-bold">
          <a
            href="/"
            className="hover:underline flex items-center gap-1 text-black dark:text-white"
          >
            &larr; Kembali ke Portfolio
          </a>
          <span className="flex items-center gap-1 text-[#635BFF] dark:text-[#9D93FF]">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE CONSOLE
          </span>
        </div>
      </div>
    </div>
  );
}
