import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
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
  title: "Quentin Qmann | Motion Portfolio",
  description:
    "Psychedelic replication portfolio blending photography, geometry, and motion design.",
  openGraph: {
    title: "Quentin Qmann | Motion Portfolio",
    description:
      "Psychedelic visual replication, drawing-to-motion pieces, pure craft edits, and spatial scans.",
    type: "website",
    siteName: "Quentin Qmann"
  },
  twitter: {
    card: "summary_large_image",
    title: "Quentin Qmann | Motion Portfolio",
    description: "Psychedelic replication visuals and motion work."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${jetBrainsMono.variable}`}>
        <SiteNav />
        <div id="main-content" role="main" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
