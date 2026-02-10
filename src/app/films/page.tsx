"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MagneticButton } from "@/components/magnetic-button";
import { ProjectMedia } from "@/components/project-media";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { TextReveal } from "@/components/text-reveal";
import { projects } from "@/content/projects";
import { projectTaxonomyBySlug } from "@/content/project-taxonomy";

export default function FilmsPage() {
  type YearOption = "Recent" | "2025" | "2024";
  type MoodOption = "All" | "Meditative" | "Energetic" | "Surreal";
  type SubjectOption = "All" | "Faces" | "Hands" | "Landscape" | "Animals" | "Objects";

  const [year, setYear] = useState<YearOption>("Recent");
  const [mood, setMood] = useState<MoodOption>("All");
  const [subject, setSubject] = useState<SubjectOption>("All");

  const isYearOption = (value: string): value is YearOption =>
    value === "Recent" || value === "2025" || value === "2024";
  const isMoodOption = (value: string): value is MoodOption =>
    value === "All" || value === "Meditative" || value === "Energetic" || value === "Surreal";
  const isSubjectOption = (value: string): value is SubjectOption =>
    value === "All" ||
    value === "Faces" ||
    value === "Hands" ||
    value === "Landscape" ||
    value === "Animals" ||
    value === "Objects";

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
    <StaggerContainer as="main" id="main-content" tabIndex={-1} className="top-spaced page-shell" kind="section">
      <StaggerItem>
        <section className="panel">
          <p className="hero-kicker">Vertical Motion Archive</p>
          <TextReveal text="/FILMS" as="h1" />
          <p>Loop-first reel gallery with chronology, mood, and subject metadata.</p>
          <p className="project-kicker">FLOW: PORTAL → REPLICATIONS → FILMS → COMMISSIONS</p>
          <div className="filter-wrap">
            <label>
              Chronology
              <select
                value={year}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isYearOption(value)) {
                    setYear(value);
                  }
                }}
                data-cursor-hit
              >
                <option value="Recent">Recent</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </label>
            <label>
              Mood
              <select
                value={mood}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isMoodOption(value)) {
                    setMood(value);
                  }
                }}
                data-cursor-hit
              >
                <option value="All">All moods</option>
                <option value="Meditative">Meditative</option>
                <option value="Energetic">Energetic</option>
                <option value="Surreal">Surreal</option>
              </select>
            </label>
            <label>
              Subject
              <select
                value={subject}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isSubjectOption(value)) {
                    setSubject(value);
                  }
                }}
                data-cursor-hit
              >
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
          <StaggerContainer className="film-grid" kind="grid">
            {filteredProjects.map((project) => {
              const tags = projectTaxonomyBySlug[project.slug];
              return (
                <StaggerItem key={project.slug}>
                  <article className="film-card">
                    <Link href={`/work/${project.slug}`} className="film-card-link hover-media-link" data-cursor-hit>
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
                      <MagneticButton variant="ghost">
                        <Link href={`/work/${project.slug}`} className="ghost-button" data-cursor-hit>
                          Open Study
                        </Link>
                      </MagneticButton>
                      <MagneticButton variant="glow">
                        <Link href="/commissions" className="glow-button" data-cursor-hit>
                          Commission Similar
                        </Link>
                      </MagneticButton>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      </StaggerItem>
    </StaggerContainer>
  );
}
