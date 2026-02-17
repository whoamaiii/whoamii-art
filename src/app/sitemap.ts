import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/sanity/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whoamiii.art";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();

  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/work`,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7
    }
  ];

  const projectRoutes = slugs.map((slug) => ({
    url: `${siteUrl}/work/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [...baseRoutes, ...projectRoutes];
}
