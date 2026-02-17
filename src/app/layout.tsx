import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Playfair_Display_SC } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/sanity/queries";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"]
});

const playfair = Playfair_Display_SC({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"]
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whoamiii.art";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WHOAMIII | Portfolio",
    template: "%s | WHOAMIII"
  },
  description: "Structured maximalist portfolio for commissions, artwork, and process storytelling.",
  openGraph: {
    type: "website",
    title: "WHOAMIII | Portfolio",
    description: "Structured maximalist portfolio for commissions, artwork, and process storytelling.",
    siteName: "WHOAMIII",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WHOAMIII Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WHOAMIII | Portfolio",
    description: "Structured maximalist portfolio for commissions, artwork, and process storytelling.",
    images: ["/opengraph-image"]
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable} ${jetbrains.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter contactEmail={settings.contactEmail} instagramUrl={settings.instagramUrl} />
      </body>
    </html>
  );
}
