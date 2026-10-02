import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard shadcn-style class merger: clsx for conditional classes,
 * tailwind-merge to resolve conflicting Tailwind utilities (e.g. two
 * different `p-*` values) so the last one wins instead of both leaking
 * into the DOM.
 *
 * New deps needed: `npm i clsx tailwind-merge`
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
