"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, Mail, ArrowDownRight } from "lucide-react";
import { NeoStarburst } from "@/components/NeoBrutalAssets";
import { ProfileCard } from "@/components/ProfileCard";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface HeroProps {
  profile: {
    fullName: string;
    title_en: string;
    title_id: string;
    bio_en: string;
    bio_id: string;
    avatar_url?: string | null;
    resume_url?: string | null;
    email?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
  } | null;
}

export function Hero({ profile }: HeroProps) {
  const { locale, t } = useLanguage();

  const title = locale === "en" ? profile?.title_en : profile?.title_id;
  const bio = locale === "en" ? profile?.bio_en : profile?.bio_id;

  return (
    <section id="hero" className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Headline & Bio */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Neo Starburst Badge */}
          <div className="flex items-center gap-3">
            <NeoStarburst text="OPEN TO WORK" />
          </div>

          {/* Name & Title */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-black dark:text-[#FFFFFF]">
              {profile?.fullName || "Mahmudi Husain Hasbullah"}
            </h1>
            <div className="mt-3 inline-block bg-[#E2FF00] text-black font-mono font-bold text-base md:text-lg px-3 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFFFFF]">
              {title || "Software Developer | PHP & Laravel Specialist"}
            </div>
          </div>

          {/* Bio Paragraph (Justified) */}
          <div className="text-base md:text-lg text-black/90 dark:text-[#FFFFFF]/90 max-w-[65ch] leading-relaxed border-l-4 border-[#635BFF] dark:border-[#9D93FF] pl-4 py-1 text-justify [text-justify:inter-word] overflow-hidden break-words">
            <MarkdownRenderer
              content={bio || "Dedicated software developer building clean, scalable backend systems and high-craft web applications."}
            />
          </div>

          {/* Action CTAs in Requested Sequence: Let's Talk -> Resume -> Explore Work */}
          <div className="flex flex-wrap gap-3 pt-2">
            {/* 1. Let's Talk (Coral #FF6B35) */}
            <a
              href="#contact"
              className="px-6 py-3 bg-[#FF6B35] text-white font-black uppercase text-sm tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>{t.hero.contactMe}</span>
            </a>

            {/* 2. Resume (Positioned in the middle) */}
            {profile?.resume_url ? (
              <a
                href="/api/resume"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-black uppercase text-sm tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#FF6B35]" />
                <span>{t.hero.resume}</span>
              </a>
            ) : (
              <a
                href="#contact"
                className="px-6 py-3 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-black uppercase text-sm tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-2"
                title="Hubungi untuk meminta resume PDF terbaru"
              >
                <FileText className="w-4 h-4 text-[#FF6B35]" />
                <span>{t.hero.resume}</span>
              </a>
            )}

            {/* 3. Explore Work (Indigo #635BFF) */}
            <a
              href="#experience"
              className="px-5 py-3 bg-[#635BFF] text-white font-black uppercase text-sm tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-2"
            >
              <span>{t.hero.exploreWork}</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Col: Encapsulated Profile Card with Built-in Barcode */}
        <div className="lg:col-span-4 flex justify-center">
          <ProfileCard
            fullName={profile?.fullName}
            avatarUrl={profile?.avatar_url}
            stackText="PHP / LARAVEL / GO"
            barcodeLabel="MAHMUDI // ARCH"
          />
        </div>
      </div>
    </section>
  );
}
