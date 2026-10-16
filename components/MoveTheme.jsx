"use client";
import { useDepthScroll } from "../hooks/useDepthScroll.js";
import PostContent from "./PostContent.jsx";
import Link from "next/link";

export default function MoveTheme({ posts }) {
  const { scene, space, active, go } = useDepthScroll(posts.length);
  return (
    <main
      className="move-theme"
      ref={space}
      style={{ height: `${Math.max(1, posts.length) * 100}vh` }}
    >
      <div className="move-viewport">
        <div className="depth-scene" ref={scene}>
          {posts.map((post, index) => (
            <section
              key={post.id}
              className="depth-post"
              inert={active !== index}
              aria-hidden={active !== index}
              style={{
                transform: `translateZ(${-index * 1000}px)`,
                visibility: Math.abs(index - active) > 1 ? "hidden" : "visible",
              }}
            >
              <PostContent post={post} showCaption={false} />
            </section>
          ))}
        </div>
        <div className="move-label">
          <h1>Depth</h1>
          <p>Scroll into the archive</p>
          <p>
            <Link href="/themes/move-v2">Flow / WebGL ↗</Link>
          </p>
        </div>
        <div className="move-hud">
          <button onClick={() => go(active - 1)} disabled={active === 0}>
            ← 戻る
          </button>
          <p aria-live="polite">
            {active + 1} / {posts.length}
            <br />
            {posts[active]?.title}
          </p>
          <button
            onClick={() => go(active + 1)}
            disabled={active >= posts.length - 1}
          >
            進む →
          </button>
        </div>
      </div>
    </main>
  );
}
