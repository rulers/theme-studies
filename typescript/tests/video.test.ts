import test from "node:test";
import assert from "node:assert/strict";
import { getVideoEmbed } from "../lib/video.ts";

test("YouTube watch and short links produce muted looping embeds", () => {
  for (const source of [
    "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "https://youtu.be/9bZkp7q19f0",
  ]) {
    const embed = getVideoEmbed(source);
    assert.ok(embed);
    const url = new URL(embed);
    assert.equal(url.hostname, "www.youtube-nocookie.com");
    assert.equal(url.searchParams.get("playlist"), "9bZkp7q19f0");
    assert.equal(url.searchParams.get("mute"), "1");
  }
});
test("Vimeo IDs produce background embeds", () => {
  assert.equal(
    getVideoEmbed("https://vimeo.com/12345"),
    "https://player.vimeo.com/video/12345?background=1&autoplay=1&muted=1&loop=1",
  );
});
test("invalid, insecure and lookalike hosts stay on poster", () => {
  for (const source of [
    "",
    "javascript:alert(1)",
    "http://youtube.com/watch?v=9bZkp7q19f0",
    "https://youtube.com.evil.example/watch?v=9bZkp7q19f0",
    "https://youtube.com/watch?v=invalid",
    "https://vimeo.com/not-a-number",
  ]) {
    assert.equal(getVideoEmbed(source), null);
  }
});
