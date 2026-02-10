"use client";

import { FormEvent, useState } from "react";
import { MagneticButton } from "@/components/magnetic-button";
import { StaggerContainer, StaggerItem } from "@/components/stagger-container";
import { TextReveal } from "@/components/text-reveal";
import { contactMailHref, siteConfig } from "@/content/site";

export default function ContactPage() {
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
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
      website: String(form.get("website") || "")
    };

    let response: Response;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again or reach out via email/Instagram.");
      return;
    }
    const data = (await response.json().catch(() => ({}))) as { errors?: string[] };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.errors?.[0] ?? "Submission failed. Try email or Instagram.");
      return;
    }

    setStatus("success");
    setMessage("Message sent. Thanks for reaching out.");
    event.currentTarget.reset();
  }

  return (
    <StaggerContainer as="main" id="main-content" tabIndex={-1} className="top-spaced page-shell" kind="section">
      <StaggerItem>
        <section className="panel">
          <TextReveal text="Contact" as="h1" />
          <p>Commissions, collaborations, festivals, and licensing inquiries.</p>
          <form className="intake-form" onSubmit={handleSubmit}>
            <input type="text" name="website" className="hp-input" autoComplete="off" tabIndex={-1} />
            <label>
              Name
              <input type="text" name="name" required minLength={2} data-cursor-hit />
            </label>
            <label>
              Email
              <input type="email" name="email" required data-cursor-hit />
            </label>
            <label>
              Subject
              <input type="text" name="subject" required minLength={2} data-cursor-hit />
            </label>
            <label>
              Message
              <textarea name="message" rows={5} required minLength={10} data-cursor-hit />
            </label>
            <MagneticButton variant="glow" disabled={status === "loading"}>
              <button className="glow-button" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </MagneticButton>
          </form>
          {message ? (
            <p className={status === "error" ? "form-error" : "form-success"} role="status" aria-live="polite">
              {message}
            </p>
          ) : null}
          <div className="contact-actions">
            {contactMailHref ? (
              <MagneticButton variant="glow">
                <a className="glow-button" href={contactMailHref} data-cursor-hit>
                  Email Studio
                </a>
              </MagneticButton>
            ) : null}
            <MagneticButton variant="ghost">
              <a className="ghost-button" href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" data-cursor-hit>
                Instagram
              </a>
            </MagneticButton>
          </div>
        </section>
      </StaggerItem>
    </StaggerContainer>
  );
}
