"use client";

import type { PointerEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/magnetic-button";
import { ProjectCardMedia } from "@/components/project-card-media";
import { projectTaxonomyBySlug } from "@/content/project-taxonomy";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import type { Project } from "@/types/portfolio";

interface ProjectCardProps {
  project: Project;
  onSelect?: (slug: string) => void;
  selected?: boolean;
}

export function ProjectCard({ project, onSelect, selected = false }: ProjectCardProps) {
  const { lowPowerDevice, reducedMotion, motionTier } = usePerformanceMode();
  const shouldShowVideo = !lowPowerDevice && !reducedMotion;
  const taxonomy = projectTaxonomyBySlug[project.slug];
  const immersiveTilt = motionTier === "immersive";
  const [hovered, setHovered] = useState(false);

  const handleTilt = (event: PointerEvent<HTMLElement>) => {
    if (!immersiveTilt) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const dx = (event.clientX - rect.left) / rect.width - 0.5;
    const dy = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--card-tilt-x", `${dy * -7}deg`);
    element.style.setProperty("--card-tilt-y", `${dx * 8}deg`);
  };

  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    const element = event.currentTarget;
    element.style.setProperty("--card-tilt-x", "0deg");
    element.style.setProperty("--card-tilt-y", "0deg");
    setHovered(false);
  };

  const cardBody = (
    <>
      <div className="project-card-media-shell project-card-media-shell-live">
        <ProjectCardMedia
          className="project-card-hero"
          gradientFallback={project.heroGradient}
          loopSrc={shouldShowVideo ? project.media.loopSrc : undefined}
          posterSrc={project.media.posterSrc}
          mediaLabel={`${project.title} preview`}
          active={hovered}
          immersive={immersiveTilt}
        />
        <span
          className="project-card-aberration project-card-aberration-red"
          style={{
            backgroundImage: project.media.posterSrc
              ? `url(${project.media.posterSrc}), ${project.heroGradient}`
              : project.heroGradient,
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
          aria-hidden
        />
        <span
          className="project-card-aberration project-card-aberration-cyan"
          style={{
            backgroundImage: project.media.posterSrc
              ? `url(${project.media.posterSrc}), ${project.heroGradient}`
              : project.heroGradient,
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
          aria-hidden
        />
      </div>
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
      <article
        className={selected ? "project-card project-card-selected project-card-tilt" : "project-card project-card-tilt"}
        onPointerEnter={() => setHovered(true)}
        onPointerMove={handleTilt}
        onPointerLeave={resetTilt}
      >
        <button
          type="button"
          className="project-card-select"
          onClick={() => onSelect(project.slug)}
          aria-pressed={selected}
        >
          {cardBody}
        </button>
        <div className="project-card-actions">
          <MagneticButton variant="ghost">
            <Link href={`/work/${project.slug}`} className="ghost-button" data-cursor-hit>
              Open Full Project
            </Link>
          </MagneticButton>
        </div>
      </article>
    );
  }

  return (
    <Link
      href={`/work/${project.slug}`}
      className="project-card project-card-tilt"
      onPointerEnter={() => setHovered(true)}
      onPointerMove={handleTilt}
      onPointerLeave={resetTilt}
      data-cursor-hit
    >
      <article>
        {cardBody}
      </article>
    </Link>
  );
}
