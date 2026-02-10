"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const emitNavMetrics = () => {
      const navElement = navRef.current;
      if (!navElement) return;

      const activeLink = navElement.querySelector(".nav-link-active");
      const activeStyles = activeLink instanceof HTMLElement ? window.getComputedStyle(activeLink) : null;
      const hasOverflow = navElement.scrollWidth > navElement.clientWidth + 1;
      const rootStyles = window.getComputedStyle(document.documentElement);

      // #region agent log H3 nav overflow and color
      fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: "initial",
          hypothesisId: "H3",
          location: "src/components/site-nav.tsx:21",
          message: "Site nav layout metrics",
          data: {
            pathname,
            viewportWidth: window.innerWidth,
            clientWidth: navElement.clientWidth,
            scrollWidth: navElement.scrollWidth,
            hasOverflow,
            activeColor: activeStyles?.color ?? null,
            activeTextShadow: activeStyles?.textShadow ?? null,
            accentWarm: rootStyles.getPropertyValue("--accent-warm").trim(),
            psychCyan: rootStyles.getPropertyValue("--psych-cyan").trim(),
            psychViolet: rootStyles.getPropertyValue("--psych-violet").trim()
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion

      // #region agent log H9 nav logging transport fallback
      fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: "initial",
          hypothesisId: "H9",
          location: "src/components/site-nav.tsx:58",
          message: "Site nav logging transport fallback probe",
          data: {
            pathname,
            viewportWidth: window.innerWidth
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    };

    emitNavMetrics();
    window.addEventListener("resize", emitNavMetrics, { passive: true });
    return () => window.removeEventListener("resize", emitNavMetrics);
  }, [pathname]);

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
        <nav ref={navRef} className="site-nav" aria-label="Main navigation">
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
