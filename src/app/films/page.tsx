"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectMedia } from "@/components/project-media";
import { projects } from "@/content/projects";
import { projectTaxonomyBySlug } from "@/content/project-taxonomy";

export default function FilmsPage() {
  const [year, setYear] = useState<"Recent" | "2025" | "2024">("Recent");
  const [mood, setMood] = useState<"All" | "Meditative" | "Energetic" | "Surreal">("All");
  const [subject, setSubject] = useState<"All" | "Faces" | "Hands" | "Landscape" | "Animals" | "Objects">(
    "All"
  );

  const reelProjects = projects.filter((project) => Boolean(project.media.loopSrc));
  const filteredProjects = useMemo(() => {
    const result = reelProjects.filter((project) => {
      const tags = projectTaxonomyBySlug[project.slug];
      if (mood === "All") return true;
      return tags?.mood === mood;
    });

    const withSubject = result.filter((project) => {
      const tags = projectTaxonomyBySlug[project.slug];
      if (subject === "All") return true;
      return tags?.subject === subject;
    });

    const yearFiltered =
      year === "Recent" ? withSubject : withSubject.filter((project) => project.year === year);

    return yearFiltered.sort((a, b) => Number(b.year) - Number(a.year));
  }, [mood, reelProjects, subject, year]);

  return (
    <main className="top-spaced page-shell">
      <section className="panel">
        <p className="hero-kicker">Vertical Motion Archive</p>
        <h1>/FILMS</h1>
        <p>Loop-first reel gallery with chronology, mood, and subject metadata.</p>
        <p className="project-kicker">FLOW: PORTAL → REPLICATIONS → FILMS → COMMISSIONS</p>
        <div className="filter-wrap">
          <label>
            Chronology
            <select value={year} onChange={(event) => setYear(event.target.value as typeof year)}>
              <option value="Recent">Recent</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </label>
          <label>
            Mood
            <select value={mood} onChange={(event) => setMood(event.target.value as typeof mood)}>
              <option value="All">All moods</option>
              <option value="Meditative">Meditative</option>
              <option value="Energetic">Energetic</option>
              <option value="Surreal">Surreal</option>
            </select>
          </label>
          <label>
            Subject
            <select value={subject} onChange={(event) => setSubject(event.target.value as typeof subject)}>
              <option value="All">All subjects</option>
              <option value="Faces">Faces</option>
              <option value="Hands">Hands</option>
              <option value="Landscape">Landscape</option>
              <option value="Animals">Animals</option>
              <option value="Objects">Objects</option>
            </select>
          </label>
        </div>
        <p className="project-kicker">{filteredProjects.length} reels visible</p>
        <div className="film-grid">
          {filteredProjects.map((project) => {
            const tags = projectTaxonomyBySlug[project.slug];
            return (
              <article key={project.slug} className="film-card">
                <Link href={`/work/${project.slug}`}>
                  <ProjectMedia
                    className="film-frame"
                    loopSrc={project.media.loopSrc}
                    posterSrc={project.media.posterSrc}
                    gradientFallback={project.heroGradient}
                    mediaLabel={`${project.title} film preview`}
                  />
                </Link>
                <h3>{project.title.toUpperCase()}</h3>
                <div className="chip-row">
                  <span className="chip">Duration {project.duration}</span>
                  {tags?.bpm ? <span className="chip">BPM {tags.bpm}</span> : null}
                  <span className="chip">{project.year}</span>
                </div>
                <p className="muted">{tags?.audioCredit ?? "Credit pending"}</p>
                <div className="work-actions">
                  <Link href={`/work/${project.slug}`} className="ghost-button">
                    Open Study
                  </Link>
                  <Link href="/commissions" className="glow-button">
                    Commission Similar
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
