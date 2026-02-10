import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { identitySystem } from "@/content/identity";
import { contactMailHref, siteConfig } from "@/content/site";
import { ProjectCard } from "@/components/project-card";

export default function PortalPage() {
  const activeYears = new Set(featuredProjects.map((project) => project.year)).size;
  const topTools = new Set(featuredProjects.flatMap((project) => project.toolStack)).size;

  return (
    <main className="home-shell top-spaced">
      <section className="hero-zone">
        <p className="hero-kicker">{identitySystem.portalName}</p>
        <h1>
          QUENTIN
          <br />
          QMANN
        </h1>
        <p className="lead">
          Psychedelic replication where sacred geometry meets human form.
        </p>
        <p className="lead lead-soft">
          I design cinematic loops and visual systems for artists, campaigns, and immersive experiences.
        </p>
        <p className="project-kicker">FLOW: PORTAL → REPLICATIONS → FILMS → COMMISSIONS</p>
        <div className="hero-actions">
          <Link href="/replications" className="ghost-button">
            Enter Replications
          </Link>
          <Link href="/films" className="ghost-button">
            Watch Films
          </Link>
          <Link href="/commissions" className="glow-button">
            Commission a Vision
          </Link>
        </div>
        <div className="hero-stats" aria-label="Studio stats">
          <article>
            <p className="project-kicker">Featured Works</p>
            <p>{featuredProjects.length}</p>
          </article>
          <article>
            <p className="project-kicker">Active Years</p>
            <p>{activeYears}</p>
          </article>
          <article>
            <p className="project-kicker">Toolchain Nodes</p>
            <p>{topTools}</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>What I Create</h2>
        <p>Flexible formats for social drops, music visuals, and experiential storytelling.</p>
        <div className="category-row">
          <article className="category-card">
            <p className="project-kicker">Artist Visuals</p>
            <h3>Loop Packs + Reel Sequences</h3>
            <p className="muted">High-impact vertical loops tailored for music releases and social launches.</p>
          </article>
          <article className="category-card">
            <p className="project-kicker">Campaign Motion</p>
            <h3>Identity-Led Micro Films</h3>
            <p className="muted">Concept-driven edits that merge surreal design language with product or talent.</p>
          </article>
          <article className="category-card">
            <p className="project-kicker">Immersive Assets</p>
            <h3>Projection + Installation Loops</h3>
            <p className="muted">Layered visuals engineered to hold attention in live and spatial contexts.</p>
          </article>
        </div>
        <div className="contact-actions">
          <Link href="/commissions" className="glow-button">
            Start A Commission
          </Link>
          <Link href="/contact" className="ghost-button">
            Contact Studio
          </Link>
          <a
            href={siteConfig.instagramUrl}
            className="ghost-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </section>

      <section className="panel">
        <h2>Signature Pieces</h2>
        <p>A curated archive of signature psychedelic replication studies.</p>
        <div className="portal-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Ready To Build Something Unforgettable?</h2>
        <p>
          Send your concept, timeline, and budget. I will map the visual direction and return with a
          scoped production plan.
        </p>
        <div className="contact-actions">
          <Link href="/commissions" className="glow-button">
            Submit Brief
          </Link>
          {contactMailHref ? (
            <a className="ghost-button" href={contactMailHref}>
              Email Studio
            </a>
          ) : null}
          <Link href="/films" className="ghost-button">
            Explore Film Archive
          </Link>
        </div>
      </section>
    </main>
  );
}
