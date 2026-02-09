"use client";

import { FormEvent, useState } from "react";
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

    const response = await fetch("/api/commissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
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
    <main className="top-spaced page-shell">
      <section className="panel">
        <h1>Commissions</h1>
        <p>Custom visuals for music, campaigns, and immersive digital pieces.</p>
      </section>

      <section className="panel">
        <h2>Pricing Tiers</h2>
        <div className="category-row">
          <article className="category-card">
            <h3>Tier 1 - Minimal</h3>
            <p>Custom reel (15-30 sec, one subject)</p>
            <p className="muted">$3,000 - $5,000</p>
          </article>
          <article className="category-card">
            <h3>Tier 2 - Intermediate</h3>
            <p>Three-reel concept package</p>
            <p className="muted">$8,000 - $12,000</p>
          </article>
          <article className="category-card">
            <h3>Tier 3 - Premium</h3>
            <p>Bespoke campaign / installation / VJ package</p>
            <p className="muted">$15,000 - $50,000+</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>Intake</h2>
        <form className="intake-form" onSubmit={handleSubmit}>
          <input type="text" name="website" className="hp-input" autoComplete="off" tabIndex={-1} />
          <label>
            Name
            <input type="text" name="name" required minLength={2} />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Budget
            <select name="budget" required>
              <option value="">Select budget range</option>
              <option>$3k-$5k</option>
              <option>$8k-$12k</option>
              <option>$15k+</option>
            </select>
          </label>
          <label>
            Timeline
            <select name="timeline" required>
              <option value="">Select timeline</option>
              <option>1-2 weeks</option>
              <option>2-4 weeks</option>
              <option>1-2 months</option>
              <option>Flexible</option>
            </select>
          </label>
          <label>
            References
            <input type="text" name="references" placeholder="Links, songs, visuals" />
          </label>
          <label>
            Project Idea
            <textarea name="idea" rows={5} minLength={20} required />
          </label>
          <button type="submit" className="glow-button" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Submit Commission Request"}
          </button>
        </form>
        {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
        {contactMailHref ? (
          <a href={contactMailHref} className="glow-button">
            Send Intake By Email
          </a>
        ) : (
          <a className="ghost-button" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
            Fallback: Instagram DM
          </a>
        )}
      </section>
    </main>
  );
}
