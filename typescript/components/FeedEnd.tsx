import type { usePostFeed } from "../hooks/usePostFeed";

export default function FeedEnd({
  feed,
}: {
  feed: ReturnType<typeof usePostFeed>;
}) {
  const { sentinel: sentinelRef, hasMore, loadMore, posts } = feed;
  return (
    <div className="feed-end" ref={sentinelRef}>
      {hasMore ? (
        <button onClick={loadMore}>もっと見る</button>
      ) : (
        <p role="status">End of sample archive / {posts.length} posts</p>
      )}
    </div>
  );
}
