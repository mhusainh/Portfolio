"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { X, ExternalLink, Code2, ChevronRight, ChevronLeft, Calendar, Trophy } from "lucide-react";
import { NeoStamp, getTechColor } from "@/components/NeoBrutalAssets";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

export interface ProjectItem {
  id: string;
  experience_id?: string | null;
  title: string;
  slug: string;
  description_en: string;
  description_id: string;
  cover_image_url: string;
  gallery_urls: string[];
  technologies: string[];
  project_url?: string | null;
  repository_url?: string | null;
  isFeatured?: boolean | null;
  experiences?: {
    organization_name: string;
    role_en: string;
    role_id: string;
  } | null;
  achievements?: {
    id: string;
    title_en: string;
    title_id: string;
    issuer: string;
    certificate_url?: string | null;
    credential_url?: string | null;
  }[];
}

interface ProjectSectionProps {
  projects: ProjectItem[];
  selectedProjectId: string | null;
  onCloseModal: () => void;
  onOpenModal: (id: string) => void;
}

export function ProjectSection({
  projects,
  selectedProjectId,
  onCloseModal,
  onOpenModal,
}: ProjectSectionProps) {
  const { locale, t } = useLanguage();
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body Scroll Lock: Prevent background page from scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedProject]);

  const allPhotos = selectedProject
    ? Array.from(
        new Set(
          [selectedProject.cover_image_url, ...(selectedProject.gallery_urls || [])].filter(Boolean)
        )
      )
    : [];

  return (
    <section id="projects" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14 border-t-2 border-black dark:border-white">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="mb-2">
            <NeoStamp text="FEATURED WORK" color="bg-[#FF6B35]" className="text-black" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
            {t.projects.title}
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] dark:text-[#FFFFFF]/80 mt-1 max-w-[60ch]">
            {t.projects.subtitle}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj, idx) => {
          const desc = locale === "en" ? proj.description_en : proj.description_id;
          const tiltClass = idx % 2 === 0 ? "neo-tilt-hover" : "neo-tilt-hover-right";

          return (
            <div
              key={proj.id}
              className={`bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] flex flex-col group ${tiltClass}`}
            >
              {/* Cover Image Container */}
              <div
                className="aspect-video w-full bg-black border-b-2 border-black dark:border-white overflow-hidden relative cursor-pointer"
                onClick={() => onOpenModal(proj.id)}
              >
                <img
                  src={proj.cover_image_url}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-[#000000] text-white text-xs font-mono font-bold border border-white rounded-md">
                  CLICK TO VIEW
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {proj.experiences && (
                    <div className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase mb-1">
                      {proj.experiences.organization_name}
                    </div>
                  )}
                  <h3 className="text-xl font-black uppercase text-black dark:text-[#FFFFFF] tracking-tight mb-2">
                    {proj.title}
                  </h3>
                  <div className="text-sm text-black/90 dark:text-[#FFFFFF]/90 leading-relaxed mb-4">
                    <MarkdownRenderer content={desc} clamp={5} />
                  </div>
                </div>

                <div>
                  {/* Tech Tags with Consistent Palette Colors */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className={`text-[11px] font-mono font-black px-2.5 py-1 border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] ${getTechColor(t)}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Optional Achievements Linked to this Project */}
                  {proj.achievements && proj.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.achievements.map((ach) => (
                        <a
                          key={ach.id}
                          href="#achievements"
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 bg-[#9D93FF] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000] neo-lift-hover"
                          title={`${ach.issuer}: ${locale === "en" ? ach.title_en : ach.title_id}`}
                        >
                          <Trophy className="w-3 h-3 text-black" />
                          <span className="truncate max-w-[200px]">
                            {locale === "en" ? ach.title_en : ach.title_id}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Buttons with Lift Animation */}
                  <div className="flex items-center gap-2 pt-2 border-t-2 border-black dark:border-white">
                    <button
                      onClick={() => onOpenModal(proj.id)}
                      className="flex-1 py-2 bg-[#E2FF00] text-black font-black text-xs uppercase tracking-wider border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] neo-lift-hover hover:bg-[#E2FF00] hover:text-black"
                    >
                      {t.projects.viewProject}
                    </button>
                    {Boolean(proj.project_url && proj.project_url.trim().length > 0) && (
                      <a
                        href={proj.project_url!}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-[#635BFF] text-white border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:bg-[#635BFF] hover:text-white neo-lift-hover"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {Boolean(proj.repository_url && proj.repository_url.trim().length > 0) && (
                      <a
                        href={proj.repository_url!}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black neo-lift-hover"
                        title="Repository"
                      >
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up Modal mounted directly to document.body via Portal to guarantee 100% viewport coverage */}
      {selectedProject && mounted && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-sm overflow-hidden"
          style={{ overscrollBehavior: "contain" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseModal();
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#FFFFFF] dark:bg-[#000000] border-4 border-black dark:border-white rounded-2xl shadow-none flex flex-col overflow-hidden"
            style={{ overscrollBehavior: "contain" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#E2FF00] text-black border-b-2 border-black px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-10">
              <span className="font-mono font-black text-xs sm:text-sm tracking-wider uppercase truncate pr-4">
                PROJECT DETAIL // {selectedProject.slug}
              </span>
              <button
                onClick={onCloseModal}
                className="p-1.5 bg-black text-white hover:bg-white hover:text-black border-2 border-black rounded-md transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Custom Neo Scrollbar & wheel event isolation */}
            <div
              className="p-6 overflow-y-auto neo-scrollbar flex-1 flex flex-col gap-6"
              style={{ overscrollBehavior: "contain" }}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Main Photo Gallery View */}
              <div>
                <div className="aspect-video w-full bg-black border-2 border-black dark:border-white rounded-xl overflow-hidden relative">
                  <img
                    src={allPhotos[activePhotoIdx]}
                    alt={selectedProject.title}
                    className="w-full h-full object-contain"
                  />
                  {allPhotos.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                      <button
                        onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))}
                        className="pointer-events-auto p-2 bg-white text-black border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActivePhotoIdx((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))}
                        className="pointer-events-auto p-2 bg-white text-black border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {allPhotos.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {allPhotos.map((photo, i) => (
                      <button
                        key={photo + i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`w-20 h-14 border-2 rounded-md flex-shrink-0 ${
                          activePhotoIdx === i
                            ? "border-[#FF6B35] shadow-[2px_2px_0px_0px_#FF6B35]"
                            : "border-black dark:border-white opacity-70"
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover rounded-sm" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Description */}
              <div>
                <h3 className="text-2xl md:text-3xl font-black uppercase text-black dark:text-[#FFFFFF] mb-2">
                  {selectedProject.title}
                </h3>
                <div className="text-base text-black/90 dark:text-[#FFFFFF]/90 leading-relaxed mb-4">
                  <MarkdownRenderer
                    content={locale === "en" ? selectedProject.description_en : selectedProject.description_id}
                  />
                </div>

                {/* Tech Badges in Modal with Consistent Palette */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`text-xs font-mono font-black px-3 py-1 border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF] ${getTechColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Achievements In Modal if Any */}
                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div className="mb-6 p-3 bg-[#9D93FF]/20 border-2 border-black dark:border-white rounded-lg">
                    <span className="text-xs font-mono font-bold uppercase text-black dark:text-white block mb-2 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-[#635BFF] dark:text-[#9D93FF]" />
                      <span>Prestasi & Penghargaan Terkait Proyek:</span>
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {selectedProject.achievements.map((ach) => (
                        <div key={ach.id} className="text-xs font-mono flex items-center justify-between gap-2">
                          <span className="font-bold text-black dark:text-white">
                            • {locale === "en" ? ach.title_en : ach.title_id} ({ach.issuer})
                          </span>
                          {(ach.credential_url || ach.certificate_url) && (
                            <a
                              href={ach.credential_url || ach.certificate_url!}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] underline text-[#635BFF] dark:text-[#9D93FF] font-bold"
                            >
                              Lihat Piagam
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Links (Only rendered when URLs exist) */}
                {(Boolean(selectedProject.project_url && selectedProject.project_url.trim().length > 0) ||
                  Boolean(selectedProject.repository_url && selectedProject.repository_url.trim().length > 0)) && (
                  <div className="flex flex-wrap gap-3">
                    {Boolean(selectedProject.project_url && selectedProject.project_url.trim().length > 0) && (
                      <a
                        href={selectedProject.project_url!}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#635BFF] text-white font-black uppercase text-xs tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex items-center gap-2 neo-lift-hover"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t.projects.liveDemo}</span>
                      </a>
                    )}
                    {Boolean(selectedProject.repository_url && selectedProject.repository_url.trim().length > 0) && (
                      <a
                        href={selectedProject.repository_url!}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-black text-white font-black uppercase text-xs tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] flex items-center gap-2 neo-lift-hover"
                      >
                        <Code2 className="w-4 h-4" />
                        <span>{t.projects.sourceCode}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
