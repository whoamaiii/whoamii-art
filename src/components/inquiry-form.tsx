"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { InquiryPayload, InquiryResponse } from "@/types/cms";

const initialState: InquiryPayload = {
  name: "",
  email: "",
  projectType: "Music Visual",
  budget: "",
  timeline: "",
  message: "",
  website: ""
};

export function InquiryForm() {
  const [formData, setFormData] = useState<InquiryPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const isValidForSubmit = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      formData.email.trim().length > 3 &&
      formData.projectType.trim().length > 0 &&
      formData.budget.trim().length > 0 &&
      formData.timeline.trim().length > 0 &&
      formData.message.trim().length >= 20
    );
  }, [formData]);

  const updateField = (field: keyof InquiryPayload, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    setSuccess(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const payload = (await response.json()) as InquiryResponse;
      if (!response.ok || !payload.ok) {
        setErrors(payload.ok ? ["Request failed. Please try again."] : payload.errors);
        return;
      }

      setSuccess(payload.message);
      setFormData(initialState);
    } catch {
      setErrors(["Network error. Please retry in a minute."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            minLength={2}
            maxLength={120}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            maxLength={254}
            required
          />
        </label>

        <label>
          Project Type
          <select
            name="projectType"
            value={formData.projectType}
            onChange={(event) => updateField("projectType", event.target.value)}
          >
            <option>Music Visual</option>
            <option>Campaign Motion</option>
            <option>Immersive Loop System</option>
            <option>Creative Direction + Build</option>
          </select>
        </label>

        <label>
          Budget
          <input
            type="text"
            name="budget"
            placeholder="e.g. $2k-$5k"
            value={formData.budget}
            onChange={(event) => updateField("budget", event.target.value)}
            maxLength={120}
            required
          />
        </label>

        <label>
          Timeline
          <input
            type="text"
            name="timeline"
            placeholder="e.g. 3 weeks"
            value={formData.timeline}
            onChange={(event) => updateField("timeline", event.target.value)}
            maxLength={120}
            required
          />
        </label>

        <label className="hidden-field" aria-hidden>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website || ""}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </label>
      </div>

      <label>
        Project Brief
        <textarea
          name="message"
          rows={8}
          minLength={20}
          maxLength={6000}
          value={formData.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
        />
      </label>

      {errors.length ? (
        <div className="form-feedback form-error" role="alert" aria-live="polite">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      {success ? (
        <div className="form-feedback form-success" role="status" aria-live="polite">
          <p>{success}</p>
        </div>
      ) : null}

      <button type="submit" className="button-primary" disabled={submitting || !isValidForSubmit}>
        {submitting ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
