"use client";
import { useBackgroundVideo } from "../hooks/useBackgroundVideo";
import { usePostFeed } from "../hooks/usePostFeed";
import PostContent from "./PostContent";
import FeedEnd from "./FeedEnd";

import type { ThemeProps } from "../lib/types";

export default function VideoTheme({
  posts,
  source = "https://www.youtube.com/watch?v=9bZkp7q19f0",
}: ThemeProps & { source?: string }) {
  const video = useBackgroundVideo(source);
  const feed = usePostFeed(posts);
  return (
    <main className="video-theme">
      <div className="video-background" aria-hidden="true">
        {video.embed && (
          <iframe
            src={video.embed}
            title="Background video"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        )}
      </div>
      <div className="video-shade" />
      <div className="video-layout">
        <aside>
          <p>04 / MOVING IMAGE</p>
          <h1>Motion.</h1>
          <p>
            Words and pictures.
            <br />
            Life in the background.
          </p>
          <button
            onClick={video.toggle}
            disabled={!video.available}
            aria-pressed={video.playing}
          >
            {video.playing ? "背景動画を停止" : "背景動画を再生"}
          </button>
          <small>
            再生すると動画配信元に接続します。
            <br />
            再生できない場合は停止すると背景画像に戻ります。
          </small>
        </aside>
        <div>
          <div className="video-posts">
            {feed.posts.map((post) => (
              <article key={post.id}>
                <span className="post-number">
                  {post.id} / {post.type}
                </span>
                <PostContent post={post} />
                <p className="post-tags">
                  {post.tags?.map((tag) => `#${tag}`).join(" ")}
                </p>
              </article>
            ))}
          </div>
          <FeedEnd feed={feed} />
        </div>
      </div>
    </main>
  );
}
