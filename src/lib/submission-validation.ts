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
const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  subject: 160,
  message: 4000,
  website: 200
} as const;
const COMMISSION_LIMITS = {
  name: 120,
  email: 254,
  budget: 100,
  timeline: 100,
  references: 500,
  idea: 6000,
  website: 200
} as const;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pushMaxLengthError(errors: string[], fieldName: string, value: string, max: number) {
  if (value.length > max) {
    errors.push(`${fieldName} is too long (max ${max} characters).`);
  }
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
  pushMaxLengthError(errors, "Name", data.name, CONTACT_LIMITS.name);
  pushMaxLengthError(errors, "Email", data.email, CONTACT_LIMITS.email);
  pushMaxLengthError(errors, "Subject", data.subject, CONTACT_LIMITS.subject);
  pushMaxLengthError(errors, "Message", data.message, CONTACT_LIMITS.message);
  pushMaxLengthError(errors, "Website", data.website ?? "", CONTACT_LIMITS.website);
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
  pushMaxLengthError(errors, "Name", data.name, COMMISSION_LIMITS.name);
  pushMaxLengthError(errors, "Email", data.email, COMMISSION_LIMITS.email);
  pushMaxLengthError(errors, "Budget", data.budget, COMMISSION_LIMITS.budget);
  pushMaxLengthError(errors, "Timeline", data.timeline, COMMISSION_LIMITS.timeline);
  pushMaxLengthError(errors, "References", data.references ?? "", COMMISSION_LIMITS.references);
  pushMaxLengthError(errors, "Brief description", data.idea, COMMISSION_LIMITS.idea);
  pushMaxLengthError(errors, "Website", data.website ?? "", COMMISSION_LIMITS.website);
  if (data.website) errors.push("Spam detected.");

  return { valid: errors.length === 0, errors, data };
}
