import Link from "next/link";
import { AnimatedNumber } from "@/components/animated-number";
import { MagneticButton } from "@/components/magnetic-button";
import { featuredProjects } from "@/content/projects";
import { identitySystem } from "@/content/identity";
import { contactMailHref, siteConfig } from "@/content/site";
import { ProjectCard } from "@/components/project-card";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { TextReveal } from "@/components/text-reveal";

export default function PortalPage() {
  const activeYears = new Set(featuredProjects.map((project) => project.year)).size;
  const topTools = new Set(featuredProjects.flatMap((project) => project.toolStack)).size;

  return (
    <StaggerContainer as="main" id="main-content" tabIndex={-1} className="home-shell top-spaced" kind="section">
      <StaggerItem>
        <section className="hero-zone">
          <p className="hero-kicker">{identitySystem.portalName}</p>
          <TextReveal text="WHOAMIII" as="h1" rgbPersist />
          <p className="lead">
            Psychedelic replication where sacred geometry meets human form.
          </p>
          <p className="lead lead-soft">
            I design cinematic loops and visual systems for artists, campaigns, and immersive experiences.
          </p>
          <p className="project-kicker">FLOW: PORTAL → REPLICATIONS → FILMS → COMMISSIONS</p>
          <div className="hero-actions">
            <MagneticButton variant="ghost">
              <Link href="/replications" className="ghost-button" data-cursor-hit>
                Enter Replications
              </Link>
            </MagneticButton>
            <MagneticButton variant="ghost">
              <Link href="/films" className="ghost-button" data-cursor-hit>
                Watch Films
              </Link>
            </MagneticButton>
            <MagneticButton variant="glow">
              <Link href="/commissions" className="glow-button" data-cursor-hit>
                Commission a Vision
              </Link>
            </MagneticButton>
          </div>
          <StaggerContainer className="hero-stats" kind="grid">
            <StaggerItem>
              <article>
                <p className="project-kicker">Featured Works</p>
                <p><AnimatedNumber value={featuredProjects.length} /></p>
              </article>
            </StaggerItem>
            <StaggerItem>
              <article>
                <p className="project-kicker">Active Years</p>
                <p><AnimatedNumber value={activeYears} /></p>
              </article>
            </StaggerItem>
            <StaggerItem>
              <article>
                <p className="project-kicker">Toolchain Nodes</p>
                <p><AnimatedNumber value={topTools} /></p>
              </article>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="panel">
          <h2>What I Create</h2>
          <p>Flexible formats for social drops, music visuals, and experiential storytelling.</p>
          <StaggerContainer className="category-row" kind="grid">
            <StaggerItem className="category-card">
              <p className="project-kicker">Artist Visuals</p>
              <h3>Loop Packs + Reel Sequences</h3>
              <p className="muted">High-impact vertical loops tailored for music releases and social launches.</p>
            </StaggerItem>
            <StaggerItem className="category-card">
              <p className="project-kicker">Campaign Motion</p>
              <h3>Identity-Led Micro Films</h3>
              <p className="muted">Concept-driven edits that merge surreal design language with product or talent.</p>
            </StaggerItem>
            <StaggerItem className="category-card">
              <p className="project-kicker">Immersive Assets</p>
              <h3>Projection + Installation Loops</h3>
              <p className="muted">Layered visuals engineered to hold attention in live and spatial contexts.</p>
            </StaggerItem>
          </StaggerContainer>
          <div className="contact-actions">
            <MagneticButton variant="glow">
              <Link href="/commissions" className="glow-button" data-cursor-hit>
                Start A Commission
              </Link>
            </MagneticButton>
            <MagneticButton variant="ghost">
              <Link href="/contact" className="ghost-button" data-cursor-hit>
                Contact Studio
              </Link>
            </MagneticButton>
            <MagneticButton variant="ghost">
              <a
                href={siteConfig.instagramUrl}
                className="ghost-button"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hit
              >
                Instagram
              </a>
            </MagneticButton>
          </div>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="panel">
          <h2>Signature Pieces</h2>
          <p>A curated archive of signature psychedelic replication studies.</p>
          <StaggerContainer className="portal-grid" kind="grid">
            {featuredProjects.map((project) => (
              <StaggerItem key={project.slug}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="panel">
          <h2>Ready To Build Something Unforgettable?</h2>
          <p>
            Send your concept, timeline, and budget. I will map the visual direction and return with a
            scoped production plan.
          </p>
          <div className="contact-actions">
            <MagneticButton variant="glow">
              <Link href="/commissions" className="glow-button" data-cursor-hit>
                Submit Brief
              </Link>
            </MagneticButton>
            {contactMailHref ? (
              <MagneticButton variant="ghost">
                <a className="ghost-button" href={contactMailHref} data-cursor-hit>
                  Email Studio
                </a>
              </MagneticButton>
            ) : null}
            <MagneticButton variant="ghost">
              <Link href="/films" className="ghost-button" data-cursor-hit>
                Explore Film Archive
              </Link>
            </MagneticButton>
          </div>
        </section>
      </StaggerItem>
    </StaggerContainer>
  );
}
