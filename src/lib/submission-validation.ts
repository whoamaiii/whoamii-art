export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface CommissionPayload {
  name: string;
  email: string;
  budget: string;
  timeline: string;
  references?: string;
  idea: string;
  website?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactPayload(input: unknown): {
  valid: boolean;
  errors: string[];
  data: ContactPayload;
} {
  const body = (input ?? {}) as Record<string, unknown>;
  const data: ContactPayload = {
    name: clean(body.name),
    email: clean(body.email),
    subject: clean(body.subject),
    message: clean(body.message),
    website: clean(body.website)
  };

  const errors: string[] = [];
  if (!data.name || data.name.length < 2) errors.push("Name is required.");
  if (!emailRegex.test(data.email)) errors.push("Valid email is required.");
  if (!data.subject || data.subject.length < 2) errors.push("Subject is required.");
  if (!data.message || data.message.length < 10) errors.push("Message is too short.");
  if (data.website) errors.push("Spam detected.");

  return { valid: errors.length === 0, errors, data };
}

export function validateCommissionPayload(input: unknown): {
  valid: boolean;
  errors: string[];
  data: CommissionPayload;
} {
  const body = (input ?? {}) as Record<string, unknown>;
  const data: CommissionPayload = {
    name: clean(body.name),
    email: clean(body.email),
    budget: clean(body.budget),
    timeline: clean(body.timeline),
    references: clean(body.references),
    idea: clean(body.idea),
    website: clean(body.website)
  };

  const errors: string[] = [];
  if (!data.name || data.name.length < 2) errors.push("Name is required.");
  if (!emailRegex.test(data.email)) errors.push("Valid email is required.");
  if (!data.budget) errors.push("Budget range is required.");
  if (!data.timeline) errors.push("Timeline is required.");
  if (!data.idea || data.idea.length < 20) errors.push("Project idea must be more detailed.");
  if (data.website) errors.push("Spam detected.");

  return { valid: errors.length === 0, errors, data };
}
