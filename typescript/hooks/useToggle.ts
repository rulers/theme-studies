"use client";
import { useState } from "react";
export function useToggle(initial = false): [boolean, () => void] {
  const [enabled, setEnabled] = useState(initial);
  return [enabled, () => setEnabled((value) => !value)];
}
