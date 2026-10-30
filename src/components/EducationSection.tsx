"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { NeoStamp } from "@/components/NeoBrutalAssets";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

export interface EducationItem {
  id: string;
  institution: string;
  degreeEn: string;
  degreeId: string;
  fieldOfStudyEn: string;
  fieldOfStudyId: string;
  descriptionEn?: string | null;
  descriptionId?: string | null;
  logoUrl?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean | null;
  scoreGpa?: string | null;
}

export function EducationSection({ education }: { education: EducationItem[] }) {
  const { locale, t } = useLanguage();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section id="education" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
      <div className="mb-8">
        <div className="mb-2">
          <NeoStamp text="ACADEMICS & DEGREE" color="bg-[#E2FF00]" className="text-black" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
          {t.education.title}
        </h2>
        <p className="text-sm md:text-base text-[#4A4A4A] dark:text-[#FFFFFF]/80 mt-1 max-w-[60ch]">
          {t.education.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((item, idx) => {
          const degree = locale === "en" ? item.degreeEn : item.degreeId;
          const field = locale === "en" ? item.fieldOfStudyEn : item.fieldOfStudyId;
          const desc = locale === "en" ? item.descriptionEn : item.descriptionId;
          const tiltClass = idx % 2 === 0 ? "neo-tilt-hover" : "neo-tilt-hover-right";

          return (
            <div
              key={item.id}
              className={`bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col justify-between ${tiltClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 bg-[#635BFF] border-2 border-black dark:border-white rounded-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-mono font-black px-3 py-1.5 bg-[#E2FF00] text-black border-2 border-black dark:border-white rounded-md flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
                    <Calendar className="w-3.5 h-3.5 text-black" />
                    {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : "Present"}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase text-black dark:text-[#FFFFFF] tracking-tight">
                  {item.institution}
                </h3>
                <h4 className="text-sm font-bold text-[#FF6B35] mt-0.5 mb-2">
                  {degree} in {field}
                </h4>

                {desc && (
                  <div className="text-sm text-black/85 dark:text-[#FFFFFF]/85 leading-relaxed mb-4">
                    <MarkdownRenderer content={desc} />
                  </div>
                )}
              </div>

              {item.scoreGpa && (
                <div className="inline-flex items-center gap-1.5 self-start text-xs font-mono font-bold px-2.5 py-1 bg-[#E2FF00] text-black border-2 border-black rounded-md mt-2 shadow-[2px_2px_0px_0px_#000]">
                  <Award className="w-3.5 h-3.5" />
                  <span>GPA: {item.scoreGpa}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
