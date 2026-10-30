"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { NeoBarcode } from "@/components/NeoBrutalAssets";

interface ProfileCardProps {
  fullName?: string | null;
  avatarUrl?: string | null;
  stackText?: string;
  barcodeLabel?: string;
}

export function ProfileCard({
  fullName = "Mahmudi Husain Hasbullah",
  avatarUrl,
  stackText = "PHP / LARAVEL / GO",
  barcodeLabel = "MAHMUDI // ARCH",
}: ProfileCardProps) {
  return (
    <div className="relative w-full max-w-xs mx-auto select-none">
      {/* 1. Barcode Tag - Part of the same component, strictly anchored */}
      <div className="absolute -top-4 -right-4 z-20 rotate-3 pointer-events-none">
        <NeoBarcode label={barcodeLabel} />
      </div>

      {/* 2. Solid Background Shadow Layer (Black in light, White in dark) */}
      <div className="absolute inset-0 bg-[#000000] dark:bg-[#FFFFFF] translate-x-3 translate-y-3 rounded-none"></div>

      {/* 3. Main Avatar Card Frame with New Palette */}
      <div className="relative bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-none p-4 z-10 shadow-none">
        <div className="aspect-square w-full bg-[#E2FF00] border-2 border-black dark:border-white rounded-none overflow-hidden relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName || "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono font-black text-4xl text-black">
              MHH
            </div>
          )}
        </div>

        {/* Telemetry Footer Info */}
        <div className="mt-3 flex items-center justify-between text-xs font-mono font-bold border-t-2 border-black dark:border-white pt-2 text-black dark:text-[#FFFFFF]">
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-[#FF6B35]" /> STACK
          </span>
          <span>{stackText}</span>
        </div>
      </div>
    </div>
  );
}
