import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commissions | Quentin Qmann",
  description:
    "Commission psychedelic visuals for campaigns, events, and immersive motion experiences."
};

export default function CommissionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
