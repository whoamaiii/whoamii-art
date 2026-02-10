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
  const [videoVisible, setVideoVisible] = useState(false);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const resizeLogCountRef = useRef(0);
  const resizeEventCountRef = useRef(0);
  const modeStateSampleRef = useRef({ startMs: 0, effectCount: 0, emitted: false });
  const h1LogCountRef = useRef(0);
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
    const sample = modeStateSampleRef.current;
    if (!sample.startMs) {
      sample.startMs = Date.now();
    }
    sample.effectCount += 1;

    if (!sample.emitted && Date.now() - sample.startMs >= 2500) {
      sample.emitted = true;
      // #region agent log H13 media effect churn sample
      fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: "initial",
          hypothesisId: "H13",
          location: "src/components/project-card-media.tsx:85",
          message: "ProjectCardMedia mode effect churn",
          data: {
            sampleWindowMs: Date.now() - sample.startMs,
            modeEffectCount: sample.effectCount,
            hasLiveVideo,
            inView
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    }

    if (h1LogCountRef.current < 3) {
      h1LogCountRef.current += 1;
      // #region agent log H1 media mode state
      fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: "initial",
          hypothesisId: "H1",
          location: "src/components/project-card-media.tsx:82",
          message: "ProjectCardMedia mode state",
          data: {
            hasLoopSrc: Boolean(loopSrc),
            shouldAutoplayMedia,
            hasLiveVideo,
            videoFailed,
            videoVisible,
            inView,
            active,
            immersive,
            isVideoPlaying,
            compositorActive,
            sampleIndex: h1LogCountRef.current
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
    }
  }, [
    loopSrc,
    shouldAutoplayMedia,
    hasLiveVideo,
    videoFailed,
    videoVisible,
    inView,
    active,
    immersive,
    isVideoPlaying,
    compositorActive
  ]);

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
    setVideoVisible(false);
  }, [loopSrc, hasLiveVideo]);

  useEffect(() => {
    if (!videoElement) {
      setVideoVisible(false);
      return;
    }

    const reveal = () => setVideoVisible(true);
    const hide = () => setVideoVisible(false);

    videoElement.addEventListener("playing", reveal);
    videoElement.addEventListener("canplay", reveal);
    videoElement.addEventListener("waiting", hide);
    videoElement.addEventListener("emptied", hide);
    videoElement.addEventListener("error", hide);

    return () => {
      videoElement.removeEventListener("playing", reveal);
      videoElement.removeEventListener("canplay", reveal);
      videoElement.removeEventListener("waiting", hide);
      videoElement.removeEventListener("emptied", hide);
      videoElement.removeEventListener("error", hide);
    };
  }, [videoElement]);

  useEffect(() => {
    if (!hasLiveVideo) {
      sizeRef.current = { width: 0, height: 0 };
      return;
    }

    const canvas = canvasRef.current;
    const measurementTarget = videoElement;
    if (!canvas || !measurementTarget) {
      return;
    }

    const applySize = (width: number, height: number) => {
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

    const syncSize = () => {
      const rect = measurementTarget.getBoundingClientRect();
      resizeEventCountRef.current += 1;

      if (resizeLogCountRef.current < 3) {
        resizeLogCountRef.current += 1;
        // #region agent log H2 size sync callback
        fetch("http://127.0.0.1:7242/ingest/ff9c1328-0a4a-45f8-8ea5-81952b6584c2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            runId: "initial",
            hypothesisId: "H2",
            location: "src/components/project-card-media.tsx:150",
            message: "Media size sync callback",
            data: {
              width: rect.width,
              height: rect.height,
              callbackCount: resizeLogCountRef.current
            },
            timestamp: Date.now()
          })
        }).catch(() => {});
        // #endregion
      }

      applySize(rect.width, rect.height);
    };

    const onWindowResize = () => syncSize();
    const onViewportResize = () => syncSize();
    window.addEventListener("resize", onWindowResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onViewportResize, { passive: true });
    syncSize();
    const raf = window.requestAnimationFrame(syncSize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
      window.cancelAnimationFrame(raf);
    };
  }, [hasLiveVideo, videoElement]);

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
      <div
        className={`${className ?? ""} project-card-hero-fallback-layer`}
        style={{
          backgroundImage: posterSrc ? `url(${posterSrc}), ${gradientFallback}` : gradientFallback,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
        aria-hidden
      />
      <video
        ref={setVideoElement}
        className={`${className ?? ""} project-card-hero-video ${videoVisible ? "project-card-hero-video-visible" : ""}`}
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
