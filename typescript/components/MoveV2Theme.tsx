"use client";
import { useState } from "react";
import Link from "next/link";
import { useDepthScroll } from "../hooks/useDepthScroll";
import { useWebGLTransition } from "../hooks/useWebGLTransition";
import { moveTransitions } from "../lib/move-transitions";
import PostContent from "./PostContent";
import "./move-v2.css";

import type { ThemeProps } from "../lib/types";

export default function MoveV2Theme({ posts }: ThemeProps) {
  const [selected, setSelected] = useState(0);
  const [strength, setStrength] = useState(0.65);
  const gl = useWebGLTransition(posts, selected, strength);
  const { space, active, go } = useDepthScroll(posts.length, gl.draw);
  const current = posts[active];
  const effect =
    moveTransitions.find((item) => item.number === selected) ??
    moveTransitions[0];
  const ready = gl.status === "ready";

  return (
    <main
      className="move-theme move-v2"
      ref={space}
      style={{ height: `${Math.max(1, posts.length) * 100}vh` }}
    >
      <div className="move-viewport">
        <div className="v2-heading">
          <div>
            <p className="v2-eyebrow">SCROLL / SHADER STUDIES</p>
            <h1>
              Flow<span>GL</span>
            </h1>
          </div>
          <div className="v2-meta">
            <span
              className={`v2-status ${ready ? "is-ready" : ""}`}
              role="status"
            >
              {ready
                ? "WEBGL ACTIVE"
                : gl.status === "loading"
                  ? "LOADING TEXTURES"
                  : gl.status === "reduced"
                    ? "REDUCED MOTION"
                    : "HTML FALLBACK"}
            </span>
            <Link href="/themes/move">Depth ↗</Link>
          </div>
        </div>
        <div className="v2-stage" data-renderer={gl.status}>
          <canvas
            ref={gl.canvas}
            aria-hidden="true"
            className={ready ? "is-ready" : ""}
          />
          {!ready && current && (
            <div className="v2-fallback">
              <PostContent post={current} showCaption={false} />
            </div>
          )}
          <div className="v2-stage-corner corner-tl" aria-hidden="true" />
          <div className="v2-stage-corner corner-br" aria-hidden="true" />
        </div>
        <div className="v2-side-note" aria-hidden="true">
          SCROLL TO TRANSFORM — SCROLL BACK TO REVERSE
        </div>
        <div className="v2-controls">
          <div className="v2-effect-heading">
            <p>
              TRANSITION <span>/ {effect.label}</span>
            </p>
            <label className="v2-strength">
              強度{" "}
              <input
                aria-label="トランジションの強度"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={strength}
                disabled={!ready}
                onChange={(event) => setStrength(Number(event.target.value))}
              />
              <output>{Math.round(strength * 100)}%</output>
            </label>
          </div>
          <div
            className="v2-effects"
            role="group"
            aria-label="WebGLトランジション"
          >
            {moveTransitions.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelected(item.number)}
                aria-pressed={selected === item.number}
              >
                <span>0{index + 1}</span>
                {item.name}
              </button>
            ))}
          </div>
          <div className="v2-navigation">
            <button onClick={() => go(active - 1)} disabled={active === 0}>
              ← 前へ
            </button>
            <p aria-live="polite">
              <span>
                {String(active + 1).padStart(2, "0")}{" "}
                <i>/ {String(posts.length).padStart(2, "0")}</i>
              </span>
              {current?.title}
            </p>
            <button
              onClick={() => go(active + 1)}
              disabled={active >= posts.length - 1}
            >
              次へ →
            </button>
          </div>
          {current?.type === "link" && (
            <a className="v2-post-link" href={current.url}>
              {current.title} ↗
            </a>
          )}
        </div>
        <div className="v2-progress" aria-hidden="true">
          <div ref={gl.progressBar} />
        </div>
        <p className="sr-only">
          {current &&
            (current.type === "photo"
              ? current.alt
              : "text" in current
                ? current.text
                : current.title)}{" "}
          {current?.caption} {current?.type === "quote" && current.source}
        </p>
      </div>
    </main>
  );
}
