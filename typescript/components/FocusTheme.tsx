"use client";
import { useToggle } from "../hooks/useToggle";
import { usePostFeed } from "../hooks/usePostFeed";
import { usePostNavigation } from "../hooks/usePostNavigation";
import PostContent from "./PostContent";
import FeedEnd from "./FeedEnd";

import type { ThemeProps } from "../lib/types";

export default function FocusTheme({ posts }: ThemeProps) {
  const [inverted, invert] = useToggle();
  const [hidden, hide] = useToggle();
  const [large, enlarge] = useToggle();
  const [automatic, toggleAutomatic] = useToggle(true);
  const feed = usePostFeed(posts, automatic);
  const { items, next } = usePostNavigation(feed.posts.length, feed.loadMore);
  return (
    <main
      className={`focus-theme ${inverted ? "inverted" : ""} ${large ? "large" : ""}`}
    >
      <div className="focus-title">
        <h1>Frame</h1>
        <div className="controls">
          <button onClick={invert} aria-pressed={inverted}>
            配色反転
          </button>
          <button onClick={hide} aria-pressed={hidden}>
            文字を隠す
          </button>
          <button onClick={enlarge} aria-pressed={large}>
            画像を拡大
          </button>
          <button onClick={toggleAutomatic} aria-pressed={automatic}>
            自動読込
          </button>
        </div>
      </div>
      {feed.posts.map((post, index) => (
        <section
          className="focus-post"
          key={post.id}
          ref={(element) => {
            items.current[index] = element;
          }}
          aria-label={post.title}
        >
          <div className="focus-content">
            <PostContent post={post} showCaption={false} />
          </div>
          {!hidden && (
            <p className="focus-caption">
              {post.id} / {post.caption || post.title}
            </p>
          )}
          {index < posts.length - 1 && (
            <button className="next-post" onClick={() => next(index)}>
              次の投稿 ↓
            </button>
          )}
        </section>
      ))}
      <FeedEnd feed={feed} />
    </main>
  );
}
