import type { usePostFeed } from "../hooks/usePostFeed";

export default function FeedEnd({
  feed,
}: {
  feed: ReturnType<typeof usePostFeed>;
}) {
  return (
    <div className="feed-end" ref={feed.sentinel}>
      {feed.hasMore ? (
        <button onClick={feed.loadMore}>もっと見る</button>
      ) : (
        <p role="status">End of sample archive / {feed.posts.length} posts</p>
      )}
    </div>
  );
}
