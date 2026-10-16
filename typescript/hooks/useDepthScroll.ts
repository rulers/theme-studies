"use client";
import { useEffect, useRef, useState } from "react";

export function useDepthScroll(
  count: number,
  onProgress?: (position: number) => void,
) {
  const scene = useRef<HTMLDivElement>(null);
  const space = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = space.current;
    const content = scene.current;
    if (!root || (!content && !onProgress) || count === 0) return;
    let frame = 0;
    let current = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      const target =
        Math.max(0, Math.min(1, -root.getBoundingClientRect().top / distance)) *
        (count - 1);
      current = reduced.matches ? target : current + (target - current) / 9;
      if (Math.abs(target - current) < 0.001) current = target;
      if (content) content.style.transform = `translateZ(${current * 1000}px)`;
      onProgress?.(current);
      setActive(Math.round(current));
      if (current !== target) frame = requestAnimationFrame(update);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count, onProgress]);
  const go = (index: number) => {
    const root = space.current;
    if (!root || count < 2) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top:
        top +
        (Math.max(0, Math.min(count - 1, index)) / (count - 1)) *
          (root.offsetHeight - window.innerHeight),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return { scene, space, active, go };
}
