"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { NeoStamp } from "@/components/NeoBrutalAssets";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

export interface WhatIDoItem {
  id: string;
  title_en: string;
  title_id: string;
  description_en?: string | null;
  description_id?: string | null;
  display_order?: number | null;
}

interface WhatIDoProps {
  itemsEn?: string[];
  itemsId?: string[];
  entries?: WhatIDoItem[];
}

export function WhatIDoSection({ itemsEn = [], itemsId = [], entries = [] }: WhatIDoProps) {
  const { locale, t } = useLanguage();

  // If new dynamic entries from database exist, use them
  if (entries && entries.length > 0) {
    return (
      <section id="what-i-do" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
        <div className="mb-8">
          <div className="mb-2">
            <NeoStamp text="CORE SPECIALIZATION" color="bg-[#635BFF]" className="text-black" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
            {t.whatIDo.title}
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] dark:text-[#FFFFFF]/80 mt-1 max-w-[60ch]">
            {t.whatIDo.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {entries.map((item, index) => {
            const title = locale === "en" ? item.title_en : item.title_id;

            return (
              <div
                key={item.id}
                className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex items-center gap-3.5 neo-lift-hover"
              >
                {/* Inline Number Badge */}
                <div className="w-9 h-9 flex-shrink-0 bg-[#E2FF00] border-2 border-black dark:border-white rounded-md flex items-center justify-center font-mono font-black text-sm text-black shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFFFFF]">
                  0{index + 1}
                </div>

                {/* Competency Statement */}
                <div className="font-mono font-bold text-sm tracking-tight text-black dark:text-[#FFFFFF] leading-snug">
                  {title}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Fallback to legacy string array from profile if what_i_do table is empty
  const items = locale === "en" ? itemsEn : itemsId;
  if (!items || items.length === 0) return null;

  return (
    <section id="what-i-do" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
      {/* Sub Title / Section Header */}
      <div className="mb-8">
        <div className="mb-2">
          <NeoStamp text="CORE SPECIALIZATION" color="bg-[#635BFF]" className="text-black" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
          {t.whatIDo.title}
        </h2>
        <p className="text-sm md:text-base text-[#4A4A4A] dark:text-[#FFFFFF]/80 mt-1 max-w-[60ch]">
          {t.whatIDo.subtitle}
        </p>
      </div>

      {/* Compact Horizontal Grid with number inline with text */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex items-center gap-3.5 neo-lift-hover"
            >
              {/* Inline Number Badge */}
              <div className="w-9 h-9 flex-shrink-0 bg-[#E2FF00] border-2 border-black dark:border-white rounded-md flex items-center justify-center font-mono font-black text-sm text-black shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFFFFF]">
                0{index + 1}
              </div>

              {/* Competency Statement */}
              <div className="font-mono font-bold text-sm tracking-tight text-black dark:text-[#FFFFFF] leading-snug">
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

