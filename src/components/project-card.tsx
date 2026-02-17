import Link from "next/link";
import { optimizeCloudinaryImage } from "@/lib/cloudinary";
import { urlForImage } from "@/lib/sanity/image";
import type { ProjectCardData } from "@/types/cms";
import { ProjectPreviewMedia } from "@/components/project-preview-media";

interface ProjectCardProps {
  project: ProjectCardData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const sanityPoster = urlForImage(project.coverImage)
    ?.width(1200)
    .height(1500)
    .fit("crop")
    .auto("format")
    .url();

  const posterUrl =
    sanityPoster ||
    (project.coverVideo
      ? optimizeCloudinaryImage(project.coverVideo, {
          width: 1200,
          height: 1500,
          format: "webp",
          quality: "auto"
        })
      : undefined);

  return (
    <article className="project-card">
      <Link href={`/work/${project.slug}`} className="project-card-link">
        <ProjectPreviewMedia
          posterUrl={posterUrl}
          videoUrl={project.coverVideo}
          title={project.title}
          aspect="portrait"
        />

        <div className="project-card-body">
          <p className="mono-meta">
            {project.year}
            {project.duration ? ` · ${project.duration}` : ""}
          </p>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>

          <ul className="chip-row" aria-label={`${project.title} categories`}>
            {project.categories.slice(0, 2).map((category) => (
              <li key={category}>{category}</li>
            ))}
            {project.tools.slice(0, 2).map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
