"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { identitySystem } from "@/content/identity";
import { PortalBackground } from "@/components/portal-background";
import { ProjectCard } from "@/components/project-card";

export default function PortalPage() {
  return (
    <main className="home-shell top-spaced">
      <PortalBackground />

      <section className="hero-zone">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-kicker"
        >
          {identitySystem.portalName}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
        >
          Unveiling hidden dimensions.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 1 }}
          className="lead"
        >
          Psychedelic replication where sacred geometry meets human form.
        </motion.p>
        <div className="hero-actions">
          <Link href="/replications" className="glow-button">
            Enter The Archive
          </Link>
          <Link href="/experiments" className="ghost-button">
            See The Process
          </Link>
          <Link href="/commissions" className="ghost-button">
            Commission A Vision
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Signature Pieces</h2>
          <p>A curated selection representing your strongest style DNA.</p>
        </div>
        <div className="portal-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
