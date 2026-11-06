import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Joins class names, skipping falsy ones, and lets later Tailwind classes win
// over earlier conflicting ones: cn("px-4", isWide && "px-8") -> "px-8"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
