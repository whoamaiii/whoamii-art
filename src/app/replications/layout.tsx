import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replications | Inner Eye Signal",
  description:
    "Filterable archive of psychedelic replications across photography, drawing, and hybrid motion."
};

export default function ReplicationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
