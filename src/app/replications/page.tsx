"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { BeforeAfterReveal } from "@/components/before-after-reveal";
import { projects } from "@/content/projects";
import {
  colorFilters,
  intensityFilters,
  projectTaxonomyBySlug,
  subjectFilters,
  techniqueFilters
} from "@/content/project-taxonomy";

export default function ReplicationsPage() {
  const [technique, setTechnique] = useState<(typeof techniqueFilters)[number]>("All");
  const [subject, setSubject] = useState<(typeof subjectFilters)[number]>("All");
  const [intensity, setIntensity] = useState<(typeof intensityFilters)[number]>("All");
  const [color, setColor] = useState<(typeof colorFilters)[number]>("All");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const tags = projectTaxonomyBySlug[project.slug];
      if (!tags) return false;
      if (technique !== "All" && tags.technique !== technique) return false;
      if (subject !== "All" && tags.subject !== subject) return false;
      if (intensity !== "All" && tags.intensity !== intensity) return false;
      if (color !== "All" && tags.color !== color) return false;
      return true;
    });
  }, [color, intensity, subject, technique]);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedSlug(null);
      return;
    }
    if (!selectedSlug || !filtered.some((project) => project.slug === selectedSlug)) {
      setSelectedSlug(filtered[0].slug);
    }
  }, [filtered, selectedSlug]);

  const focusProject = filtered.find((project) => project.slug === selectedSlug) ?? filtered[0];

  return (
    <main className="top-spaced page-shell">
      <section className="panel">
        <p className="hero-kicker">Archive Entry</p>
        <h1>/REPLICATIONS</h1>
        <p>
          Filterable archive of photography, geometry, hand-drawn studies, and hybrid composites.
        </p>
        <p className="project-kicker">FLOW: PORTAL → REPLICATIONS → FILMS → COMMISSIONS</p>
        <p className="muted">Click any card to load its process study below.</p>
        <div className="filter-wrap">
          <label>
            Technique
            <select value={technique} onChange={(event) => setTechnique(event.target.value as never)}>
              {techniqueFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Subject
            <select value={subject} onChange={(event) => setSubject(event.target.value as never)}>
              {subjectFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Intensity
            <select value={intensity} onChange={(event) => setIntensity(event.target.value as never)}>
              {intensityFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Color
            <select value={color} onChange={(event) => setColor(event.target.value as never)}>
              {colorFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="project-kicker">{filtered.length} pieces matched</p>
        <div className="portal-grid">
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              selected={selectedSlug === project.slug}
              onSelect={setSelectedSlug}
            />
          ))}
        </div>
      </section>

      {focusProject ? (
        <section className="panel">
          <p className="hero-kicker">Process Study</p>
          <h2>{focusProject.title}</h2>
          <p>{focusProject.oneLiner}</p>
          <BeforeAfterReveal
            afterSrc={focusProject.media.posterSrc}
            fallbackGradient={focusProject.heroGradient}
            label={focusProject.title}
          />
          <div className="work-actions">
            <Link href={`/work/${focusProject.slug}`} className="ghost-button">
              Open Full Project
            </Link>
            <Link href="/films" className="ghost-button">
              Continue To Films
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
