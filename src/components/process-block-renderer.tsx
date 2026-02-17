import { PortableText } from "@portabletext/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { optimizeCloudinaryVideo } from "@/lib/cloudinary";
import { urlForImage } from "@/lib/sanity/image";
import type { ProcessBlock, SanityImage } from "@/types/cms";

interface ProcessBlockRendererProps {
  blocks: ProcessBlock[];
}

const richTextComponents = {
  block: {
    normal: ({ children }: { children?: ReactNode }) => <p>{children}</p>,
    h3: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="process-quote">{children}</blockquote>
    )
  }
};

function renderSanityImage(image: SanityImage | undefined, altFallback: string) {
  const imageUrl = urlForImage(image)?.width(1800).height(1200).fit("max").auto("format").url();

  if (!imageUrl) {
    return null;
  }

  return (
    <Image
      src={imageUrl}
      alt={image?.alt || altFallback}
      width={1800}
      height={1200}
      sizes="(max-width: 900px) 100vw, 82vw"
      className="process-image"
    />
  );
}

export function ProcessBlockRenderer({ blocks }: ProcessBlockRendererProps) {
  if (!blocks.length) {
    return null;
  }

  return (
    <section className="process-stack" aria-label="Creative process">
      <h2>Process</h2>
      <div className="process-stack-inner">
        {blocks.map((block) => {
          switch (block._type) {
            case "richTextBlock": {
              return (
                <article key={block._key} className="process-block">
                  {block.heading ? <h3>{block.heading}</h3> : null}
                  <PortableText value={block.content} components={richTextComponents} />
                </article>
              );
            }
            case "imageBlock": {
              return (
                <article key={block._key} className="process-block">
                  {renderSanityImage(block.image, block.alt || block.caption || "Process image")}
                  {block.beforeImage || block.afterImage ? (
                    <div className="before-after-grid">
                      <figure>
                        {renderSanityImage(block.beforeImage, "Before image")}
                        <figcaption>Before</figcaption>
                      </figure>
                      <figure>
                        {renderSanityImage(block.afterImage, "After image")}
                        <figcaption>After</figcaption>
                      </figure>
                    </div>
                  ) : null}
                  {block.caption ? <p className="mono-meta">{block.caption}</p> : null}
                </article>
              );
            }
            case "videoBlock": {
              return (
                <article key={block._key} className="process-block">
                  <video
                    className="process-video"
                    controls
                    playsInline
                    preload="metadata"
                    poster={
                      urlForImage(block.posterImage)
                        ?.width(1800)
                        .height(1013)
                        .fit("crop")
                        .auto("format")
                        .url() || undefined
                    }
                  >
                    <source src={optimizeCloudinaryVideo(block.cloudinaryUrl)} type="video/mp4" />
                  </video>
                  {block.caption ? <p className="mono-meta">{block.caption}</p> : null}
                </article>
              );
            }
            case "galleryBlock": {
              return (
                <article key={block._key} className="process-block">
                  <div className="process-gallery">
                    {block.images.map((image, index) => {
                      const imageUrl = urlForImage(image)
                        ?.width(1200)
                        .height(1200)
                        .fit("crop")
                        .auto("format")
                        .url();

                      if (!imageUrl) {
                        return null;
                      }

                      return (
                        <Image
                          key={`${block._key}-${index}`}
                          src={imageUrl}
                          alt={image.alt || `Gallery frame ${index + 1}`}
                          width={1200}
                          height={1200}
                          sizes="(max-width: 900px) 100vw, 40vw"
                          className="process-gallery-image"
                        />
                      );
                    })}
                  </div>
                  {block.caption ? <p className="mono-meta">{block.caption}</p> : null}
                </article>
              );
            }
            case "milestoneBlock": {
              return (
                <article key={block._key} className="process-block milestone-block">
                  <h3>{block.stepTitle}</h3>
                  <p>{block.description}</p>
                  <p className="mono-meta">
                    {block.timestamp ? `${block.timestamp} · ` : ""}
                    {block.tools?.join(" · ") || ""}
                  </p>
                </article>
              );
            }
            case "quoteBlock": {
              return (
                <article key={block._key} className="process-block quote-block">
                  <blockquote>{block.quote}</blockquote>
                  {block.attribution ? <cite>{block.attribution}</cite> : null}
                </article>
              );
            }
            default:
              return null;
          }
        })}
      </div>
    </section>
  );
}
