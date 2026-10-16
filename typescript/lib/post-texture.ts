import type { Post } from "./types";

const SIZE = 768;

function wrapText(
  context: CanvasRenderingContext2D,
  text: string | undefined,
  maxWidth: number,
): string[] {
  // Character-based wrapping also handles Japanese text without spaces.
  const lines = [];
  let line = "";
  for (const character of text || "") {
    if (
      character === "\n" ||
      (line && context.measureText(line + character).width > maxWidth)
    ) {
      lines.push(line);
      line = character === "\n" ? "" : character;
    } else line += character;
  }
  if (line) lines.push(line);
  return lines;
}

export async function createPostTextureSource(
  post: Post,
  signal: AbortSignal,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas unavailable");
  context.fillStyle = "#ecece7";
  context.fillRect(0, 0, SIZE, SIZE);
  if (post.type === "photo") {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      const abort = () => {
        image.src = "";
        reject(new DOMException("Aborted", "AbortError"));
      };
      signal.addEventListener("abort", abort, { once: true });
      const finish = (callback: () => void) => {
        signal.removeEventListener("abort", abort);
        image.onload = image.onerror = null;
        callback();
      };
      image.crossOrigin = "anonymous";
      image.onload = () => finish(() => resolve(image));
      image.onerror = () =>
        finish(() => reject(new Error(`Image unavailable: ${post.id}`)));
      if (signal.aborted) return abort();
      image.src = post.image;
    });
    const scale = Math.min(
      SIZE / image.naturalWidth,
      SIZE / image.naturalHeight,
    );
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(
      image,
      (SIZE - width) / 2,
      (SIZE - height) / 2,
      width,
      height,
    );
    return canvas;
  }
  const quote = post.type === "quote";
  context.fillStyle = "#17201d";
  context.font = quote ? "italic 46px Georgia, serif" : "500 42px sans-serif";
  const text = quote ? `“${post.text}”` : post.title;
  const lines = wrapText(context, text, SIZE - 120).slice(0, 8);
  const lineHeight = 58;
  const top = (SIZE - lines.length * lineHeight) / 2;
  lines.forEach((line, index) =>
    context.fillText(line, 60, top + index * lineHeight),
  );
  context.font = "22px sans-serif";
  const detail =
    post.type === "quote"
      ? post.source
      : "text" in post
        ? post.text
        : post.title;
  wrapText(context, detail, SIZE - 120)
    .slice(0, 4)
    .forEach((line, index) => {
      context.fillText(
        line,
        60,
        top + lines.length * lineHeight + 35 + index * 34,
      );
    });
  return canvas;
}
