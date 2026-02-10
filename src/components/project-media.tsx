"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface ProjectMediaProps {
  loopSrc?: string;
  posterSrc?: string;
  gradientFallback: string;
  className?: string;
  mediaLabel?: string;
}

export function ProjectMedia({
  loopSrc,
  posterSrc,
  gradientFallback,
  className,
  mediaLabel = "Project media preview"
}: ProjectMediaProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const { shouldAutoplayMedia } = usePerformanceMode();

  useEffect(() => {
    const target = loopSrc && !videoFailed && shouldAutoplayMedia ? videoRef.current : fallbackRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [loopSrc, shouldAutoplayMedia, videoFailed]);

  if (!loopSrc || videoFailed || !shouldAutoplayMedia) {
    return (
      <div
        ref={fallbackRef}
        className={className}
        style={{
          backgroundImage: posterSrc ? `url(${posterSrc}), ${gradientFallback}` : gradientFallback,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      title={mediaLabel}
      aria-label={mediaLabel}
      autoPlay={inView}
      muted
      loop
      playsInline
      preload="metadata"
      poster={posterSrc}
      onError={() => setVideoFailed(true)}
    >
      <source src={loopSrc} type="video/mp4" />
    </video>
  );
}
