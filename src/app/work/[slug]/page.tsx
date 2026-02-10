import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfterReveal } from "@/components/before-after-reveal";
import { ProjectMedia } from "@/components/project-media";
import { ProcessLayerToggle } from "@/components/process-layer-toggle";
import { projects } from "@/content/projects";
import { projectTaxonomyBySlug } from "@/content/project-taxonomy";
import { contactMailHref, siteConfig } from "@/content/site";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return {
      title: "Work Not Found | Quentin Qmann"
    };
  }

  return {
    title: `${project.title} | Quentin Qmann`,
    description: project.oneLiner
  };
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    notFound();
  }
  const tags = projectTaxonomyBySlug[project.slug];

  return (
    <main className="work-page">
      <div className="work-hero">
        <ProjectMedia
          className="work-hero-media"
          gradientFallback={project.heroGradient}
          loopSrc={project.media.loopSrc}
          posterSrc={project.media.posterSrc}
          mediaLabel={`${project.title} hero media`}
        />
        <div className="work-hero-overlay">
          <p className="project-kicker">{project.category} - {project.year} - {project.duration}</p>
          <h1>{project.title}</h1>
          <p>{project.oneLiner}</p>
          <div className="chip-row">
            {project.toolStack.map((tool) => (
              <span key={`${project.slug}-${tool}`} className="chip">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="work-content">
        <article>
          <h2>Artist Note</h2>
          <p>
            This piece is part of the {project.category} stream, where source textures and symbolic
            forms are transformed into cinematic loops with an emotional center.
          </p>
        </article>

        <article>
          <h2>Vibe Tags</h2>
          <div className="chip-row">
            {project.vibe.map((tag) => (
              <span key={`${project.slug}-${tag}`} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </article>

        <article>
          <h2>Classification</h2>
          <div className="chip-row">
            <span className="chip">{tags?.technique ?? "Hybrid"}</span>
            <span className="chip">{tags?.subject ?? "Subject Study"}</span>
            <span className="chip">{tags?.intensity ?? "Moderate"}</span>
            <span className="chip">{tags?.color ?? "Multi"}</span>
            <span className="chip">{tags?.mood ?? "Surreal"}</span>
          </div>
        </article>

        <BeforeAfterReveal
          afterSrc={project.media.posterSrc}
          fallbackGradient={project.heroGradient}
          label={project.title}
        />

        <ProcessLayerToggle layers={project.processLayers} />

        <div className="work-actions">
          <Link href="/replications" className="ghost-button">
            Back To Replications
          </Link>
          <Link href="/films" className="ghost-button">
            Continue To Films
          </Link>
          <Link href="/commissions" className="ghost-button">
            Commission A Vision
          </Link>
          {contactMailHref ? (
            <a className="glow-button" href={contactMailHref}>
              Inquire For Collection
            </a>
          ) : (
            <a
              className="glow-button"
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Inquire Via Instagram
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
