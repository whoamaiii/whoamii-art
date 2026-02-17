import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "jm4wecua";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2025-01-01";

export const hasSanityConfig = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
  stega: {
    studioUrl: "/studio"
  }
});
