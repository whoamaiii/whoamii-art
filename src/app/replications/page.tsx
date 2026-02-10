"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { BeforeAfterReveal } from "@/components/before-after-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { TextReveal } from "@/components/text-reveal";
import { projects } from "@/content/projects";
import {
  colorFilters,
  intensityFilters,
  projectTaxonomyBySlug,
  subjectFilters,
  techniqueFilters
} from "@/content/project-taxonomy";

const techniqueOptions = new Set<string>(techniqueFilters);
const subjectOptions = new Set<string>(subjectFilters);
const intensityOptions = new Set<string>(intensityFilters);
const colorOptions = new Set<string>(colorFilters);

const isTechniqueOption = (value: string): value is (typeof techniqueFilters)[number] =>
  techniqueOptions.has(value);
const isSubjectOption = (value: string): value is (typeof subjectFilters)[number] =>
  subjectOptions.has(value);
const isIntensityOption = (value: string): value is (typeof intensityFilters)[number] =>
  intensityOptions.has(value);
const isColorOption = (value: string): value is (typeof colorFilters)[number] =>
  colorOptions.has(value);

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
    <StaggerContainer as="main" id="main-content" tabIndex={-1} className="top-spaced page-shell" kind="section">
      <StaggerItem>
        <section className="panel">
          <p className="hero-kicker">Archive Entry</p>
          <TextReveal text="/REPLICATIONS" as="h1" />
          <p>
            Filterable archive of photography, geometry, hand-drawn studies, and hybrid composites.
          </p>
          <p className="project-kicker">FLOW: PORTAL → REPLICATIONS → FILMS → COMMISSIONS</p>
          <p className="muted">Click any card to load its process study below.</p>
          <div className="filter-wrap">
            <label>
              Technique
              <select
                value={technique}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isTechniqueOption(value)) {
                    setTechnique(value);
                  }
                }}
                data-cursor-hit
              >
                {techniqueFilters.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
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
                {subjectFilters.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Intensity
              <select
                value={intensity}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isIntensityOption(value)) {
                    setIntensity(value);
                  }
                }}
                data-cursor-hit
              >
                {intensityFilters.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Color
              <select
                value={color}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isColorOption(value)) {
                    setColor(value);
                  }
                }}
                data-cursor-hit
              >
                {colorFilters.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="project-kicker">{filtered.length} pieces matched</p>
          <StaggerContainer className="portal-grid" kind="grid">
            {filtered.map((project) => (
              <StaggerItem key={project.slug}>
                <ProjectCard
                  project={project}
                  selected={selectedSlug === project.slug}
                  onSelect={setSelectedSlug}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </StaggerItem>

      {focusProject ? (
        <StaggerItem>
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
              <MagneticButton variant="ghost">
                <Link href={`/work/${focusProject.slug}`} className="ghost-button" data-cursor-hit>
                  Open Full Project
                </Link>
              </MagneticButton>
              <MagneticButton variant="ghost">
                <Link href="/films" className="ghost-button" data-cursor-hit>
                  Continue To Films
                </Link>
              </MagneticButton>
            </div>
          </section>
        </StaggerItem>
      ) : null}
    </StaggerContainer>
  );
}
