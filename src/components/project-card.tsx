"use client";

import Link from "next/link";
import { ProjectMedia } from "@/components/project-media";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import type { Project } from "@/types/portfolio";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { lowPowerDevice, reducedMotion } = usePerformanceMode();
  const shouldShowVideo = !lowPowerDevice && !reducedMotion;

  return (
    <Link href={`/work/${project.slug}`} className="project-card">
      <article>
        <ProjectMedia
          className="project-card-hero"
          gradientFallback={project.heroGradient}
          loopSrc={shouldShowVideo ? project.media.loopSrc : undefined}
          posterSrc={project.media.posterSrc}
        />
        <div className="project-card-content">
          <p className="project-kicker">
            {project.category} - {project.year}
          </p>
          <h3>{project.title}</h3>
          <p>{project.oneLiner}</p>
          <div className="chip-row">
            {project.toolStack.slice(0, 4).map((tool) => (
              <span key={`${project.slug}-${tool}`} className="chip">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
