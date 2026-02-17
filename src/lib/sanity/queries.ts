import { groq } from "next-sanity";
import { sanityClient, hasSanityConfig } from "@/lib/sanity/client";
import type {
  ProjectCardData,
  ProjectDetailData,
  ProjectCategoryData,
  SiteSettingsData
} from "@/types/cms";

const QUERY_REVALIDATE_SECONDS = 300;

const siteSettingsFallback: SiteSettingsData = {
  siteTitle: "WHOAMIII",
  siteDescription: "Structured maximalist portfolio for commissions, artwork, and process storytelling.",
  manifestoKicker: "Structured Maximalist Motion",
  manifestoTitle: "Composed intensity for cinematic visual worlds.",
  manifestoBody:
    "I build process-led artwork that transforms sketches, scans, and references into cohesive motion pieces with story, rhythm, and craft.",
  manifestoSubline: "Commission-ready visuals with case-study depth.",
  aboutHeading: "WHOAMIII",
  aboutBody:
    "Artist and motion designer focused on visual systems that balance maximal expression with disciplined composition.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  instagramUrl: "https://www.instagram.com/quentin_qmann/"
};

const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  manifestoKicker,
  manifestoTitle,
  manifestoBody,
  manifestoSubline,
  aboutHeading,
  aboutBody,
  contactEmail,
  instagramUrl
}`;

const PROJECT_CARD_FIELDS = groq`
  _id,
  title,
  "slug": slug.current,
  status,
  featured,
  year,
  duration,
  "summary": coalesce(summary, ""),
  "medium": coalesce(medium, []),
  "tools": coalesce(tools, []),
  coverVideo,
  "categories": coalesce(categories[]->title, []),
  "coverImage": {
    ...coverImage,
    "alt": coalesce(coverImage.alt, title)
  }
`;

const PROJECTS_QUERY = groq`*[_type == "project" && status == "published"] | order(year desc, _updatedAt desc) {${PROJECT_CARD_FIELDS}}`;

const FEATURED_PROJECTS_QUERY = groq`*[_type == "project" && status == "published" && featured == true] | order(year desc, _updatedAt desc) {${PROJECT_CARD_FIELDS}}`;

const PROJECT_BY_SLUG_QUERY = groq`*[_type == "project" && status == "published" && slug.current == $slug][0]{
  ${PROJECT_CARD_FIELDS},
  challenge,
  solution,
  outcome,
  "credits": coalesce(credits[]{
    _key,
    name,
    role,
    link
  }, []),
  "processBlocks": coalesce(processBlocks[]{
    ...,
    _type == "imageBlock" => {
      ...,
      "alt": coalesce(alt, caption),
      "image": {
        ...image,
        "alt": coalesce(image.alt, alt, caption)
      },
      "beforeImage": {
        ...beforeImage,
        "alt": coalesce(beforeImage.alt, alt, caption)
      },
      "afterImage": {
        ...afterImage,
        "alt": coalesce(afterImage.alt, alt, caption)
      }
    },
    _type == "videoBlock" => {
      ...,
      "posterImage": {
        ...posterImage,
        "alt": coalesce(posterImage.alt, caption)
      }
    },
    _type == "galleryBlock" => {
      ...,
      images[]{
        ...,
        "alt": coalesce(alt, ^.caption)
      }
    }
  }, []),
  seoTitle,
  seoDescription,
  "ogImage": {
    ...ogImage,
    "alt": coalesce(ogImage.alt, title)
  }
}`;

const PROJECT_SLUGS_QUERY = groq`*[_type == "project" && status == "published" && defined(slug.current)][]{"slug": slug.current}`;

const PROJECT_CATEGORIES_QUERY = groq`*[_type == "projectCategory"] | order(title asc){
  title,
  slug,
  description
}`;

async function fetchWithFallback<T>(
  query: string,
  fallback: T,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T> {
  if (!hasSanityConfig) {
    return fallback;
  }

  try {
    const data = await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate: QUERY_REVALIDATE_SECONDS,
        tags
      }
    });

    if (data === null || data === undefined) {
      return fallback;
    }

    return data;
  } catch (error) {
    console.error("Sanity query failed", error);
    return fallback;
  }
}

export async function getSiteSettings() {
  return fetchWithFallback<SiteSettingsData>(
    SITE_SETTINGS_QUERY,
    siteSettingsFallback,
    {},
    ["site-settings"]
  );
}

export async function getProjectCards() {
  return fetchWithFallback<ProjectCardData[]>(PROJECTS_QUERY, [], {}, ["projects"]);
}

export async function getFeaturedProjectCards() {
  return fetchWithFallback<ProjectCardData[]>(FEATURED_PROJECTS_QUERY, [], {}, ["projects", "featured"]);
}

export async function getProjectBySlug(slug: string) {
  return fetchWithFallback<ProjectDetailData | null>(
    PROJECT_BY_SLUG_QUERY,
    null,
    { slug },
    ["projects", `project:${slug}`]
  );
}

export async function getProjectSlugs() {
  const rows = await fetchWithFallback<Array<{ slug: string }>>(PROJECT_SLUGS_QUERY, [], {}, ["projects"]);
  return rows.map((row) => row.slug).filter(Boolean);
}

export async function getProjectCategories() {
  return fetchWithFallback<ProjectCategoryData[]>(PROJECT_CATEGORIES_QUERY, [], {}, ["projects", "categories"]);
}
