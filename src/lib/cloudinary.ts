interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png";
  crop?: "fill" | "fit" | "limit";
}

const UPLOAD_MARKER = "/upload/";
const CLOUDINARY_HOST = "res.cloudinary.com";

function isCloudinaryUrl(url: string) {
  try {
    return new URL(url).hostname.includes(CLOUDINARY_HOST);
  } catch {
    return false;
  }
}

function injectTransforms(url: string, transform: string) {
  const markerIndex = url.indexOf(UPLOAD_MARKER);
  if (markerIndex === -1) {
    return url;
  }

  const start = markerIndex + UPLOAD_MARKER.length;
  const suffix = url.slice(start);

  if (/^(?:[a-z]+_[^/]+,?)+\//.test(suffix)) {
    return url;
  }

  return `${url.slice(0, start)}${transform}/${suffix}`;
}

export function optimizeCloudinaryImage(url: string, options: CloudinaryOptions = {}) {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const transforms = [
    options.crop ? `c_${options.crop}` : "c_fill",
    options.width ? `w_${Math.max(1, Math.round(options.width))}` : "w_1600",
    options.height ? `h_${Math.max(1, Math.round(options.height))}` : "h_1200",
    `q_${options.quality ?? "auto"}`,
    `f_${options.format ?? "auto"}`
  ].join(",");

  return injectTransforms(url, transforms);
}

export function optimizeCloudinaryVideo(url: string) {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  return injectTransforms(url, "q_auto,f_auto");
}
