"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand-mark" aria-label="WHOAMIII Home">
          <span>WHOAMIII</span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="primary-nav">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link href={link.href} className={isActive ? "nav-link is-active" : "nav-link"}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
