import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProcessBlockRenderer } from "@/components/process-block-renderer";
import { optimizeCloudinaryVideo } from "@/lib/cloudinary";
import { urlForImage } from "@/lib/sanity/image";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity/queries";
import type { ProcessBlock } from "@/types/cms";

interface WorkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Work Not Found"
    };
  }

  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const heroImageUrl = urlForImage(project.coverImage)
    ?.width(1920)
    .height(1080)
    .fit("crop")
    .auto("format")
    .url();

  const heroVideoUrl = project.coverVideo ? optimizeCloudinaryVideo(project.coverVideo) : undefined;
  const processSections = (project.processBlocks || []).map((block: ProcessBlock, index: number) => {
    const fallbackLabel = `Section ${index + 1}`;
    let label = fallbackLabel;
    if (block._type === "richTextBlock") label = block.heading || `Text ${index + 1}`;
    if (block._type === "imageBlock") label = block.caption || `Image ${index + 1}`;
    if (block._type === "videoBlock") label = block.caption || `Video ${index + 1}`;
    if (block._type === "galleryBlock") label = block.caption || `Gallery ${index + 1}`;
    if (block._type === "milestoneBlock") label = block.stepTitle || `Milestone ${index + 1}`;
    if (block._type === "quoteBlock") label = block.attribution || `Quote ${index + 1}`;
    return {
      id: `process-${block._key}`,
      label
    };
  });
  const mediaBlockCount = (project.processBlocks || []).filter((block) =>
    block._type === "imageBlock" || block._type === "videoBlock" || block._type === "galleryBlock"
  ).length;

  return (
    <main id="main-content" className="page-shell">
      <div className="container page-stack">
        <article className="section-frame case-study">
          <header className="case-study-header">
            <p className="mono-meta">
              {project.year}
              {project.duration ? ` · ${project.duration}` : ""}
            </p>
            <h1>{project.title}</h1>
            <p className="case-study-summary">{project.summary}</p>
            <ul className="chip-row">
              {project.categories.map((category) => (
                <li key={`${project.slug}-${category}`}>{category}</li>
              ))}
              {project.tools.map((tool) => (
                <li key={`${project.slug}-${tool}`}>{tool}</li>
              ))}
            </ul>
            <ul className="case-stats-row" aria-label="Case study stats">
              <li>
                <span className="mono-meta">Blocks</span>
                <strong>{project.processBlocks.length}</strong>
              </li>
              <li>
                <span className="mono-meta">Media</span>
                <strong>{mediaBlockCount}</strong>
              </li>
              <li>
                <span className="mono-meta">Status</span>
                <strong>{project.status}</strong>
              </li>
            </ul>
          </header>

          <div className="case-media-shell">
            {heroVideoUrl ? (
              <video controls muted loop playsInline preload="metadata" poster={heroImageUrl}>
                <source src={heroVideoUrl} type="video/mp4" />
              </video>
            ) : heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt={project.coverImage?.alt || `${project.title} hero media`}
                width={1920}
                height={1080}
                sizes="(max-width: 1024px) 100vw, 82vw"
              />
            ) : (
              <div className="preview-frame preview-frame-landscape" aria-hidden>
                <div className="preview-fallback" />
              </div>
            )}
          </div>

          <section className="case-meta-grid" aria-label="Case study narrative">
            <article>
              <p className="mono-meta">Challenge</p>
              <p>{project.challenge || "Challenge details will be published soon."}</p>
            </article>
            <article>
              <p className="mono-meta">Solution</p>
              <p>{project.solution || "Solution details will be published soon."}</p>
            </article>
            <article>
              <p className="mono-meta">Outcome</p>
              <p>{project.outcome || "Outcome details will be published soon."}</p>
            </article>
          </section>

          <section className="case-process-layout" aria-label="Process navigation and content">
            {processSections.length ? (
              <aside className="case-process-nav">
                <p className="mono-meta">Process Navigator</p>
                <ul>
                  {processSections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`}>{section.label}</a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
            <ProcessBlockRenderer blocks={project.processBlocks || []} />
          </section>

          {project.credits.length ? (
            <section className="section-frame">
              <h2>Credits</h2>
              <ul className="credit-list">
                {project.credits.map((credit) => (
                  <li key={credit._key || `${credit.name}-${credit.role}`}>
                    <strong>{credit.name}</strong>
                    <p>{credit.role}</p>
                    {credit.link ? (
                      <a href={credit.link} target="_blank" rel="noopener noreferrer">
                        {credit.link}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="hero-actions">
            <Link href="/work" className="button-secondary">
              Back to Work
            </Link>
            <Link href="/contact" className="button-primary">
              Start a Similar Commission
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
