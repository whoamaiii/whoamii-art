import Link from "next/link";
import { getSiteSettings } from "@/lib/sanity/queries";

export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <main id="main-content" className="page-shell">
      <div className="container page-stack">
        <section className="section-frame content-column">
          <p className="section-kicker">About</p>
          <h1>{settings.aboutHeading || "WHOAMIII"}</h1>
          <p>{settings.aboutBody}</p>
          <p>
            I design visual systems where intensity is intentional. Every frame balances expressive
            experimentation with repeatable structure so the work holds up both artistically and commercially.
          </p>
        </section>

        <section className="section-frame split-grid">
          <article className="hero-intro">
            <p className="section-kicker">Core Principles</p>
            <h2>How projects are built</h2>
            <ul className="bullet-list">
              <li>Composition before effects.</li>
              <li>Narrative clarity through process documentation.</li>
              <li>Material contrast: analog references plus digital precision.</li>
              <li>Delivery specs aligned to campaign and platform goals.</li>
            </ul>
          </article>

          <aside className="hero-note">
            <h3>Selected practice areas</h3>
            <ul>
              <li>Motion direction for artists and releases</li>
              <li>Campaign visuals and social-first loop systems</li>
              <li>Immersive installation-ready motion assets</li>
            </ul>
            <div className="hero-actions">
              <Link href="/work" className="button-secondary">
                Explore Work
              </Link>
              <Link href="/contact" className="button-primary">
                Discuss a Project
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
