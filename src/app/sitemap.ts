import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const BASE_URL = "https://qmann.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/portal",
    "/replications",
    "/films",
    "/experiments",
    "/about",
    "/commissions",
    "/contact"
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" || route === "/portal" ? 1 : 0.7
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [...staticEntries, ...projectEntries];
}
