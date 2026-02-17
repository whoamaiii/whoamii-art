import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getFeaturedProjectCards, getSiteSettings } from "@/lib/sanity/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, featuredProjects] = await Promise.all([getSiteSettings(), getFeaturedProjectCards()]);

  return (
    <main id="main-content" className="page-shell">
      <div className="container page-stack">
        <section className="section-frame split-grid">
          <div className="hero-intro">
            <p className="section-kicker">{settings.manifestoKicker || "Structured Maximalist Motion"}</p>
            <h1>{settings.manifestoTitle || settings.siteTitle}</h1>
            <p>{settings.manifestoBody}</p>
            {settings.manifestoSubline ? <p className="mono-meta">{settings.manifestoSubline}</p> : null}
            <div className="hero-actions">
              <Link href="/contact" className="button-primary">
                Start a Commission
              </Link>
              <Link href="/work" className="button-secondary">
                View All Work
              </Link>
            </div>
          </div>

          <aside className="hero-note" aria-label="Creative positioning">
            <h2>Composed intensity, not chaos.</h2>
            <ul>
              <li>Process-led case studies with art direction context.</li>
              <li>Mixed media storytelling: text, stills, and motion.</li>
              <li>Delivery-ready commission workflows for campaigns and artists.</li>
            </ul>
          </aside>
        </section>

        <section className="section-frame">
          <div className="section-head">
            <p className="section-kicker">Featured Work</p>
            <h2>Selected Projects</h2>
            <p>Curated pieces that represent the current direction of WHOAMIII.</p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="featured-grid">
              {featuredProjects.slice(0, 6).map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="empty-shell">
              <p>No featured projects are published yet. Add content in Sanity, then publish to surface it here.</p>
            </div>
          )}
        </section>

        <section className="section-frame split-grid">
          <div className="hero-intro">
            <p className="section-kicker">Commission Process</p>
            <h2>From concept signal to final delivery.</h2>
            <p>
              Every engagement starts with intent mapping, then moves through visual language definition,
              production, and delivery-ready outputs tailored to your release or campaign timeline.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="button-primary">
                Submit Brief
              </Link>
              <Link href="/about" className="button-secondary">
                Read Philosophy
              </Link>
            </div>
          </div>
          <aside className="hero-note">
            <h3>Typical project phases</h3>
            <ul>
              <li>1. Direction and references</li>
              <li>2. Form and rhythm passes</li>
              <li>3. Iteration and polish cycles</li>
              <li>4. Final masters and handoff</li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
