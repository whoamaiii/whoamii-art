import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | WHOAMIII",
  description: "Artist statement, style genome, and workflow philosophy of WHOAMIII."
};

export default function AboutPage() {
  return (
    <main className="top-spaced page-shell">
      <section className="panel">
        <h1>About</h1>
        <p>
          WHOAMIII is a motion artist working with psychedelic replication, sacred geometry, and
          bio-digital composites.
        </p>
        <p>
          The work starts from drawings, people, and real-world capture, then passes through Blender and
          After Effects to reveal hidden dimensions in everyday subjects.
        </p>
      </section>

      <section className="panel">
        <h2>Style Genome</h2>
        <ul>
          <li>Bio-digital symbiosis between human form and geometric overlays.</li>
          <li>Hyper-saturation used as emotional truth, not decoration.</li>
          <li>Motion as revelation: unfold, burst, pulse, then loop.</li>
          <li>Handmade + machine fusion with human intent driving the pipeline.</li>
        </ul>
      </section>
    </main>
  );
}
