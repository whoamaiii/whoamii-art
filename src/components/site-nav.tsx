"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/portal", label: "Portal" },
  { href: "/replications", label: "Replications" },
  { href: "/experiments", label: "Experiments" },
  { href: "/films", label: "Films" },
  { href: "/about", label: "About" },
  { href: "/commissions", label: "Commissions" },
  { href: "/contact", label: "Contact" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/portal" className="site-logo">
        QUENTIN QMANN
      </Link>
      <nav className="site-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "nav-link nav-link-active" : "nav-link"}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
