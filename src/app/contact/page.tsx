"use client";

import { FormEvent, useState } from "react";
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

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
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
    <main className="top-spaced page-shell">
      <section className="panel">
        <h1>Contact</h1>
        <p>Commissions, collaborations, festivals, and licensing inquiries.</p>
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
            Subject
            <input type="text" name="subject" required minLength={2} />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} required minLength={10} />
          </label>
          <button className="glow-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
        {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
        <div className="contact-actions">
          {contactMailHref ? (
            <a className="glow-button" href={contactMailHref}>
              Email Studio
            </a>
          ) : null}
          <a className="ghost-button" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
