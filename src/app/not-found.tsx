import Link from "next/link";
import { MagneticButton } from "@/components/magnetic-button";
import { TextReveal } from "@/components/text-reveal";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found top-spaced">
      <TextReveal text="Signal Lost" as="h1" />
      <p>The portal you tried to enter does not exist.</p>
      <MagneticButton variant="glow">
        <Link href="/" className="glow-button" data-cursor-hit>
          Return To Home
        </Link>
      </MagneticButton>
    </main>
  );
}
