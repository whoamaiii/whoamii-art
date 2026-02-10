import Link from "next/link";
import type { Metadata } from "next";
import { MagneticButton } from "@/components/magnetic-button";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { TextReveal } from "@/components/text-reveal";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Experiments | WHOAMIII",
  description: "Process lab featuring layer breakdowns and workflow insights."
};

export default function ExperimentsPage() {
  const processFocused = projects.slice(0, 6);

  return (
    <StaggerContainer as="main" id="main-content" tabIndex={-1} className="top-spaced page-shell" kind="section">
      <StaggerItem>
        <section className="panel">
          <TextReveal text="Experiments / Process Lab" as="h1" />
          <p>
            Layer-by-layer reveals for how each replication piece is constructed from capture to final
            composite.
          </p>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="panel">
          <h2>Breakdowns</h2>
          <StaggerContainer className="category-row" kind="grid">
            {processFocused.map((project) => (
              <StaggerItem key={project.slug} className="category-card">
                <h3>{project.title}</h3>
                <ol>
                  {project.processLayers.map((layer) => (
                    <li key={`${project.slug}-${layer}`}>{layer}</li>
                  ))}
                </ol>
                <MagneticButton variant="ghost">
                  <Link href={`/work/${project.slug}`} className="ghost-button" data-cursor-hit>
                    Open Project
                  </Link>
                </MagneticButton>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="panel">
          <h2>Tools + Workflow</h2>
          <ul>
            <li>Blender: geometry nodes, procedural forms, scan deformation, and shading.</li>
            <li>After Effects: compositing, particle layering, and temporal rhythm edits.</li>
            <li>Photography + drawings as source truth before digital transformation.</li>
          </ul>
        </section>
      </StaggerItem>
    </StaggerContainer>
  );
}
