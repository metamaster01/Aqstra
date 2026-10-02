"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full border border-foreground/80 bg-background/60 p-[3px] transition-colors hover:border-primary ${className}`}
    >
      <motion.span
        initial={false}
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="flex size-5 items-center justify-center rounded-full bg-primary text-white shadow-sm"
      >
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {isDark ? <Moon className="size-3" /> : <Sun className="size-3" />}
        </motion.span>
      </motion.span>
    </button>
  );
}
