"use client";

import { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";

interface ImmersiveAuroraCanvasProps {
  onError?: () => void;
}

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

    vec2 mouseParallax = (uMouse - 0.5) * 0.24;
    vec2 drift = vec2(uTime * 0.045, uTime * 0.028);

    float n1 = fbm(aspectUv * 2.4 + drift + mouseParallax);
    float n2 = fbm(aspectUv * 3.3 - drift * 1.3 - mouseParallax * 0.6);
    float n3 = fbm(aspectUv * 5.1 + vec2(0.0, uTime * 0.05));

    float ribbons = smoothstep(0.2, 0.95, n1 * 0.6 + n2 * 0.35 + n3 * 0.2);
    float glow = smoothstep(0.15, 0.85, n2);

    vec3 color = mix(uColorA, uColorB, n1);
    color = mix(color, uColorC, n2 * 0.85);
    color += (uColorA + uColorC) * 0.12 * glow;

    float vignette = smoothstep(1.25, 0.1, length(aspectUv));
    float alpha = (0.1 + ribbons * 0.34) * vignette;

    gl_FragColor = vec4(color, alpha);
  }
`;

function readPalette() {
  const defaults = {
    a: "#ff2d95",
    b: "#b026ff",
    c: "#00fff0"
  };

  const root = getComputedStyle(document.documentElement);
  return {
    a: root.getPropertyValue("--psych-pink").trim() || defaults.a,
    b: root.getPropertyValue("--psych-violet").trim() || defaults.b,
    c: root.getPropertyValue("--psych-cyan").trim() || defaults.c
  };
}

export function ImmersiveAuroraCanvas({ onError }: ImmersiveAuroraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let frame = 0;
    let renderer: WebGLRenderer | null = null;
    let scene: Scene | null = null;
    let camera: OrthographicCamera | null = null;
    let geometry: PlaneGeometry | null = null;
    let material: ShaderMaterial | null = null;

    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight, false);

      scene = new Scene();
      camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const palette = readPalette();

      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
        uColorA: { value: new Color(palette.a) },
        uColorB: { value: new Color(palette.b) },
        uColorC: { value: new Color(palette.c) }
      };

      geometry = new PlaneGeometry(2, 2);
      material = new ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false
      });

      const quad = new Mesh(geometry, material);
      scene.add(quad);

      const onPointerMove = (event: PointerEvent) => {
        uniforms.uMouse.value.set(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
      };

      let resizeRaf = 0;
      const onResize = () => {
        if (resizeRaf) return;
        resizeRaf = window.requestAnimationFrame(() => {
          resizeRaf = 0;
          renderer?.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
          renderer?.setSize(window.innerWidth, window.innerHeight, false);
          uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        });
      };

      let paused = false;
      const startedAt = performance.now();

      const tick = () => {
        if (!paused) {
          uniforms.uTime.value = (performance.now() - startedAt) / 1000;
          renderer?.render(scene!, camera!);
        }
        frame = window.requestAnimationFrame(tick);
      };

      const onVisibilityChange = () => {
        paused = document.hidden;
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibilityChange);
      tick();

      return () => {
        window.cancelAnimationFrame(frame);
        if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        geometry?.dispose();
        material?.dispose();
        renderer?.dispose();
      };
    } catch {
      onError?.();
      renderer?.dispose();
      scene?.clear();
      geometry?.dispose();
      material?.dispose();
      return;
    }
  }, [onError]);

  return <canvas ref={canvasRef} className="psychedelic-bg-canvas" />;
}
