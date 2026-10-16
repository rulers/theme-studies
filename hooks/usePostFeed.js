"use client";
import { useEffect, useRef, useState } from "react";

// The demo paginates a finite server-provided array; it does not call Tumblr.
export function usePostFeed(posts, automatic = true, pageSize = 3) {
  const [count, setCount] = useState(pageSize);
  const sentinel = useRef(null);
  const hasMore = count < posts.length;
  const loadMore = () =>
    setCount((value) => Math.min(value + pageSize, posts.length));
  useEffect(() => {
    if (
      !automatic ||
      !hasMore ||
      !sentinel.current ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setCount((value) => Math.min(value + pageSize, posts.length));
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [automatic, hasMore, count, pageSize, posts.length]);
  return { posts: posts.slice(0, count), hasMore, loadMore, sentinel };
}
