"use client";

import { useRef, type ReactNode } from "react";

/** A card shell with a soft light that follows the pointer. Pure CSS variables, no re-renders. */
export function Spotlight({ children, className = "", color = "rgba(37,99,235,0.16)" }: { children: ReactNode; className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`group/spot relative ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 65%)` }}
      />
      {children}
    </div>
  );
}
