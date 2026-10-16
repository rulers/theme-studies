"use client";
import { useState } from "react";
export function useToggle(initial = false) {
  const [enabled, setEnabled] = useState(initial);
  return [enabled, () => setEnabled((value) => !value)];
}
