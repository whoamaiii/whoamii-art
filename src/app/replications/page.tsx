"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
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

  return (
    <main className="top-spaced page-shell">
      <section className="panel">
        <h1>Replications</h1>
        <p>
          Selected works showing the convergence of photography, geometry, drawing, and digital
          synthesis.
        </p>
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
        <p className="muted">{filtered.length} pieces matched</p>
        <div className="portal-grid">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
