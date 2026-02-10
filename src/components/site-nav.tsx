"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

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
  const logoLetters = "WHOAMIII".split("");

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <Link href="/portal" className="site-logo" data-cursor-hit>
          {logoLetters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="site-logo-letter"
              style={{ "--logo-index": String(index) } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "nav-link nav-link-active" : "nav-link"}
                aria-current={isActive ? "page" : undefined}
                data-cursor-hit
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
