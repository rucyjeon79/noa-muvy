import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
