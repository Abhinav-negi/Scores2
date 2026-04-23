import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge tailwind classes safely.
 * Solves the problem of conflicting tailwind classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
