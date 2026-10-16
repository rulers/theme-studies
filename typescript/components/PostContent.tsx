import type { Post } from "../lib/types";

export default function PostContent({
  post,
  showCaption = true,
}: {
  post: Post;
  showCaption?: boolean;
}) {
  return (
    <>
      {post.type === "photo" && <img src={post.image} alt={post.alt} />}
      {post.type === "quote" && (
        <blockquote>
          <p>“{post.text}”</p>
          <cite>{post.source}</cite>
        </blockquote>
      )}
      {post.type === "text" && (
        <div className="text-post">
          <h2>{post.title}</h2>
          <p>{post.text}</p>
        </div>
      )}
      {post.type === "link" && (
        <div className="text-post">
          <a href={post.url}>{post.title} ↗</a>
          <p>{post.text}</p>
        </div>
      )}
      {post.type === "video" && (
        <video
          src={post.url}
          controls
          playsInline
          preload="metadata"
          aria-label={post.title}
        />
      )}
      {post.type === "audio" && (
        <audio
          src={post.url}
          controls
          preload="metadata"
          aria-label={post.title}
        />
      )}
      {showCaption && post.caption && <p className="caption">{post.caption}</p>}
    </>
  );
}
