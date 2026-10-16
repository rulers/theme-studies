"use client";
import { useEffect, useRef } from "react";

export function usePostNavigation(visibleCount, loadMore) {
  const items = useRef([]);
  const pending = useRef(null);
  const scrollTo = (index) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    items.current[index]?.scrollIntoView({
      behavior: reduce ? "instant" : "smooth",
      block: "start",
    });
  };
  useEffect(() => {
    if (pending.current !== null && items.current[pending.current]) {
      scrollTo(pending.current);
      pending.current = null;
    }
  }, [visibleCount]);
  const next = (index) => {
    if (items.current[index + 1]) scrollTo(index + 1);
    else {
      pending.current = index + 1;
      loadMore();
    }
  };
  return { items, next };
}
