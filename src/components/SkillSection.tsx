"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { NeoStamp } from "@/components/NeoBrutalAssets";

export interface SkillItem {
  id: string;
  name: string;
  category: "programming" | "framework" | "tools_office" | "database" | "design" | "other";
  icon_type: string;
  iconUrl: string;
  proficiency_level?: string | null;
}

export function SkillSection({ skills }: { skills: SkillItem[] }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { key: "all", label: t.skills.all },
    { key: "programming", label: t.skills.programming },
    { key: "framework", label: t.skills.framework },
    { key: "database", label: t.skills.database },
    { key: "tools_office", label: t.skills.tools_office },
  ];

  const filtered = filter === "all"
    ? skills
    : skills.filter((s) => s.category === filter);

  return (
    <section id="skills" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="mb-2">
            <NeoStamp text="SKILLS ARSENAL" color="bg-[#E2FF00]" className="text-black" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
            {t.skills.title}
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] dark:text-[#FFFFFF]/80 mt-1 max-w-[60ch]">
            {t.skills.subtitle}
          </p>
        </div>

        {/* Filter Pills with Lift Animation & Rounded Corners */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white rounded-md transition-all neo-lift-hover ${
                filter === c.key
                  ? "bg-[#635BFF] text-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF]"
                  : "bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Skills with Smart Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((skill, idx) => {
          const tiltClass = idx % 2 === 0 ? "neo-tilt-hover" : "neo-tilt-hover-right";
          return (
            <div
              key={skill.id}
              className={`bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex flex-col items-center text-center group cursor-pointer ${tiltClass}`}
            >
              <div className="w-12 h-12 mb-3 p-2 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <img
                  src={skill.iconUrl}
                  alt={skill.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <span className="font-mono font-black text-sm uppercase tracking-tight text-black dark:text-[#FFFFFF]">
                {skill.name}
              </span>
              <span className="text-[10px] font-mono text-[#FF6B35] font-bold uppercase mt-1">
                {t.skills[skill.category as keyof typeof t.skills] || skill.category.replace("_", " ")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
