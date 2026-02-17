import { InquiryForm } from "@/components/inquiry-form";
import { getSiteSettings } from "@/lib/sanity/queries";

export const revalidate = 300;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <main id="main-content" className="page-shell">
      <div className="container page-stack">
        <section className="section-frame split-grid">
          <div className="hero-intro">
            <p className="section-kicker">Commission Inquiry</p>
            <h1>Tell me what you want to build.</h1>
            <p>
              Share your concept, timeline, and budget range. You will receive a response with direction,
              scope framing, and next steps.
            </p>
            <p className="mono-meta">Response window: typically within 1-2 business days.</p>
          </div>

          <aside className="hero-note">
            <h3>What to include</h3>
            <ul>
              <li>Project goal and audience</li>
              <li>Where the visuals will be published</li>
              <li>Reference links and desired feeling</li>
              <li>Budget range and required timeline</li>
            </ul>
            {settings.contactEmail ? <p>Direct email: {settings.contactEmail}</p> : null}
          </aside>
        </section>

        <section className="section-frame">
          <InquiryForm />
        </section>
      </div>
    </main>
  );
}
