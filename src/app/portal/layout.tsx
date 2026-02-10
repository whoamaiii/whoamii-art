import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal | Quentin Qmann",
  description: "Entry point into Quentin Qmann's immersive psychedelic portfolio."
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
