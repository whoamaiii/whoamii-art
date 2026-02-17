import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main id="main-content" className="page-shell">
      <div className="container page-stack">
        <section className="section-frame content-column">
          <p className="section-kicker">404</p>
          <h1>This page does not exist.</h1>
          <p>The link may be outdated, unpublished, or moved to another route.</p>
          <div className="hero-actions">
            <Link href="/" className="button-primary">
              Go Home
            </Link>
            <Link href="/work" className="button-secondary">
              Browse Work
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
