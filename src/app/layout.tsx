import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { PsychedelicRuntime } from "@/components/psychedelic-runtime";
import { SiteNav } from "@/components/site-nav";
import { PerformanceModeProvider } from "@/hooks/use-performance-mode";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"]
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qmann.studio"),
  title: "WHOAMIII | Motion Portfolio",
  description:
    "Psychedelic replication portfolio blending photography, geometry, and motion design.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "WHOAMIII | Motion Portfolio",
    description:
      "Psychedelic visual replication, drawing-to-motion pieces, pure craft edits, and spatial scans.",
    type: "website",
    siteName: "WHOAMIII",
    url: "https://qmann.studio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "WHOAMIII motion portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WHOAMIII | Motion Portfolio",
    description: "Psychedelic replication visuals and motion work.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-motion-tier="normal" suppressHydrationWarning>
      <body className={`${manrope.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
        <PerformanceModeProvider>
          <PsychedelicRuntime />
          <SiteNav />
          {children}
        </PerformanceModeProvider>
      </body>
    </html>
  );
}
