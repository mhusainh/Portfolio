"use client";

import React, { useState, useEffect } from "react";
import { ExperienceSection, ExperienceItem } from "@/components/ExperienceSection";
import { ProjectSection, ProjectItem } from "@/components/ProjectSection";
import { AchievementSection, AchievementItem } from "@/components/AchievementSection";
import { EducationSection, EducationItem } from "@/components/EducationSection";
import { WhatIDoSection } from "@/components/WhatIDoSection";
import { SkillSection, SkillItem } from "@/components/SkillSection";
import { SectionSkeleton } from "@/components/SectionSkeleton";
import { ScrollReveal } from "@/components/ScrollReveal";

interface DynamicSectionsProps {
  whatIDoEn?: string[];
  whatIDoId?: string[];
}

export function DynamicSections({
  whatIDoEn = [],
  whatIDoId = [],
}: DynamicSectionsProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);

  const [loadingExp, setLoadingExp] = useState(true);
  const [loadingProj, setLoadingProj] = useState(true);
  const [loadingAch, setLoadingAch] = useState(true);
  const [loadingEdu, setLoadingEdu] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Progressive prioritized waterfall fetching in exact visual flow
  useEffect(() => {
    async function loadInOrder() {
      // 1. First priority: Experience & Organizations
      try {
        const resExp = await fetch("/api/experiences");
        const dataExp = await resExp.json();
        if (Array.isArray(dataExp)) setExperiences(dataExp);
      } catch (e) {
        console.error("Experience load error:", e);
      } finally {
        setLoadingExp(false);
      }

      // 2. Second priority: Featured Projects
      try {
        const resProj = await fetch("/api/projects");
        const dataProj = await resProj.json();
        if (Array.isArray(dataProj)) setProjects(dataProj);
      } catch (e) {
        console.error("Project load error:", e);
      } finally {
        setLoadingProj(false);
      }

      // 3. Third priority: Achievements
      try {
        const resAch = await fetch("/api/achievements");
        const dataAch = await resAch.json();
        if (Array.isArray(dataAch)) setAchievements(dataAch);
      } catch (e) {
        console.error("Achievement load error:", e);
      } finally {
        setLoadingAch(false);
      }

      // 4. Fourth priority: Education
      try {
        const resEdu = await fetch("/api/education");
        const dataEdu = await resEdu.json();
        if (Array.isArray(dataEdu)) setEducation(dataEdu);
      } catch (e) {
        console.error("Education load error:", e);
      } finally {
        setLoadingEdu(false);
      }

      // 5. Fifth priority: Skills & Tools
      try {
        const resSkills = await fetch("/api/skills");
        const dataSkills = await resSkills.json();
        if (Array.isArray(dataSkills)) setSkills(dataSkills);
      } catch (e) {
        console.error("Skills load error:", e);
      } finally {
        setLoadingSkills(false);
      }
    }

    loadInOrder();
  }, []);

  return (
    <>
      {/* 1. Experience Section with Scroll Reveal */}
      {loadingExp ? (
        <SectionSkeleton cardsCount={2} cols="grid-cols-1" cardHeight="h-56" />
      ) : (
        <ScrollReveal>
          <ExperienceSection
            experiences={experiences}
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        </ScrollReveal>
      )}

      {/* 2. Projects Section with Scroll Reveal */}
      {loadingProj ? (
        <SectionSkeleton cardsCount={2} cols="grid-cols-1 md:grid-cols-2" cardHeight="h-72" />
      ) : (
        <ScrollReveal>
          <ProjectSection
            projects={projects}
            selectedProjectId={selectedProjectId}
            onOpenModal={(id) => setSelectedProjectId(id)}
            onCloseModal={() => setSelectedProjectId(null)}
          />
        </ScrollReveal>
      )}

      {/* 3. Achievements Section with Scroll Reveal */}
      {loadingAch ? (
        <SectionSkeleton cardsCount={3} cols="grid-cols-1 md:grid-cols-3" cardHeight="h-56" />
      ) : (
        <ScrollReveal>
          <AchievementSection achievements={achievements} />
        </ScrollReveal>
      )}

      {/* 4. Education Section with Scroll Reveal */}
      {loadingEdu ? (
        <SectionSkeleton cardsCount={2} cols="grid-cols-1 md:grid-cols-2" cardHeight="h-48" />
      ) : (
        <>
          <ScrollReveal>
            <EducationSection education={education} />
          </ScrollReveal>

          {/* What I Do Section: Triggered right after Education finishes */}
          <ScrollReveal>
            <WhatIDoSection itemsEn={whatIDoEn} itemsId={whatIDoId} />
          </ScrollReveal>
        </>
      )}

      {/* 5. Skills Section with Scroll Reveal */}
      {loadingSkills ? (
        <SectionSkeleton cardsCount={6} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-6" cardHeight="h-32" />
      ) : (
        <ScrollReveal>
          <SkillSection skills={skills} />
        </ScrollReveal>
      )}
    </>
  );
}
