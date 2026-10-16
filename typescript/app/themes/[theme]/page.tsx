import Link from "next/link";
import { notFound } from "next/navigation";
import { themes } from "../../../lib/themes";
import { getPosts } from "../../../lib/posts";
import CubeTheme from "../../../components/CubeTheme";
import FocusTheme from "../../../components/FocusTheme";
import MoveTheme from "../../../components/MoveTheme";
import MoveV2Theme from "../../../components/MoveV2Theme";
import VideoTheme from "../../../components/VideoTheme";

export function generateStaticParams() {
  return themes.map(({ id }) => ({ theme: id }));
}

const components = {
  cube: CubeTheme,
  focus300: FocusTheme,
  move: MoveTheme,
  "move-v2": MoveV2Theme,
  video: VideoTheme,
};

export default async function ThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const current = themes.find(({ id }) => id === theme);
  if (!current) notFound();
  const Component = components[current.id];
  return (
    <>
      <header className="theme-header">
        <Link href="/">← STUDIES</Link>
        <nav aria-label="テーマ">
          {themes.map(({ id, name }) => (
            <Link
              href={`/themes/${id}`}
              aria-current={id === theme ? "page" : undefined}
              key={id}
            >
              {name}
            </Link>
          ))}
        </nav>
      </header>
      <Component posts={getPosts()} />
    </>
  );
}
