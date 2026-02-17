import Link from "next/link";

interface SiteFooterProps {
  contactEmail?: string;
  instagramUrl?: string;
}

export function SiteFooter({ contactEmail, instagramUrl }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p className="mono-meta">WHOAMIII · Structured Maximalist Portfolio</p>
        <div className="footer-links">
          {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : null}
          {instagramUrl ? (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          ) : null}
          <Link href="/contact">Commission Inquiry</Link>
        </div>
      </div>
    </footer>
  );
}
