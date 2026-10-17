"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { INDUSTRIES, type IndustryId } from "@/lib/demo/industries";

/** A styled dropdown with full keyboard support (arrows, Home/End, Enter, Esc) and screen-reader roles. */
export function IndustrySelect({
  value,
  onChange,
  invalid = false,
}: {
  value: IndustryId | "";
  onChange: (v: IndustryId) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const selected = INDUSTRIES.find((i) => i.id === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${uid}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, uid]);

  const openList = () => {
    setActive(Math.max(0, INDUSTRIES.findIndex((i) => i.id === value)));
    setOpen(true);
  };
  const choose = (index: number) => {
    onChange(INDUSTRIES[index].id);
    setOpen(false);
  };

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = INDUSTRIES.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(last);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={wrap} className="relative">
      <button
        id="industry"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${uid}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-background px-4 text-left text-[14px] outline-none transition focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 ${
          invalid ? "border-red-500" : "border-border"
        } ${selected ? "text-foreground" : "text-muted"}`}
      >
        <span className="truncate">{selected ? selected.label : "Select an industry"}</span>
        <ChevronDown aria-hidden className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Industry"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[280px] overflow-y-auto overscroll-contain rounded-xl border border-border bg-card p-1.5 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.35)] dark:border-white/15 dark:bg-[#0f1424]"
        >
          {INDUSTRIES.map((o, i) => {
            const isSelected = o.id === value;
            return (
              <li
                key={o.id}
                id={`${uid}-${i}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()} // keep focus on the button
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[13.5px] ${
                  i === active ? "bg-primary/10 text-primary dark:text-[#9db8ff]" : "text-foreground/85"
                } ${isSelected ? "font-semibold" : ""}`}
              >
                {o.label}
                {isSelected && <Check className="size-4" aria-hidden />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
