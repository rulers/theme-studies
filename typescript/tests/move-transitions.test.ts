import test from "node:test";
import assert from "node:assert/strict";
import { getTransitionFrame } from "../lib/move-transitions.ts";

test("forward and reverse scrolling choose the same texture pair at the same position", () => {
  for (const value of [0.25, 0.75, 1.25, 5.75]) {
    const frame = getTransitionFrame(value, 8);
    assert.equal(frame.from, Math.floor(value));
    assert.equal(frame.to, Math.floor(value) + 1);
    assert.equal(frame.progress, value % 1);
  }
});

test("crossing a post boundary uses the previous destination as the next source", () => {
  const before = getTransitionFrame(2.9999, 8);
  const after = getTransitionFrame(3, 8);
  assert.equal(before.to, after.from);
  assert.equal(after.progress, 0);
});

test("first, last, single and empty archives never produce an out of range texture index", () => {
  assert.deepEqual(getTransitionFrame(-2, 8), { from: 0, to: 1, progress: 0 });
  assert.deepEqual(getTransitionFrame(100, 8), { from: 7, to: 7, progress: 0 });
  assert.deepEqual(getTransitionFrame(1.5, 1), { from: 0, to: 0, progress: 0 });
  assert.deepEqual(getTransitionFrame(0, 0), { from: 0, to: 0, progress: 0 });
  assert.deepEqual(getTransitionFrame(NaN, 8), { from: 0, to: 1, progress: 0 });
});
