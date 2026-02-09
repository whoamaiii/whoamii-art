import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qmann.studio"),
  title: "Inner Eye Signal | Quentin Thiessen",
  description:
    "Immersive psychedelic portfolio built from drawings, scans, code, and hallucinated light.",
  openGraph: {
    title: "Inner Eye Signal | Quentin Thiessen",
    description:
      "Psychedelic visual replication, drawing-to-motion pieces, pure craft edits, and spatial scans.",
    type: "website",
    siteName: "Inner Eye Signal"
  },
  twitter: {
    card: "summary_large_image",
    title: "Inner Eye Signal | Quentin Thiessen",
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
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
