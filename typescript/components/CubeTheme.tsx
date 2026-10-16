"use client";
import { useToggle } from "../hooks/useToggle";

import type { ThemeProps } from "../lib/types";

export default function CubeTheme({ posts }: ThemeProps) {
  const [paused, toggle] = useToggle();
  return (
    <main className="cube-theme">
      <div className="theme-intro">
        <p>01 / CSS IN THREE DIMENSIONS</p>
        <h1>Cube.</h1>
        <button onClick={toggle} aria-pressed={paused}>
          {paused ? "回転を再開" : "回転を停止"}
        </button>
      </div>
      <div className={`cube-grid ${paused ? "paused" : ""}`}>
        {posts
          .filter((post) => post.type === "photo")
          .map((post) => (
            <figure key={post.id}>
              <div className="cube-stage" role="img" aria-label={post.alt}>
                <div className="cube">
                  {Array.from({ length: 6 }, (_, face) => (
                    <div
                      className="cube-face"
                      key={face}
                      style={{ backgroundImage: `url("${post.image}")` }}
                    />
                  ))}
                </div>
              </div>
              <figcaption>
                {post.id} / {post.title}
              </figcaption>
            </figure>
          ))}
      </div>
    </main>
  );
}
