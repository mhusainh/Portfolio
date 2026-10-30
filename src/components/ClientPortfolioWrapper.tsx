"use client";

import React, { useState } from "react";
import { ExperienceSection, ExperienceItem } from "@/components/ExperienceSection";
import { ProjectSection, ProjectItem } from "@/components/ProjectSection";

interface ClientPortfolioWrapperProps {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
}

export function ClientPortfolioWrapper({
  experiences,
  projects,
}: ClientPortfolioWrapperProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Modal opens instantly without jumping or scrolling the page
  };

  return (
    <>
      <ExperienceSection
        experiences={experiences}
        onSelectProject={handleSelectProject}
      />
      <ProjectSection
        projects={projects}
        selectedProjectId={selectedProjectId}
        onOpenModal={(id) => setSelectedProjectId(id)}
        onCloseModal={() => setSelectedProjectId(null)}
      />
    </>
  );
}
