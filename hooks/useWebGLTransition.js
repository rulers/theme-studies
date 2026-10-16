"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createTransitionRenderer } from "../lib/webgl-transition.js";
import { createPostTextureSource } from "../lib/post-texture.js";

export function useWebGLTransition(posts, mode, strength) {
  const canvas = useRef(null);
  const renderer = useRef(null);
  const position = useRef(0);
  const settings = useRef({ mode, strength });
  const progressBar = useRef(null);
  const [status, setStatus] = useState("loading");
  const [generation, setGeneration] = useState(0);
  const draw = useCallback(
    (value) => {
      position.current = value;
      renderer.current?.draw(
        value,
        settings.current.mode,
        settings.current.strength,
      );
      if (progressBar.current)
        progressBar.current.style.transform = `scaleX(${posts.length < 2 ? 1 : value / (posts.length - 1)})`;
    },
    [posts.length],
  );

  useEffect(() => {
    settings.current = { mode, strength };
    draw(position.current);
  }, [mode, strength, draw]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const controller = new AbortController();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance;
    let loaded = false;
    let lost = false;
    let failed = false;
    let frame;
    const invalidate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => draw(position.current));
    };
    const updateMotion = () => {
      renderer.current = loaded && !lost && !reduced.matches ? instance : null;
      setStatus(
        reduced.matches
          ? "reduced"
          : lost || failed
            ? "fallback"
            : loaded
              ? "ready"
              : "loading",
      );
      invalidate();
    };
    const onLost = (event) => {
      event.preventDefault();
      lost = true;
      renderer.current = null;
      setStatus("fallback");
    };
    const onRestored = () => setGeneration((value) => value + 1);
    element.addEventListener("webglcontextlost", onLost);
    element.addEventListener("webglcontextrestored", onRestored);
    reduced.addEventListener("change", updateMotion);
    const resize = new ResizeObserver(invalidate);
    resize.observe(element);
    setStatus(reduced.matches ? "reduced" : "loading");
    (async () => {
      try {
        instance = createTransitionRenderer(element);
        const sources = await Promise.all(
          posts.map((post) => createPostTextureSource(post, controller.signal)),
        );
        if (controller.signal.aborted || lost) return;
        instance.upload(sources);
        loaded = true;
        updateMotion();
      } catch (error) {
        if (!controller.signal.aborted) {
          failed = true;
          renderer.current = null;
          setStatus(reduced.matches ? "reduced" : "fallback");
          console.warn("Flow: using HTML fallback.", error.message);
        }
      }
    })();
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      resize.disconnect();
      reduced.removeEventListener("change", updateMotion);
      element.removeEventListener("webglcontextlost", onLost);
      element.removeEventListener("webglcontextrestored", onRestored);
      renderer.current = null;
      instance?.dispose();
    };
  }, [posts, generation, draw]);

  return { canvas, progressBar, status, draw };
}
