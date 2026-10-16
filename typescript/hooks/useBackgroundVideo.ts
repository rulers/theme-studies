"use client";
import { useState } from "react";
import { getVideoEmbed } from "../lib/video";

export function useBackgroundVideo(source: string) {
  const [playing, setPlaying] = useState(false);
  const embed = getVideoEmbed(source);
  return {
    embed: playing ? embed : null,
    available: Boolean(embed),
    playing,
    toggle: () => setPlaying((value) => !value),
  };
}
