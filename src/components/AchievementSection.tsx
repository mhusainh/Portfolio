"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Trophy, Calendar, ExternalLink, Award } from "lucide-react";
import { NeoStamp } from "@/components/NeoBrutalAssets";

export interface AchievementItem {
  id: string;
  title_en: string;
  title_id: string;
  issuer: string;
  issue_date: string;
  description_en?: string | null;
  description_id?: string | null;
  certificate_url?: string | null;
  credential_url?: string | null;
  is_featured?: boolean | null;
  display_order?: number | null;
}

export function AchievementSection({ achievements }: { achievements: AchievementItem[] }) {
  const { locale, t } = useLanguage();

  if (!achievements || achievements.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section id="achievements" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2">
          <NeoStamp text="HONORS & AWARDS" color="bg-[#9D93FF]" className="text-black" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
          {t.achievements.title}
        </h2>
        <p className="text-sm md:text-base text-[#4A4A4A] dark:text-[#FFFFFF]/80 mt-1 max-w-[60ch]">
          {t.achievements.subtitle}
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((item, idx) => {
          const title = locale === "en" ? item.title_en : item.title_id;
          const desc = locale === "en" ? item.description_en : item.description_id;
          const tiltClass = idx % 2 === 0 ? "neo-tilt-hover" : "neo-tilt-hover-right";

          return (
            <div
              key={item.id}
              className={`bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col justify-between ${tiltClass}`}
            >
              <div>
                {/* Top Badge & Date with E2FF00 Padding */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 bg-[#635BFF] border-2 border-black dark:border-white rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-mono font-black px-3 py-1.5 bg-[#E2FF00] text-black border-2 border-black dark:border-white rounded-md flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
                    <Calendar className="w-3.5 h-3.5 text-black" />
                    {formatDate(item.issue_date)}
                  </span>
                </div>

                {/* Optional Certificate Photo Display */}
                {item.certificate_url && (
                  <div className="aspect-video w-full mb-3 bg-black border-2 border-black dark:border-white rounded-lg overflow-hidden">
                    <img
                      src={item.certificate_url}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If it's a raw PDF URL, hide the image tag
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <h3 className="text-lg md:text-xl font-black uppercase text-black dark:text-[#FFFFFF] tracking-tight leading-snug">
                  {title}
                </h3>
                <h4 className="text-xs font-mono font-bold text-[#FF6B35] uppercase mt-1 mb-3">
                  {t.achievements.issuer}: {item.issuer}
                </h4>

                {desc && (
                  <p className="text-sm text-black/85 dark:text-[#FFFFFF]/85 leading-relaxed mb-4">
                    {desc}
                  </p>
                )}
              </div>

              {/* Action Link (Opens credential URL or uploaded certificate file in new tab) */}
              {(item.credential_url || item.certificate_url) && (
                <div className="pt-3 border-t-2 border-black dark:border-white">
                  <a
                    href={item.credential_url || item.certificate_url!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider text-black dark:text-[#FFFFFF] hover:text-[#635BFF] dark:hover:text-[#9D93FF] transition-colors neo-lift-hover"
                  >
                    <span>{t.achievements.viewCredential}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
