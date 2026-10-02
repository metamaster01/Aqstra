"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useTransform } from "framer-motion";

/**
 * Counts a number up from 0 to `value` once the bound element scrolls into view.
 * Returns [ref, motionValue] — bind ref to the element you want to trigger on,
 * and render the motionValue with <motion.span>{rounded}</motion.span>.
 */
export function useCountUp(value: number, options?: { duration?: number; decimals?: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) =>
    options?.decimals ? v.toFixed(options.decimals) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: options?.duration ?? 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, value, motionValue, options?.duration]);

  return { ref, rounded, inView };
}
