import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | WHOAMIII",
  description: "Contact WHOAMIII for commissions, collaborations, and licensing inquiries."
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
