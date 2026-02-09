import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Signal Lost</h1>
      <p>The portal you tried to enter does not exist.</p>
      <Link href="/" className="glow-button">
        Return To Home
      </Link>
    </main>
  );
}
