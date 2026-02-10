import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Quentin Qmann",
  description: "Contact Quentin Qmann for commissions, collaborations, and licensing inquiries."
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
