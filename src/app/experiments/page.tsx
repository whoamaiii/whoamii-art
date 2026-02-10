import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Experiments | Quentin Qmann",
  description: "Process lab featuring layer breakdowns and workflow insights."
};

export default function ExperimentsPage() {
  const processFocused = projects.slice(0, 6);

  return (
    <main className="top-spaced page-shell">
      <section className="panel">
        <h1>Experiments / Process Lab</h1>
        <p>
          Layer-by-layer reveals for how each replication piece is constructed from capture to final
          composite.
        </p>
      </section>

      <section className="panel">
        <h2>Breakdowns</h2>
        <div className="category-row">
          {processFocused.map((project) => (
            <article key={project.slug} className="category-card">
              <h3>{project.title}</h3>
              <ol>
                {project.processLayers.map((layer) => (
                  <li key={`${project.slug}-${layer}`}>{layer}</li>
                ))}
              </ol>
              <Link href={`/work/${project.slug}`} className="ghost-button">
                Open Project
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Tools + Workflow</h2>
        <ul>
          <li>Blender: geometry nodes, procedural forms, scan deformation, and shading.</li>
          <li>After Effects: compositing, particle layering, and temporal rhythm edits.</li>
          <li>Photography + drawings as source truth before digital transformation.</li>
        </ul>
      </section>
    </main>
  );
}
