"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Briefcase, Calendar, MapPin, ExternalLink, Layers } from "lucide-react";
import { NeoStamp, getTechColor } from "@/components/NeoBrutalAssets";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

export interface ExperienceItem {
  id: string;
  type: "working" | "internship" | "freelance" | "organization" | "committee";
  organization_name: string;
  role_en: string;
  role_id: string;
  description_en: string;
  description_id: string;
  logo_url?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean | null;
  location?: string | null;
  technologies: string[];
  projects?: {
    id: string;
    title: string;
    slug: string;
    cover_image_url: string;
    technologies: string[];
  }[];
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onSelectProject: (projectId: string) => void;
}

export function ExperienceSection({ experiences, onSelectProject }: ExperienceSectionProps) {
  const { locale, t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { key: "all", label: t.experience.all },
    { key: "working", label: t.experience.working },
    { key: "internship", label: t.experience.internship },
    { key: "freelance", label: t.experience.freelance },
    { key: "organization", label: t.experience.organization },
    { key: "committee", label: t.experience.committee },
  ];

  const filtered = filter === "all"
    ? experiences
    : experiences.filter((e) => e.type === filter);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section id="experience" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="mb-2">
            <NeoStamp text="CAREER TRACK" color="bg-[#E2FF00]" className="text-black" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
            {t.experience.title}
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] dark:text-[#FFFFFF]/80 mt-1 max-w-[60ch]">
            {t.experience.subtitle}
          </p>
        </div>

        {/* Filter Tabs with Lift Animation */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
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

      {/* Experience List */}
      <div className="flex flex-col gap-6">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl font-mono text-sm">
            No entries found in this category.
          </div>
        ) : (
          filtered.map((item) => {
            const role = locale === "en" ? item.role_en : item.role_id;
            const desc = locale === "en" ? item.description_en : item.description_id;

            return (
              <div
                key={item.id}
                className="bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl p-5 md:p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="inline-block px-2.5 py-1 text-xs font-black uppercase bg-[#9D93FF] text-black border-2 border-black dark:border-white mb-1.5 rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
                      {item.type}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-black dark:text-[#FFFFFF] tracking-tight">
                      {role}
                    </h3>
                    <h4 className="text-base font-bold text-[#FF6B35]">
                      {item.organization_name}
                    </h4>
                  </div>

                  {/* Dates & Location with Color Accent Paddings */}
                  <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs font-mono font-black">
                    <span className="flex items-center gap-1.5 bg-[#E2FF00] text-black px-3 py-1.5 border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      {formatDate(item.start_date)} - {item.is_current ? t.experience.current : item.end_date ? formatDate(item.end_date) : ""}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1.5 bg-[#FF6B35] text-white px-3 py-1.5 border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
                        <MapPin className="w-3.5 h-3.5 text-white" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm md:text-base text-black/90 dark:text-[#FFFFFF]/90 leading-relaxed mb-4">
                  <MarkdownRenderer content={desc} />
                </div>

                {/* Tech Chips with Consistent Palette Colors */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`text-xs font-mono font-black px-3 py-1 border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] ${getTechColor(tech)}`}
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Linked Projects delivered during this experience */}
                {item.projects && item.projects.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-dashed border-[#4A4A4A] dark:border-white/40">
                    <div className="text-xs font-mono font-black uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5 mb-3">
                      <Layers className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>{t.experience.deliveredProjects}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {item.projects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => onSelectProject(proj.id)}
                          className="text-left p-2.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-lg shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black neo-lift-hover flex items-center gap-2.5 group"
                        >
                          <img
                            src={proj.cover_image_url}
                            alt={proj.title}
                            className="w-12 h-12 object-cover border-2 border-black dark:border-white rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-black truncate">{proj.title}</h5>
                            <span className="text-[10px] font-mono opacity-80 flex items-center gap-1 mt-0.5">
                              View Project <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
