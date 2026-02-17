import type { InquiryPayload } from "@/types/cms";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 120,
  email: 254,
  projectType: 120,
  budget: 120,
  timeline: 120,
  message: 6000,
  website: 200
} as const;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function pushMaxLengthError(errors: string[], fieldName: string, value: string, max: number) {
  if (value.length > max) {
    errors.push(`${fieldName} is too long (max ${max} characters).`);
  }
}

export function validateInquiryPayload(input: unknown): {
  valid: boolean;
  errors: string[];
  data: InquiryPayload;
} {
  const body = (input ?? {}) as Record<string, unknown>;

  const data: InquiryPayload = {
    name: clean(body.name),
    email: clean(body.email),
    projectType: clean(body.projectType),
    budget: clean(body.budget),
    timeline: clean(body.timeline),
    message: clean(body.message),
    website: clean(body.website)
  };

  const errors: string[] = [];

  if (!data.name || data.name.length < 2) {
    errors.push("Name is required.");
  }
  if (!emailRegex.test(data.email)) {
    errors.push("Valid email is required.");
  }
  if (!data.projectType) {
    errors.push("Project type is required.");
  }
  if (!data.budget) {
    errors.push("Budget is required.");
  }
  if (!data.timeline) {
    errors.push("Timeline is required.");
  }
  if (!data.message || data.message.length < 20) {
    errors.push("Message must be at least 20 characters.");
  }

  pushMaxLengthError(errors, "Name", data.name, LIMITS.name);
  pushMaxLengthError(errors, "Email", data.email, LIMITS.email);
  pushMaxLengthError(errors, "Project type", data.projectType, LIMITS.projectType);
  pushMaxLengthError(errors, "Budget", data.budget, LIMITS.budget);
  pushMaxLengthError(errors, "Timeline", data.timeline, LIMITS.timeline);
  pushMaxLengthError(errors, "Message", data.message, LIMITS.message);
  pushMaxLengthError(errors, "Website", data.website ?? "", LIMITS.website);

  if (data.website) {
    errors.push("Spam detected.");
  }

  return {
    valid: errors.length === 0,
    errors,
    data
  };
}
