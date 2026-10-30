import React from "react";

// Starburst / Asterisk Sticker Badge
export function NeoStarburst({ className = "", text = "100% VERIFIED" }: { className?: string; text?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center font-mono font-black text-[10px] uppercase tracking-wider ${className}`}>
      <div className="absolute inset-0 bg-[#E2FF00] border-2 border-black dark:border-white rotate-6 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]"></div>
      <div className="relative px-2.5 py-1 bg-[#FF6B35] text-white border-2 border-black dark:border-white -rotate-3 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
        ★ {text} ★
      </div>
    </div>
  );
}

// Barcode Telemetry Badge
export function NeoBarcode({ label = "DEV // 2026", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`inline-flex flex-col bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white p-2 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] ${className}`}>
      <div className="flex items-center gap-[2px] h-6 mb-1 text-black dark:text-white">
        <div className="w-[3px] h-full bg-current"></div>
        <div className="w-[1px] h-full bg-current"></div>
        <div className="w-[4px] h-full bg-current"></div>
        <div className="w-[2px] h-full bg-current"></div>
        <div className="w-[1px] h-full bg-current"></div>
        <div className="w-[5px] h-full bg-current"></div>
        <div className="w-[2px] h-full bg-current"></div>
        <div className="w-[1px] h-full bg-current"></div>
        <div className="w-[3px] h-full bg-current"></div>
        <div className="w-[4px] h-full bg-current"></div>
        <div className="w-[1px] h-full bg-current"></div>
        <div className="w-[2px] h-full bg-current"></div>
        <div className="w-[5px] h-full bg-current"></div>
      </div>
      <span className="text-[9px] font-mono font-black tracking-widest text-center text-black dark:text-white">
        {label}
      </span>
    </div>
  );
}

// Geometric Stamp Sticker (Sharp / Non-rounded rectangular stamp)
export function NeoStamp({ text = "APPROVED", color = "bg-[#E2FF00]", className = "" }: { text?: string; color?: string; className?: string }) {
  return (
    <div className={`inline-block px-3 py-1 ${color} text-black font-mono font-black text-xs uppercase border-2 border-black dark:border-white rounded-none shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] rotate-[-2deg] ${className}`}>
      [ {text} ]
    </div>
  );
}

// Corner Crosshairs Marker (+)
export function NeoCrosshair({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono font-black text-lg text-black/60 dark:text-white/60 select-none ${className}`}>
      +
    </span>
  );
}

// Background Dot Matrix Cluster
export function NeoDotMatrix({ rows = 4, cols = 6, className = "" }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div
      className={`grid gap-2 pointer-events-none select-none opacity-60 dark:opacity-40 ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></div>
      ))}
    </div>
  );
}

// Retro Geometric Shape: Cylinder / Capsule
export function NeoCylinderShape({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none relative w-16 h-28 border-2 border-black dark:border-white rounded-full bg-[#E2FF00] shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] rotate-12 opacity-80 ${className}`}>
      <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-black dark:border-white"></div>
    </div>
  );
}

// Retro Geometric Shape: Arch
export function NeoArchShape({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none w-20 h-24 border-2 border-black dark:border-white rounded-t-full bg-[#635BFF] shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] -rotate-6 opacity-75 ${className}`}>
      <div className="w-8 h-10 mx-auto mt-auto border-t-2 border-x-2 border-black dark:border-white rounded-t-full bg-[#FFFFFF] dark:bg-[#000000]"></div>
    </div>
  );
}

// Zig-Zag Wavy Line
export function NeoZigZagLine({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none select-none text-black dark:text-white opacity-70 ${className}`}
      width="100"
      height="24"
      viewBox="0 0 100 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12 L18 3 L34 21 L50 3 L66 21 L82 3 L98 12" />
    </svg>
  );
}

// Caution Warning Stripe Block
export function NeoCautionStripe({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none h-4 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] ${className}`}
      style={{
        backgroundImage: "repeating-linear-gradient(-45deg, #E2FF00, #E2FF00 10px, #000 10px, #000 20px)",
      }}
    ></div>
  );
}

// Retro 4-Point Sparkle Star
export function NeoStarShape({ size = 40, color = "#E2FF00", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`pointer-events-none select-none drop-shadow-[3px_3px_0px_#000] dark:drop-shadow-[3px_3px_0px_#FFFFFF] ${className}`}
    >
      <path
        d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z"
        fill={color}
        stroke="currentColor"
        strokeWidth="2"
        className="text-black dark:text-white"
      />
    </svg>
  );
}

// Geometric Donut / Ring
export function NeoDonutShape({ size = 56, color = "bg-[#FF6B35]", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`pointer-events-none select-none rounded-full ${color} border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex items-center justify-center ${className}`}
    >
      <div className="w-1/2 h-1/2 rounded-full bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white"></div>
    </div>
  );
}

// Slanted Grid Tag Strip
export function NeoTagStrip({ label = "SYS//01", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`pointer-events-none select-none inline-flex items-center gap-1.5 px-3 py-1 bg-[#635BFF] text-white font-mono font-black text-[10px] tracking-wider uppercase border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] rotate-[-6deg] ${className}`}>
      <span className="w-1.5 h-1.5 bg-white"></span>
      <span>{label}</span>
    </div>
  );
}

// Blueprint Corner Brackets
export function NeoBrackets({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none font-mono font-bold text-xs text-black/50 dark:text-white/50 tracking-tighter ${className}`}>
      &#91; 0xEF // RAW &#93;
    </div>
  );
}

// Consistent Tech Tag Color Resolver
export function getTechColor(name: string): string {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Brand-aligned deterministic mapping
  switch (normalized) {
    case "php":
      return "bg-[#635BFF] text-white"; // Deep Indigo
    case "laravel":
      return "bg-[#FF6B35] text-white"; // Punch Coral
    case "postgresql":
    case "postgres":
      return "bg-[#9D93FF] text-black"; // Soft Lavender
    case "nextjs":
    case "next":
      return "bg-[#000000] text-white dark:bg-[#FFFFFF] dark:text-black"; // Black/White
    case "docker":
      return "bg-[#635BFF] text-white"; // Indigo
    case "redis":
      return "bg-[#FF6B35] text-white"; // Coral
    case "typescript":
    case "ts":
      return "bg-[#9D93FF] text-black"; // Lavender
    case "mysql":
      return "bg-[#E2FF00] text-black"; // Lime
    case "tailwindcss":
    case "tailwind":
      return "bg-[#E2FF00] text-black"; // Lime
    default:
      // Hash-based fallback strictly into the 4 primary accents
      const colors = [
        "bg-[#E2FF00] text-black",
        "bg-[#635BFF] text-white",
        "bg-[#FF6B35] text-white",
        "bg-[#9D93FF] text-black",
      ];
      let hash = 0;
      for (let i = 0; i < normalized.length; i++) {
        hash = (hash << 5) - hash + normalized.charCodeAt(i);
        hash |= 0;
      }
      return colors[Math.abs(hash) % colors.length];
  }
}
