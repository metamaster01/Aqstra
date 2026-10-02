"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

/**
 * Hero media: shows the exported product screenshot as a poster image, and
 * — the moment /public/videos/hero-video.webm exists — autoplays it on loop
 * in the exact same spot. No code changes needed later: just drop the file in.
 *
 * Expected assets (add these to /public):
 *   /images/hero-light.png   – poster for light theme
 *   /images/hero-dark.png    – poster for dark theme
 *   /videos/hero-video.webm  – looping autoplay clip (either theme / both)
 */
const POSTER_LIGHT = "/hero-image.png";
const POSTER_DARK = "/hero-image.png";
const VIDEO_SRC = "/hero-video.webm";

export function HeroVisual() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = videoRef.current;
    if (!el) return;
    if (prefersReduced) {
      el.pause();
    } else if (videoReady) {
      el.play().catch(() => {
        /* autoplay blocked — poster frame remains visible */
      });
    }
  }, [videoReady]);

  const poster = mounted && resolvedTheme === "dark" ? POSTER_DARK : POSTER_LIGHT;

  return (
    <div className="relative mx-auto aspect-[1.5/1] w-full max-w-[700px] overflow-hidden">
      {/* Poster image: always present so there is never a blank frame while the
          video loads, fails to load, or hasn't been added to /public yet. */}
      <Image
        src={poster}
        alt="AQSTRA MetaMaster platform preview"
        fill
        priority
        sizes="(min-width: 1024px) 600px, 90vw"
        className={`object-cover transition-opacity duration-500 ${videoReady && !videoFailed ? "opacity-0" : "opacity-100"}`}
      />

      {!videoFailed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={poster}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src={VIDEO_SRC} type="video/webm" />
        </video>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Fallback hand-built visual — kept for reference / storybook use only.   */
/* Not rendered by <HeroVisual /> above once real screenshots are in.      */
/* ---------------------------------------------------------------------- */
import { BarChart3, Bell, Building2, Check, Home, Lock, Mail, Phone, Search, User } from "lucide-react";

export function HeroVisualFallback() {
  return (
    <>
      <div className="dark:hidden"><LightVisual /></div>
      <div className="hidden dark:block"><DarkVisual /></div>
    </>
  );
}

/* ---------------------------- LIGHT ---------------------------- */
function LightVisual() {
  const locked = [
    { l: "N", c: "bg-blue-500" },
    { l: "V", c: "bg-violet-500" },
    { l: "C", c: "bg-blue-500" },
  ];
  return (
    <div className="relative mx-auto aspect-[1.2/1] w-full max-w-[560px]">
      <div aria-hidden className="absolute -right-2 -top-2 size-[46%] rounded-full bg-gradient-to-br from-sky-200/80 via-blue-200/60 to-transparent" />
      <div aria-hidden className="absolute inset-x-[-4%] bottom-[2%] top-[14%] rounded-[50%] bg-blue-100/50 blur-3xl" />

      {/* dashboard */}
      <div className="absolute left-[10%] right-[8%] top-[12%] rounded-2xl border border-white bg-white/90 p-3 shadow-[0_30px_60px_-20px_rgba(37,99,235,.25)] ring-1 ring-slate-200/70 sm:p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-display text-[11px] font-extrabold text-slate-900">
            <span className="flex size-4 items-center justify-center rounded bg-primary text-[9px] text-white">A</span>AQSTRA
          </span>
          <span className="flex items-center gap-2 text-slate-400"><Bell className="size-3" /><span className="size-4 rounded-full bg-slate-200" /></span>
        </div>
        <div className="mt-3 flex gap-3">
          <div className="flex flex-col items-center gap-3 rounded-lg bg-slate-50 px-1.5 py-2 text-slate-400">
            <Home className="size-3.5 rounded bg-blue-50 p-0.5 text-primary" /><Search className="size-3" /><Building2 className="size-3" /><User className="size-3" /><BarChart3 className="size-3" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="truncate rounded-full border border-slate-200 px-3 py-1.5 text-[9px] text-slate-400">Find leads, companies, or decision-makers…</div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-white"><Building2 className="size-3" /></span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[9px] font-semibold text-slate-800">Acme Technologies</p>
                <p className="truncate text-[7px] text-slate-400">Enterprise Software · San Francisco, CA</p>
              </div>
              <div className="hidden text-[7px] leading-tight text-slate-500 sm:block"><p className="font-semibold text-slate-700">John Carter</p>CEO</div>
              <Mail className="size-4 shrink-0 rounded bg-slate-100 p-0.5 text-slate-500" /><Phone className="size-4 shrink-0 rounded bg-slate-100 p-0.5 text-slate-500" />
              <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[7px] font-medium text-emerald-600">✓ Verified</span>
            </div>
            {locked.map((r) => (
              <div key={r.l} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${r.c}`}>{r.l}</span>
                <div className="flex-1 space-y-1"><i className="block h-1 w-16 rounded bg-slate-200" /><i className="block h-1 w-10 rounded bg-slate-100" /></div>
                <span className="flex shrink-0 items-center gap-1 rounded bg-blue-50 px-1.5 py-1 text-[7px] font-medium text-primary"><Lock className="size-2" />Subscribe to view contact</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating card */}
      <div className="absolute bottom-[26%] left-0 w-[34%] -rotate-6 rounded-xl bg-white p-3 shadow-[0_20px_40px_-15px_rgba(15,23,42,.25)] ring-1 ring-slate-100">
        <p className="mb-2 text-[10px] font-bold text-slate-900">Find and connect</p>
        {["Target the right companies", "Identify decision-makers", "Get verified contact details"].map((t) => (
          <p key={t} className="mb-1.5 flex items-center gap-1.5 text-[7px] text-slate-500">
            <span className="flex size-3 shrink-0 items-center justify-center rounded-full bg-primary"><Check className="size-2 text-white" strokeWidth={4} /></span>{t}
          </p>
        ))}
      </div>

      {/* robot mascot: swap for your exported illustration (next/image) when you have it */}
      <svg viewBox="0 0 120 140" className="absolute bottom-[18%] right-[1%] w-[20%]" aria-hidden>
        <defs><linearGradient id="rb" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c7d7fe" /></linearGradient></defs>
        <rect x="14" y="8" width="92" height="66" rx="30" fill="url(#rb)" stroke="#bcd0fb" />
        <rect x="26" y="24" width="68" height="36" rx="18" fill="#1e3a8a" />
        <circle cx="46" cy="42" r="5" fill="#67e8f9" /><circle cx="74" cy="42" r="5" fill="#67e8f9" />
        <path d="M52 52q8 6 16 0" stroke="#67e8f9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="32" y="82" width="56" height="44" rx="22" fill="url(#rb)" stroke="#bcd0fb" />
        <circle cx="60" cy="104" r="9" fill="#2563eb" /><text x="60" y="108" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">A</text>
      </svg>
      <span className="absolute right-[10%] top-[6%] rounded-lg bg-primary px-2 py-1 text-[9px] font-bold text-white shadow-lg">✦ AI</span>

      {/* chart card */}
      <div className="absolute bottom-[6%] right-0 w-[30%] rounded-xl bg-white p-2.5 shadow-[0_20px_40px_-15px_rgba(15,23,42,.25)] ring-1 ring-slate-100">
        <div className="flex items-end gap-1.5">
          <div className="flex-1 space-y-1"><i className="block h-1 rounded bg-slate-200" /><i className="block h-1 w-2/3 rounded bg-slate-200" /></div>
          <div className="flex h-9 items-end gap-1">
            {[35, 50, 65, 90].map((h, i) => <i key={i} className="w-1.5 rounded-sm bg-primary/80" style={{ height: `${h}%` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- DARK ---------------------------- */
function DarkVisual() {
  const filters = ["Industry: SaaS", "Location: United States", "Company Size: 50–500", "Intent: High"];
  const rows = [
    { n: "Acme Inc.", m: "96% Match", t: "Qualified" },
    { n: "Nova Systems", m: "94% Match", t: "Verified" },
    { n: "Vertex AI", m: "92% Match", t: "Qualified" },
    { n: "CloudSync", m: "89% Match", t: "Verified" },
  ];
  return (
    <div className="mx-auto w-full max-w-[560px] rounded-[20px] border border-white/40 bg-card p-5 shadow-2xl shadow-black/40 sm:p-6">
      <div className="flex items-center gap-2.5 border-b border-white/40 pb-4">
        <Search className="size-4 text-white/60" />
        <h2 className="text-[15px] font-semibold text-white">Lead Intelligence</h2>
      </div>
      <div className="mt-5 rounded-lg border border-white/60 bg-[#1a1a1a] px-4 py-3 text-[13px] text-white">Search prospects…</div>
      <div className="mt-3 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
        {filters.map((f) => <div key={f} className="rounded-md bg-[#1a1a1a] px-3.5 py-2.5 text-[11px] font-medium text-white">{f}</div>)}
      </div>
      <ul className="mt-5 space-y-2.5">
        {rows.map((r) => (
          <li key={r.n} className="flex items-center justify-between gap-2 rounded-lg border border-white/50 px-3.5 py-3">
            <span className="truncate text-[13px] font-medium text-white/90">{r.n}</span>
            <span className="flex shrink-0 items-center gap-2 text-[10px] font-semibold">
              <span className="rounded bg-emerald-500 px-2 py-1 text-[#03343a]">{r.m}</span>
              <span className={`rounded px-2 py-1 ${r.t === "Qualified" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-700"}`}>{r.t}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
