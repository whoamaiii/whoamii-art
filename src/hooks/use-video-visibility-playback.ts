"use client";

import { useEffect, useState } from "react";

interface UseVideoVisibilityPlaybackOptions {
  videoElement: HTMLVideoElement | null;
  shouldPlay: boolean;
}

export function useVideoVisibilityPlayback({
  videoElement,
  shouldPlay
}: UseVideoVisibilityPlaybackOptions) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoElement) {
      setIsPlaying(false);
      return;
    }

    const syncPlaybackState = () => {
      setIsPlaying(!videoElement.paused && !videoElement.ended);
    };

    syncPlaybackState();
    videoElement.addEventListener("play", syncPlaybackState);
    videoElement.addEventListener("pause", syncPlaybackState);
    videoElement.addEventListener("ended", syncPlaybackState);

    return () => {
      videoElement.removeEventListener("play", syncPlaybackState);
      videoElement.removeEventListener("pause", syncPlaybackState);
      videoElement.removeEventListener("ended", syncPlaybackState);
    };
  }, [videoElement]);

  useEffect(() => {
    let cancelled = false;
    if (!videoElement) {
      setIsPlaying(false);
      return;
    }

    const pause = () => {
      videoElement.pause();
      if (!cancelled) {
        setIsPlaying(false);
      }
    };

    if (!shouldPlay) {
      pause();
      return;
    }

    const tryPlay = async () => {
      try {
        const playback = videoElement.play();
        if (playback && typeof playback.then === "function") {
          await playback;
        }
        if (!cancelled) {
          setIsPlaying(!videoElement.paused && !videoElement.ended);
        }
      } catch {
        if (!cancelled) {
          setIsPlaying(false);
        }
      }
    };

    const onCanPlay = () => {
      void tryPlay();
    };

    videoElement.addEventListener("loadeddata", onCanPlay);
    videoElement.addEventListener("canplay", onCanPlay);
    void tryPlay();

    return () => {
      cancelled = true;
      videoElement.removeEventListener("loadeddata", onCanPlay);
      videoElement.removeEventListener("canplay", onCanPlay);
      pause();
    };
  }, [shouldPlay, videoElement]);

  return isPlaying;
}
