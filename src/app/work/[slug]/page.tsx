import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfterReveal } from "@/components/before-after-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { ProjectMedia } from "@/components/project-media";
import { ProcessLayerToggle } from "@/components/process-layer-toggle";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { TextReveal } from "@/components/text-reveal";
import { projects } from "@/content/projects";
import { projectTaxonomyBySlug } from "@/content/project-taxonomy";
import { contactMailHref, siteConfig } from "@/content/site";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return {
      title: "Work Not Found | WHOAMIII"
    };
  }

  return {
    title: `${project.title} | WHOAMIII`,
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
    <StaggerContainer
      as="main"
      id="main-content"
      tabIndex={-1}
      className="work-page top-spaced"
      kind="section"
    >
      <StaggerItem>
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
            <TextReveal text={project.title} as="h1" />
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
      </StaggerItem>

      <StaggerItem>
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
            <MagneticButton variant="ghost">
              <Link href="/replications" className="ghost-button" data-cursor-hit>
                Back To Replications
              </Link>
            </MagneticButton>
            <MagneticButton variant="ghost">
              <Link href="/films" className="ghost-button" data-cursor-hit>
                Continue To Films
              </Link>
            </MagneticButton>
            <MagneticButton variant="ghost">
              <Link href="/commissions" className="ghost-button" data-cursor-hit>
                Commission A Vision
              </Link>
            </MagneticButton>
            {contactMailHref ? (
              <MagneticButton variant="glow">
                <a className="glow-button" href={contactMailHref} data-cursor-hit>
                  Inquire For Collection
                </a>
              </MagneticButton>
            ) : (
              <MagneticButton variant="glow">
                <a
                  className="glow-button"
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hit
                >
                  Inquire Via Instagram
                </a>
              </MagneticButton>
            )}
          </div>
        </section>
      </StaggerItem>
    </StaggerContainer>
  );
}
