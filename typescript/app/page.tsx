import Link from "next/link";
import { themes } from "../lib/themes";

export default function Home() {
  return (
    <main className="index">
      <header className="index-heading">
        <span>FORM / MOTION STUDIES</span>
        <span>FIVE INTERACTIVE THEMES</span>
      </header>
      <h1>
        Old web.
        <br />
        <i>New context.</i>
      </h1>
      <p className="intro">
        かたち、奥行き、動き。5つのインタラクティブなテーマ。
        <br />
        構造、動き、スタイルを分けて、もう一度遊ぶ。
      </p>
      <div className="theme-grid">
        {themes.map((theme, index) => (
          <Link
            className={`theme-tile tile-${theme.id}`}
            href={`/themes/${theme.id}`}
            key={theme.id}
          >
            <span className="tile-number">
              0{index + 1} / {theme.kind}
            </span>
            <div className="tile-art" aria-hidden="true">
              {theme.symbol}
            </div>
            <div>
              <h2>
                {theme.name} <span>↗</span>
              </h2>
              <p>{theme.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <footer className="index-footer">
        <span>JavaScript + JSX + CSS · Local sample data</span>
        <a href="https://github.com/okfocus/tumblr">
          Original themes by OKFocus ↗
        </a>
      </footer>
    </main>
  );
}
