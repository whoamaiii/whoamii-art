import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal | WHOAMIII",
  description: "Entry point into WHOAMIII's immersive psychedelic portfolio."
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
