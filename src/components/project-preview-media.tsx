"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { optimizeCloudinaryVideo } from "@/lib/cloudinary";

interface ProjectPreviewMediaProps {
  posterUrl?: string;
  videoUrl?: string;
  title: string;
  aspect?: "portrait" | "landscape";
}

export function ProjectPreviewMedia({
  posterUrl,
  videoUrl,
  title,
  aspect = "portrait"
}: ProjectPreviewMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const optimizedVideoUrl = useMemo(() => {
    if (!videoUrl) {
      return undefined;
    }
    return optimizeCloudinaryVideo(videoUrl);
  }, [videoUrl]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover)");

    const syncMediaPreferences = () => {
      setPrefersReducedMotion(motionQuery.matches);
      setCanHover(hoverQuery.matches);
    };

    syncMediaPreferences();

    motionQuery.addEventListener("change", syncMediaPreferences);
    hoverQuery.addEventListener("change", syncMediaPreferences);

    return () => {
      motionQuery.removeEventListener("change", syncMediaPreferences);
      hoverQuery.removeEventListener("change", syncMediaPreferences);
    };
  }, []);

  const shouldEnableHoverVideo = Boolean(optimizedVideoUrl) && canHover && !prefersReducedMotion;

  const handleActivate = () => {
    if (!shouldEnableHoverVideo) {
      return;
    }

    setShowVideo(true);
    videoRef.current
      ?.play()
      .then(() => undefined)
      .catch(() => undefined);
  };

  const handleDeactivate = () => {
    if (!shouldEnableHoverVideo) {
      return;
    }

    setShowVideo(false);
    if (!videoRef.current) {
      return;
    }

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div
      className={aspect === "portrait" ? "preview-frame preview-frame-portrait" : "preview-frame preview-frame-landscape"}
      onPointerEnter={handleActivate}
      onPointerLeave={handleDeactivate}
      onFocusCapture={handleActivate}
      onBlurCapture={handleDeactivate}
    >
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={`${title} poster`}
          fill
          sizes={aspect === "portrait" ? "(max-width: 800px) 100vw, 33vw" : "(max-width: 800px) 100vw, 70vw"}
          className={showVideo ? "preview-image preview-image-dimmed" : "preview-image"}
        />
      ) : (
        <div className="preview-fallback" aria-hidden />
      )}

      {shouldEnableHoverVideo && optimizedVideoUrl ? (
        <video
          ref={videoRef}
          className={showVideo ? "preview-video is-visible" : "preview-video"}
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl}
        >
          <source src={optimizedVideoUrl} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
