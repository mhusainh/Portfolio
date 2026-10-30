import React from "react";
import {
  NeoDotMatrix,
  NeoCylinderShape,
  NeoArchShape,
  NeoZigZagLine,
  NeoCrosshair,
  NeoStarShape,
  NeoDonutShape,
  NeoTagStrip,
  NeoCautionStripe,
  NeoBrackets,
} from "@/components/NeoBrutalAssets";

export function GlobalBackgroundShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* --- HERO AREA (0 - 600px) --- */}
      {/* 1. Top Right Cylinder */}
      <div className="absolute top-24 right-4 xl:right-16 hidden lg:block">
        <NeoCylinderShape className="opacity-55 dark:opacity-35" />
      </div>

      {/* 2. Top Left Dots Cluster */}
      <div className="absolute top-36 left-4 xl:left-12 hidden md:block">
        <NeoDotMatrix rows={5} cols={4} className="opacity-60 dark:opacity-40" />
      </div>

      {/* 3. Hero Sparkle Star (Yellow) */}
      <div className="absolute top-80 right-8 xl:right-24 hidden md:block animate-pulse">
        <NeoStarShape size={36} color="#EBB956" />
      </div>

      {/* --- EXPERIENCE AREA (600px - 1300px) --- */}
      {/* 4. Left Zig-Zag Line */}
      <div className="absolute top-[750px] left-4 xl:left-16 hidden lg:block">
        <NeoZigZagLine className="opacity-75 dark:opacity-55" />
      </div>

      {/* 5. Right Donut Ring */}
      <div className="absolute top-[850px] right-6 xl:right-16 hidden lg:block">
        <NeoDonutShape size={48} color="bg-[#D04060]" className="opacity-70 dark:opacity-50" />
      </div>

      {/* 6. Caution Barcode/Stripe on Left */}
      <div className="absolute top-[1100px] left-4 xl:left-10 hidden xl:block w-32">
        <NeoCautionStripe />
      </div>

      {/* --- PROJECTS AREA (1300px - 2000px) --- */}
      {/* 7. Right Arch Shape */}
      <div className="absolute top-[1450px] right-4 xl:right-14 hidden lg:block">
        <NeoArchShape className="opacity-65 dark:opacity-45" />
      </div>

      {/* 8. Left Dot Matrix */}
      <div className="absolute top-[1600px] left-4 xl:left-12 hidden md:block">
        <NeoDotMatrix rows={6} cols={3} className="opacity-50 dark:opacity-35" />
      </div>

      {/* 9. Cyan Starburst Star */}
      <div className="absolute top-[1850px] right-6 xl:right-20 hidden md:block">
        <NeoStarShape size={32} color="#14B6E5" />
      </div>

      {/* --- ACHIEVEMENTS & EDUCATION AREA (2000px - 2800px) --- */}
      {/* 10. Tag Strip Left */}
      <div className="absolute top-[2150px] left-4 xl:left-14 hidden lg:block">
        <NeoTagStrip label="SYS//HONORS" />
      </div>

      {/* 11. Right Dots Matrix */}
      <div className="absolute top-[2300px] right-4 xl:right-16 hidden md:block">
        <NeoDotMatrix rows={4} cols={5} className="opacity-55 dark:opacity-35" />
      </div>

      {/* 12. Cylinder Shape on Left */}
      <div className="absolute top-[2550px] left-4 xl:left-10 hidden xl:block">
        <NeoCylinderShape className="rotate-[-25deg] opacity-45 dark:opacity-30 scale-90" />
      </div>

      {/* --- SKILLS & FOOTER AREA (2800px - 3600px) --- */}
      {/* 13. Floating Zig-Zag on Right */}
      <div className="absolute top-[2900px] right-4 xl:right-16 hidden lg:block">
        <NeoZigZagLine className="opacity-70 dark:opacity-50" />
      </div>

      {/* 14. Retro Donut Shape Left */}
      <div className="absolute top-[3100px] left-6 xl:left-16 hidden lg:block">
        <NeoDonutShape size={52} color="bg-[#FCBA28]" className="opacity-70 dark:opacity-50" />
      </div>

      {/* 15. Corner Crosshairs & Brackets */}
      <div className="absolute top-[3350px] right-8 xl:right-20 hidden md:block">
        <NeoBrackets />
      </div>

      <div className="absolute top-[3450px] left-8 hidden lg:block">
        <NeoCrosshair className="text-3xl opacity-40 dark:opacity-30" />
      </div>
    </div>
  );
}
