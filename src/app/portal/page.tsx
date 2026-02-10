import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { identitySystem } from "@/content/identity";
import { ProjectCard } from "@/components/project-card";

export default function PortalPage() {
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
    </main>
  );
}
