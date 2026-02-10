import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Films | Quentin Qmann",
  description: "Vertical-first reel gallery with mood-based discovery and loop previews."
};

export default function FilmsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
