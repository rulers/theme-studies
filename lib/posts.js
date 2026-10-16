// Replace this function with a server-side CMS / Tumblr API adapter.
// Text is plain text, never untrusted HTML or embed code.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const posts = [
  {
    id: "01",
    type: "photo",
    title: "Electric blue",
    image: `${basePath}/images/blue.svg`,
    alt: "青い円が重なる抽象図形",
    caption: "Color is a place you can go.",
    tags: ["color", "study"],
  },
  {
    id: "02",
    type: "photo",
    title: "After the sun",
    image: `${basePath}/images/orange.svg`,
    alt: "オレンジ色のグラデーションと黒い円",
    caption: "A small experiment in warmth.",
    tags: ["light"],
  },
  {
    id: "03",
    type: "quote",
    title: "A note on play",
    text: "Make room for things that do not need to be useful.",
    source: "Demo notebook",
    tags: ["notes"],
  },
  {
    id: "04",
    type: "photo",
    title: "Soft signal",
    image: `${basePath}/images/pink.svg`,
    alt: "ピンクの背景と波状のライン",
    caption: "Somewhere between a signal and a feeling.",
    tags: ["form"],
  },
  {
    id: "05",
    type: "text",
    title: "A different kind of archive",
    text: "スクロール、奥行き、回転。ブログの投稿を空間として見直す、小さな実験。",
    tags: ["web"],
  },
  {
    id: "06",
    type: "link",
    title: "Visit the source",
    url: "https://github.com/okfocus/tumblr",
    text: "Explore the original Tumblr templates by OKFocus.",
    tags: ["source"],
  },
  {
    id: "07",
    type: "photo",
    title: "Blue, again",
    image: `${basePath}/images/blue.svg`,
    alt: "青い円が重なる抽象図形",
    caption: "Back to the beginning.",
    tags: ["loop"],
  },
  {
    id: "08",
    type: "photo",
    title: "Last light",
    image: `${basePath}/images/orange.svg`,
    alt: "オレンジ色のグラデーションと黒い円",
    caption: "The end of this sample archive.",
    tags: ["archive"],
  },
];

export function getPosts() {
  return posts;
}
