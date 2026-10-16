import "./globals.css";

export const metadata = {
  title: "Theme Studies",
  description:
    "Tumblr theme studies and WebGL scroll transitions rebuilt for Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
