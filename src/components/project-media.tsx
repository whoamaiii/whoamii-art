"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { useVideoVisibilityPlayback } from "@/hooks/use-video-visibility-playback";

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
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const { shouldAutoplayMedia } = usePerformanceMode();
  const hasLiveVideo = Boolean(loopSrc) && !videoFailed && shouldAutoplayMedia;

  useVideoVisibilityPlayback({
    videoElement,
    shouldPlay: hasLiveVideo && inView
  });

  useEffect(() => {
    const target = hasLiveVideo ? videoElement : fallbackRef.current;
    if (!target) return;

    const intersectionObserverCtor = (
      window as Window & { IntersectionObserver?: typeof IntersectionObserver }
    ).IntersectionObserver;

    if (!intersectionObserverCtor) {
      setInView(true);
      return;
    }

    const observer = new intersectionObserverCtor(
      (entries) => {
        const [entry] = entries;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasLiveVideo, videoElement]);

  if (!hasLiveVideo) {
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
      ref={setVideoElement}
      className={className}
      title={mediaLabel}
      aria-label={mediaLabel}
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
