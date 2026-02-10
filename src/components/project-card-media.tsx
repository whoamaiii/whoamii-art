"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { useVideoVisibilityPlayback } from "@/hooks/use-video-visibility-playback";

interface ProjectCardMediaProps {
  loopSrc?: string;
  posterSrc?: string;
  gradientFallback: string;
  className?: string;
  mediaLabel?: string;
  active?: boolean;
  immersive?: boolean;
}

function drawCoverFrame(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number,
  offsetX: number,
  filter: string,
  alpha: number
) {
  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;

  if (!sourceWidth || !sourceHeight) return;

  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = width / height;

  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceAspect > targetAspect) {
    sw = sourceHeight * targetAspect;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetAspect;
    sy = (sourceHeight - sh) / 2;
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = filter;
  ctx.drawImage(video, sx, sy, sw, sh, offsetX, 0, width, height);
  ctx.restore();
}

export function ProjectCardMedia({
  loopSrc,
  posterSrc,
  gradientFallback,
  className,
  mediaLabel = "Project media preview",
  active = false,
  immersive = false
}: ProjectCardMediaProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const { shouldAutoplayMedia } = usePerformanceMode();

  const hasLiveVideo = Boolean(loopSrc) && !videoFailed && shouldAutoplayMedia;
  const isVideoPlaying = useVideoVisibilityPlayback({
    videoElement,
    shouldPlay: hasLiveVideo && inView
  });
  const compositorActive = immersive && active && hasLiveVideo && inView && isVideoPlaying;
  const channelOffset = immersive ? 3 : 1.5;
  const redAlpha = immersive ? 0.4 : 0.24;
  const cyanAlpha = immersive ? 0.38 : 0.22;

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

  useEffect(() => {
    if (!hasLiveVideo) {
      sizeRef.current = { width: 0, height: 0 };
      return;
    }

    let raf = 0;
    let observer: ResizeObserver | null = null;
    let fallbackResizeHandler: (() => void) | null = null;

    const applySize = (width: number, height: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const nextWidth = Math.max(1, Math.floor(width));
      const nextHeight = Math.max(1, Math.floor(height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.floor(nextWidth * dpr);
      const pixelHeight = Math.floor(nextHeight * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const ctx = canvas.getContext("2d", { alpha: true });
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      sizeRef.current = { width: nextWidth, height: nextHeight };
    };

    const attach = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        raf = window.requestAnimationFrame(attach);
        return;
      }

      const resizeObserverCtor = (window as Window & { ResizeObserver?: typeof ResizeObserver })
        .ResizeObserver;

      if (resizeObserverCtor) {
        observer = new resizeObserverCtor((entries) => {
          const entry = entries[0];
          if (!entry) return;
          applySize(entry.contentRect.width, entry.contentRect.height);
        });
        observer.observe(canvas);
      } else {
        fallbackResizeHandler = () => {
          const nextRect = canvas.getBoundingClientRect();
          applySize(nextRect.width, nextRect.height);
        };
        window.addEventListener("resize", fallbackResizeHandler, { passive: true });
      }

      const rect = canvas.getBoundingClientRect();
      applySize(rect.width, rect.height);
    };

    attach();

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      observer?.disconnect();
      if (fallbackResizeHandler) {
        window.removeEventListener("resize", fallbackResizeHandler);
      }
    };
  }, [hasLiveVideo]);

  useEffect(() => {
    if (!compositorActive) {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    const video = videoElement;
    if (!canvas || !video) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const drawFrame = () => {
      if (document.hidden) {
        frameRef.current = window.requestAnimationFrame(drawFrame);
        return;
      }

      const { width, height } = sizeRef.current;
      if (!width || !height) {
        frameRef.current = window.requestAnimationFrame(drawFrame);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (!video.paused && video.readyState >= 2) {
        const compact = width < 360;
        const small = width >= 360 && width < 480;
        const offsetScale = compact ? 0.64 : small ? 0.82 : 1;
        const alphaScale = compact ? 0.78 : small ? 0.9 : 1;
        const activeOffset = channelOffset * offsetScale;
        const activeRedAlpha = redAlpha * alphaScale;
        const activeCyanAlpha = cyanAlpha * alphaScale;

        drawCoverFrame(ctx, video, width, height, 0, "none", 1);
        drawCoverFrame(
          ctx,
          video,
          width,
          height,
          activeOffset,
          "saturate(1.9) hue-rotate(-26deg)",
          activeRedAlpha
        );
        drawCoverFrame(
          ctx,
          video,
          width,
          height,
          -activeOffset,
          "saturate(1.8) hue-rotate(168deg)",
          activeCyanAlpha
        );
      }

      frameRef.current = window.requestAnimationFrame(drawFrame);
    };

    frameRef.current = window.requestAnimationFrame(drawFrame);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [compositorActive, cyanAlpha, channelOffset, redAlpha, videoElement]);

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
    <>
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
      <canvas
        ref={canvasRef}
        className={
          compositorActive
            ? "project-card-aberration-canvas project-card-aberration-canvas-active"
            : "project-card-aberration-canvas"
        }
        aria-hidden
      />
    </>
  );
}
