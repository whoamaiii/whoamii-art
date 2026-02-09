"use client";

import { useMemo, useState } from "react";
import { ProjectMedia } from "@/components/project-media";
import { projects } from "@/content/projects";
import { projectTaxonomyBySlug } from "@/content/project-taxonomy";

export default function FilmsPage() {
  const [mood, setMood] = useState<"All" | "Meditative" | "Energetic" | "Surreal" | "Abstract">("All");
  const [sortMode, setSortMode] = useState<"Recent" | "Oldest">("Recent");

  const reelProjects = projects.filter((project) => Boolean(project.media.loopSrc));
  const filteredProjects = useMemo(() => {
    const withMood = reelProjects.filter((project) => {
      const tags = projectTaxonomyBySlug[project.slug];
      if (mood === "All") return true;
      return tags?.mood === mood;
    });
    return withMood.sort((a, b) => {
      if (sortMode === "Recent") return Number(b.year) - Number(a.year);
      return Number(a.year) - Number(b.year);
    });
  }, [mood, reelProjects, sortMode]);

  return (
    <main className="top-spaced page-shell">
      <section className="panel">
        <h1>Films</h1>
        <p>Loop-first reel gallery with mood, audio, and rhythm context.</p>
        <div className="filter-wrap">
          <label>
            Mood
            <select value={mood} onChange={(event) => setMood(event.target.value as typeof mood)}>
              <option value="All">All</option>
              <option value="Meditative">Meditative</option>
              <option value="Energetic">Energetic</option>
              <option value="Surreal">Surreal</option>
              <option value="Abstract">Abstract</option>
            </select>
          </label>
          <label>
            Sort
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as typeof sortMode)}
            >
              <option value="Recent">Recent</option>
              <option value="Oldest">Oldest</option>
            </select>
          </label>
        </div>
        <div className="film-grid">
          {filteredProjects.map((project) => {
            const tags = projectTaxonomyBySlug[project.slug];
            return (
              <article key={project.slug} className="film-card">
                <ProjectMedia
                  className="film-frame"
                  loopSrc={project.media.loopSrc}
                  posterSrc={project.media.posterSrc}
                  gradientFallback={project.heroGradient}
                />
                <h3>{project.title}</h3>
                <p className="muted">
                  {project.year} - {project.duration} - {tags?.mood ?? "Surreal"}
                </p>
                <p className="muted">{tags?.audioCredit ?? "Original Reel Audio"}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
