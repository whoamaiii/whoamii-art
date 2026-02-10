"use client";

import { FormEvent, useState } from "react";
import { MagneticButton } from "@/components/magnetic-button";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { TextReveal } from "@/components/text-reveal";
import { contactMailHref, siteConfig } from "@/content/site";

export default function CommissionsPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      budget: String(form.get("budget") || ""),
      timeline: String(form.get("timeline") || ""),
      references: String(form.get("references") || ""),
      idea: String(form.get("idea") || ""),
      website: String(form.get("website") || "")
    };

    let response: Response;
    try {
      response = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again or use email/Instagram.");
      return;
    }
    const data = (await response.json().catch(() => ({}))) as { errors?: string[] };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.errors?.[0] ?? "Submission failed. Try email/Instagram instead.");
      return;
    }

    setStatus("success");
    setMessage("Commission request sent. You will receive a reply by email.");
    event.currentTarget.reset();
  }

  return (
    <StaggerContainer as="main" id="main-content" tabIndex={-1} className="top-spaced page-shell" kind="section">
      <StaggerItem>
        <section className="panel">
          <p className="hero-kicker">System Status: Active</p>
          <TextReveal text="/COMMISSIONS" as="h1" />
          <p>
            Commission psychedelic motion artifacts for campaigns, installations, and artist-led visual
            narratives.
          </p>
          <p className="project-kicker">FLOW: PORTAL → REPLICATIONS → FILMS → COMMISSIONS</p>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="panel">
          <h2>Select Engagement Tier</h2>
          <StaggerContainer className="category-row" kind="grid">
            <StaggerItem className="category-card">
              <p className="project-kicker">Tier 1</p>
              <h3>Minimal</h3>
              <p>Custom reel (15-30 sec, single subject)</p>
              <p className="muted">$3k-$5k</p>
            </StaggerItem>
            <StaggerItem className="category-card">
              <p className="project-kicker">Tier 2</p>
              <h3>Series</h3>
              <p>Three-reel cohesive concept package</p>
              <p className="muted">$8k-$12k</p>
            </StaggerItem>
            <StaggerItem className="category-card">
              <p className="project-kicker">Tier 3</p>
              <h3>Bespoke</h3>
              <p>Bespoke campaign / installation / VJ package</p>
              <p className="muted">$15k-$50k+</p>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="panel">
          <h2>Intake Metadata</h2>
          <form className="intake-form" onSubmit={handleSubmit}>
            <input type="text" name="website" className="hp-input" autoComplete="off" tabIndex={-1} />
            <label>
              Name / Organization
              <input type="text" name="name" required minLength={2} data-cursor-hit />
            </label>
            <label>
              Contact Email
              <input type="email" name="email" required data-cursor-hit />
            </label>
            <label>
              Budget Range
              <select name="budget" required data-cursor-hit>
                <option value="">Select budget range</option>
                <option>$3k-$5k</option>
                <option>$8k-$12k</option>
                <option>$15k+</option>
              </select>
            </label>
            <label>
              Estimated Timeline
              <select name="timeline" required data-cursor-hit>
                <option value="">Select timeline</option>
                <option>1-2 weeks</option>
                <option>2-4 weeks</option>
                <option>1-2 months</option>
                <option>Flexible</option>
              </select>
            </label>
            <label>
              References
              <input type="text" name="references" placeholder="Links, songs, visuals" data-cursor-hit />
            </label>
            <label>
              Brief Description
              <textarea name="idea" rows={5} minLength={20} required data-cursor-hit />
            </label>
            <p className="muted">Minimum 20 characters.</p>
            <MagneticButton variant="glow" disabled={status === "loading"}>
              <button type="submit" className="glow-button" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Initiate Commission"}
              </button>
            </MagneticButton>
          </form>
          <div role="status" aria-live="polite">
            {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
          </div>
          {contactMailHref ? (
            <MagneticButton variant="glow">
              <a href={contactMailHref} className="glow-button" data-cursor-hit>
                Send Intake By Email
              </a>
            </MagneticButton>
          ) : (
            <MagneticButton variant="ghost">
              <a
                className="ghost-button"
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hit
              >
                Inquire via Instagram DM
              </a>
            </MagneticButton>
          )}
        </section>
      </StaggerItem>
    </StaggerContainer>
  );
}
