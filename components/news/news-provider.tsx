// "use client";

// import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
// import type { Scope, Story } from "@/lib/news/types";
// import { StoryDrawer } from "./story-drawer";

// interface NewsContext {
//   scope: Scope | null;
//   industry: string | null;
//   setScope: (s: Scope | null) => void;
//   setIndustry: (i: string | null) => void;
//   clearFilters: () => void;
//   openStory: (s: Story) => void;
// }

// const Ctx = createContext<NewsContext | null>(null);

// export function useNews(): NewsContext {
//   const v = useContext(Ctx);
//   if (!v) throw new Error("useNews must be used inside <NewsProvider>");
//   return v;
// }

// /** Holds the shared filters and the story drawer, so any card anywhere on the page can open it. */
// export function NewsProvider({ children }: { children: ReactNode }) {
//   const [scope, setScopeState] = useState<Scope | null>(null);
//   const [industry, setIndustryState] = useState<string | null>(null);
//   const [selected, setSelected] = useState<Story | null>(null);

//   // Shareable links: /news?scope=india&industry=pharma
//   useEffect(() => {
//     const p = new URLSearchParams(window.location.search);
//     const s = p.get("scope");
//     const i = p.get("industry");
//     if (s === "india" || s === "global") setScopeState(s);
//     if (i && /^[a-z0-9-]{1,60}$/.test(i)) setIndustryState(i);
//   }, []);

//   const sync = useCallback((s: Scope | null, i: string | null) => {
//     const p = new URLSearchParams();
//     if (s) p.set("scope", s);
//     if (i) p.set("industry", i);
//     const q = p.toString();
//     window.history.replaceState(null, "", q ? `?${q}` : window.location.pathname);
//   }, []);

//   const value = useMemo<NewsContext>(
//     () => ({
//       scope,
//       industry,
//       setScope: (s) => { setScopeState(s); sync(s, industry); },
//       setIndustry: (i) => { setIndustryState(i); sync(scope, i); },
//       clearFilters: () => { setScopeState(null); setIndustryState(null); sync(null, null); },
//       openStory: setSelected,
//     }),
//     [scope, industry, sync],
//   );

//   return (
//     <Ctx.Provider value={value}>
//       {children}
//       <StoryDrawer story={selected} onClose={() => setSelected(null)} />
//     </Ctx.Provider>
//   );
// }





"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Scope, Story } from "@/lib/news/types";
import { StoryDrawer } from "./story-drawer";

interface NewsContext {
  scope: Scope | null;
  industry: string | null;
  setScope: (s: Scope | null) => void;
  setIndustry: (i: string | null) => void;
  clearFilters: () => void;
  openStory: (s: Story) => void;
  /** True while the story sheet is open (the featured rotation pauses). */
  drawerOpen: boolean;
}

const Ctx = createContext<NewsContext | null>(null);

export function useNews(): NewsContext {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNews must be used inside <NewsProvider>");
  return v;
}

/** Holds the shared filters and the story drawer, so any card anywhere on the page can open it. */
export function NewsProvider({ children }: { children: ReactNode }) {
  const [scope, setScopeState] = useState<Scope | null>(null);
  const [industry, setIndustryState] = useState<string | null>(null);
  const [selected, setSelected] = useState<Story | null>(null);

  // Shareable links: /news?scope=india&industry=pharma
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get("scope");
    const i = p.get("industry");
    if (s === "india" || s === "global") setScopeState(s);
    if (i && /^[a-z0-9-]{1,60}$/.test(i)) setIndustryState(i);
  }, []);

  const sync = useCallback((s: Scope | null, i: string | null) => {
    const p = new URLSearchParams();
    if (s) p.set("scope", s);
    if (i) p.set("industry", i);
    const q = p.toString();
    window.history.replaceState(null, "", q ? `?${q}` : window.location.pathname);
  }, []);

  const value = useMemo<NewsContext>(
    () => ({
      scope,
      industry,
      setScope: (s) => { setScopeState(s); sync(s, industry); },
      setIndustry: (i) => { setIndustryState(i); sync(scope, i); },
      clearFilters: () => { setScopeState(null); setIndustryState(null); sync(null, null); },
      openStory: setSelected,
      drawerOpen: selected !== null,
    }),
    [scope, industry, sync, selected],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <StoryDrawer story={selected} onClose={() => setSelected(null)} />
    </Ctx.Provider>
  );
}