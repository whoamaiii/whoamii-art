import { createImageUrlBuilder } from "@sanity/image-url";
import { hasSanityConfig, sanityClient } from "@/lib/sanity/client";
import type { SanityImage } from "@/types/cms";

const builder = createImageUrlBuilder(sanityClient);
type SanityImageUrlBuilder = ReturnType<typeof builder.image>;

export function urlForImage(image?: SanityImage | null): SanityImageUrlBuilder | null {
  if (!hasSanityConfig || !image?.asset?._ref) {
    return null;
  }

  return builder.image(image);
}
