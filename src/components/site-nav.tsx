"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/portal", label: "Portal" },
  { href: "/replications", label: "Replications" },
  { href: "/films", label: "Films" },
  { href: "/experiments", label: "Experiments" },
  { href: "/about", label: "About" },
  { href: "/commissions", label: "Commissions" },
  { href: "/contact", label: "Contact" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <Link href="/portal" className="site-logo">
          QUENTIN QMANN
        </Link>
        <nav className="site-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "nav-link nav-link-active"
                  : "nav-link"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
