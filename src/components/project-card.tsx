"use client";

import Link from "next/link";
import { ProjectMedia } from "@/components/project-media";
import { projectTaxonomyBySlug } from "@/content/project-taxonomy";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import type { Project } from "@/types/portfolio";

interface ProjectCardProps {
  project: Project;
  onSelect?: (slug: string) => void;
  selected?: boolean;
}

export function ProjectCard({ project, onSelect, selected = false }: ProjectCardProps) {
  const { lowPowerDevice, reducedMotion } = usePerformanceMode();
  const shouldShowVideo = !lowPowerDevice && !reducedMotion;
  const taxonomy = projectTaxonomyBySlug[project.slug];

  const cardBody = (
    <>
      <ProjectMedia
        className="project-card-hero"
        gradientFallback={project.heroGradient}
        loopSrc={shouldShowVideo ? project.media.loopSrc : undefined}
        posterSrc={project.media.posterSrc}
        mediaLabel={`${project.title} preview`}
      />
      <div className="project-card-content">
        <p className="project-kicker">ID_{project.slug.slice(0, 3).toUpperCase()}</p>
        <h3>{project.title}</h3>
        <p className="muted">{project.oneLiner}</p>
        <div className="chip-row">
          <span className="chip">{project.year}</span>
          <span className="chip">{project.duration}</span>
          {taxonomy?.mood ? <span className="chip">{taxonomy.mood}</span> : null}
        </div>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <article className={selected ? "project-card project-card-selected" : "project-card"}>
        <button
          type="button"
          className="project-card-select"
          onClick={() => onSelect(project.slug)}
          aria-pressed={selected}
        >
          {cardBody}
        </button>
        <div className="project-card-actions">
          <Link href={`/work/${project.slug}`} className="ghost-button">
            Open Full Project
          </Link>
        </div>
      </article>
    );
  }

  return (
    <Link href={`/work/${project.slug}`} className="project-card">
      <article>
        {cardBody}
      </article>
    </Link>
  );
}
