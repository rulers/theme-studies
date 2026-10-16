export function getVideoEmbed(source) {
  try {
    const url = new URL(source);
    if (url.protocol !== "https:") return null;
    let id;
    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
    ) {
      id = url.pathname.startsWith("/embed/")
        ? url.pathname.split("/")[2]
        : url.searchParams.get("v");
    } else if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    if (id && /^[\w-]{11}$/.test(id))
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1`;
    if (
      ["vimeo.com", "www.vimeo.com"].includes(url.hostname) &&
      /^\/\d+$/.test(url.pathname)
    )
      return `https://player.vimeo.com/video${url.pathname}?background=1&autoplay=1&muted=1&loop=1`;
  } catch {
    /* Invalid input stays on the poster. */
  }
  return null;
}
