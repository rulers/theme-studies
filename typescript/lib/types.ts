interface BasePost {
  id: string;
  title: string;
  caption?: string;
  tags?: readonly string[];
}

export interface PhotoPost extends BasePost {
  type: "photo";
  image: string;
  alt: string;
}

export interface TextPost extends BasePost {
  type: "text";
  text: string;
}

export interface QuotePost extends BasePost {
  type: "quote";
  text: string;
  source: string;
}

export interface LinkPost extends BasePost {
  type: "link";
  url: string;
  text: string;
}

export interface MediaPost extends BasePost {
  type: "video" | "audio";
  url: string;
}

// A post's type determines which fields are required and available.
export type Post = PhotoPost | TextPost | QuotePost | LinkPost | MediaPost;

export interface ThemeProps {
  posts: readonly Post[];
}

export type RendererStatus = "loading" | "ready" | "reduced" | "fallback";
