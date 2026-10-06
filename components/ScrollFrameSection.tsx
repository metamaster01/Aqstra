// "use client";

// import { useEffect, useRef, useState, type ReactNode } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// /* -------------------------------------------------------------------------- */
// /*  Config                                                                    */
// /* -------------------------------------------------------------------------- */

// // /public/scroll-frames/frames_001.jpg … frames_120.jpg
// const FRAME_COUNT = 120;
// const FRAME_DIR = "/frames";
// const frameSrc = (index: number) =>
//   `${FRAME_DIR}/frame_${String(index + 1).padStart(3, "0")}.jpg`;

// // Mobile / tablet gets this video instead of the frames.
// // /public/video-sec-2.mp4
// const VIDEO_MP4 = "/video-sec-2.mp4";
// const VIDEO_ASPECT = "16 / 9"; // your video's real aspect ratio

// // How many screens of scrolling it takes to play all frames.
// // Higher = slower / more "cinematic". 120 frames / 5 screens ≈ 24 frames per screen.
// const SCROLL_SCREENS = 5;

// // At or above this width we use the full-screen scrubbed sequence.
// const DESKTOP_QUERY = "(min-width: 1024px)";
// const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// // Start downloading frames when the section is this far from the viewport
// // (so it doesn't compete with the hero's own frames on first load).
// const PRELOAD_MARGIN = "300% 0px";
// const LOAD_CONCURRENCY = 6;
// const MAX_DPR = 1.5; // canvas resolution cap – big perf win, barely visible

// /* -------------------------------------------------------------------------- */
// /*  Mode detection                                                            */
// /* -------------------------------------------------------------------------- */

// type Mode = "desktop" | "mobile" | "static";

// function useMode(): Mode | null {
//   const [mode, setMode] = useState<Mode | null>(null);

//   useEffect(() => {
//     const desktop = window.matchMedia(DESKTOP_QUERY);
//     const reduce = window.matchMedia(REDUCE_MOTION_QUERY);
//     const update = () =>
//       setMode(reduce.matches ? "static" : desktop.matches ? "desktop" : "mobile");

//     update();
//     desktop.addEventListener("change", update);
//     reduce.addEventListener("change", update);
//     return () => {
//       desktop.removeEventListener("change", update);
//       reduce.removeEventListener("change", update);
//     };
//   }, []);

//   return mode;
// }

// /* -------------------------------------------------------------------------- */
// /*  Public component                                                          */
// /* -------------------------------------------------------------------------- */

// /**
//  * Place it right after the hero:
//  *
//  *   <Hero />
//  *   <ScrollFrameSection />
//  *
//  * It does NOT create its own Lenis – it relies on the single
//  * <SmoothScrollProvider> in your root layout (which already feeds
//  * ScrollTrigger on every Lenis tick).
//  *
//  * Note: `position: sticky` breaks if any ancestor has overflow hidden/auto.
//  * If you need to hide horizontal overflow on a wrapper, use `overflow-x: clip`.
//  */
// export function ScrollFrameSection() {
//   const mode = useMode();

//   if (mode === "desktop") return <DesktopSequence />;
//   if (mode === "mobile") return <MobileVideo />;
//   if (mode === "static") return <StaticFrame />;

//   // Before hydration / first media-query read – keeps the space reserved.
//   return <div aria-hidden className="w-full bg-black" style={{ aspectRatio: VIDEO_ASPECT }} />;
// }

// /* -------------------------------------------------------------------------- */
// /*  Desktop – full-screen, scroll-scrubbed canvas                             */
// /* -------------------------------------------------------------------------- */

// function DesktopSequence() {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const sectionRef = useRef<HTMLElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const track = trackRef.current;
//     const section = sectionRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext("2d");
//     if (!track || !section || !canvas || !ctx) return;

//     const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
//     const loaded = new Uint8Array(FRAME_COUNT);
//     const state = { frame: 0 }; // fractional frame currently shown (tweened)
//     let disposed = false;
//     let w = 0;
//     let h = 0;

//     /* ------------------------------ Drawing -------------------------------- */

//     const drawCover = (img: HTMLImageElement, alpha: number) => {
//       const imageAspect = img.naturalWidth / img.naturalHeight;
//       const canvasAspect = w / h;
//       let dw: number, dh: number, dx: number, dy: number;

//       if (imageAspect > canvasAspect) {
//         dh = h;
//         dw = dh * imageAspect;
//         dx = (w - dw) / 2;
//         dy = 0;
//       } else {
//         dw = w;
//         dh = dw / imageAspect;
//         dx = 0;
//         dy = (h - dh) / 2;
//       }

//       ctx.globalAlpha = alpha;
//       ctx.drawImage(img, dx, dy, dw, dh);
//     };

//     // Newest loaded frame at or before `index` (so a not-yet-loaded frame
//     // never shows a blank canvas while the rest are still streaming in).
//     const nearestLoaded = (index: number) => {
//       for (let i = index; i >= 0; i--) if (loaded[i]) return images[i]!;
//       return null;
//     };

//     const render = () => {
//       if (!w || !h) return;

//       const exact = Math.min(Math.max(state.frame, 0), FRAME_COUNT - 1);
//       const base = Math.floor(exact);
//       const frac = exact - base;

//       const baseImg = nearestLoaded(base);
//       if (!baseImg) return;
//       drawCover(baseImg, 1);

//       // Blend toward the next frame so scrubbing feels fluid, not stepped.
//       if (frac > 0.02 && base + 1 < FRAME_COUNT && loaded[base + 1]) {
//         drawCover(images[base + 1]!, frac);
//       }
//       ctx.globalAlpha = 1;
//     };

//     const setCanvasSize = () => {
//       const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
//       w = section.clientWidth;
//       h = section.clientHeight;
//       canvas.width = Math.round(w * dpr);
//       canvas.height = Math.round(h * dpr);
//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//       ctx.imageSmoothingQuality = "high";
//     };

//     setCanvasSize();

//     const resizeObserver = new ResizeObserver(() => {
//       setCanvasSize();
//       render();
//     });
//     resizeObserver.observe(section);

//     /* ------------------------------ Loading -------------------------------- */

//     // Coarse → fine: every 8th frame first, then 4th, 2nd, and finally all.
//     // Even if someone scrolls fast before loading finishes, there's always a
//     // reasonably close frame to show.
//     const order: number[] = [];
//     const seen = new Set<number>();
//     const push = (i: number) => {
//       if (!seen.has(i)) {
//         seen.add(i);
//         order.push(i);
//       }
//     };
//     push(0);
//     push(FRAME_COUNT - 1);
//     for (const stride of [8, 4, 2, 1]) {
//       for (let i = 0; i < FRAME_COUNT; i += stride) push(i);
//     }

//     let cursor = 0;
//     let inFlight = 0;

//     const pump = () => {
//       while (!disposed && inFlight < LOAD_CONCURRENCY && cursor < order.length) {
//         const index = order[cursor++];
//         const img = new window.Image();
//         img.decoding = "async";
//         inFlight++;

//         const finish = (ok: boolean) => {
//           inFlight--;
//           if (disposed) return;
//           if (ok) {
//             images[index] = img;
//             loaded[index] = 1;
//             // Redraw only if this frame could change what's on screen.
//             if (Math.abs(index - state.frame) <= 8) render();
//           } else if (index === 0) {
//             console.warn(`[ScrollFrameSection] Could not load ${frameSrc(0)} – check /public${FRAME_DIR}`);
//           }
//           pump();
//         };

//         img.onload = () => finish(true);
//         img.onerror = () => finish(false);
//         img.src = frameSrc(index);
//       }
//     };

//     let started = false;
//     const start = () => {
//       if (started) return;
//       started = true;
//       pump();
//     };

//     const io = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           start();
//           io.disconnect();
//         }
//       },
//       { rootMargin: PRELOAD_MARGIN }
//     );
//     io.observe(track);

//     /* --------------------------- GSAP ScrollTrigger ------------------------ */

//     const gsapCtx = gsap.context(() => {
//       const st = ScrollTrigger.create({
//         trigger: track,
//         // Frames only start once the section fully covers the screen
//         // (top of the sticky section = top of viewport).
//         start: "top top",
//         end: "bottom bottom",
//         invalidateOnRefresh: true,
//         onUpdate: (self) => {
//           // Lenis smooths the scroll itself; this short ease on top of it
//           // removes the last bit of stepping between frames.
//           gsap.to(state, {
//             frame: self.progress * (FRAME_COUNT - 1),
//             duration: 0.3,
//             ease: "power2.out",
//             overwrite: true,
//             onUpdate: render,
//           });
//         },
//         onRefresh: (self) => {
//           // Page reloaded mid-scroll, or layout changed: jump to the right frame.
//           state.frame = self.progress * (FRAME_COUNT - 1);
//           render();
//         },
//       });

//       state.frame = st.progress * (FRAME_COUNT - 1);
//     }, track);

//     return () => {
//       disposed = true;
//       io.disconnect();
//       resizeObserver.disconnect();
//       gsap.killTweensOf(state);
//       gsapCtx.revert();
//     };
//   }, []);

//   return (
//     // Tall track = scroll distance. The sticky section stays pinned to the
//     // viewport while the track scrolls past it (no GSAP pin-spacer needed).
//     <div
//       ref={trackRef}
//       className="relative"
//       style={{ height: `${(SCROLL_SCREENS + 1) * 100}svh` }}
//     >
//       <section
//         ref={sectionRef}
//         aria-hidden
//         className="sticky top-0 h-svh w-full overflow-hidden bg-black"
//       >
//         <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
//       </section>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Mobile / tablet – compact, landscape rectangle playing the video          */
// /* -------------------------------------------------------------------------- */

// function VideoShell({ children }: { children: ReactNode }) {
//   return (
//     <section className="w-full bg-black px-4 py-10 sm:px-8 sm:py-14">
//       <div
//         className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900"
//         style={{ aspectRatio: VIDEO_ASPECT }}
//       >
//         {children}
//       </div>
//     </section>
//   );
// }

// function MobileVideo() {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     // React doesn't reliably set the `muted` attribute – iOS needs it for autoplay.
//     video.muted = true;

//     // Only play while it's actually on screen (saves battery + data).
//     const io = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) video.play().catch(() => {});
//         else video.pause();
//       },
//       { threshold: 0.35 }
//     );
//     io.observe(video);

//     return () => io.disconnect();
//   }, []);

//   return (
//     <VideoShell>
//       <video
//         ref={videoRef}
//         className="h-full w-full object-cover"
//         poster={frameSrc(0)}
//         muted
//         loop
//         playsInline
//         preload="metadata"
//         aria-hidden
//       >
//         <source src={VIDEO_MP4} type="video/mp4" />
//       </video>
//     </VideoShell>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  prefers-reduced-motion – one still frame, no scrubbing, no autoplay       */
// /* -------------------------------------------------------------------------- */

// function StaticFrame() {
//   return (
//     <VideoShell>
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src={frameSrc(Math.floor(FRAME_COUNT / 2))}
//         alt=""
//         draggable={false}
//         className="h-full w-full object-cover"
//       />
//     </VideoShell>
//   );
// }

















"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

// /public/scroll-frames/frames_001.jpg … frames_120.jpg
const CDN = process.env.NEXT_PUBLIC_CDN_URL;
const FRAME_COUNT = 200;
const FRAME_DIR = `${CDN}/frames`;
const VIDEO_MP4 = `${CDN}/video/video-sec-2.mp4`;

// const FRAME_DIR = "/frames/frame-2";
const frameSrc = (index: number) =>
  `${FRAME_DIR}/frame_${String(index + 1).padStart(3, "0")}.png`;

// Mobile / tablet video: /public/video-sec-2.mp4
// const VIDEO_MP4 = "/video-sec-2.mp4";

// Aspect ratio of your video / frames (width ÷ height). 16:9 = 16 / 9.
const VIDEO_RATIO = 18 / 9;

// Desktop layout: the frame sits BELOW the navbar and never touches the edges.
const NAV_HEIGHT = 58; // px – same value your hero uses (100svh - 58px)
const FRAME_PAD = 32; // px – space around the frame on desktop

// Screens of scrolling needed to play all frames (higher = slower).
const SCROLL_SCREENS = 5;

// How quickly the picture catches up with the scroll position.
// Higher = snappier, lower = floatier. 8–12 feels good.
const SMOOTHING = 9;

// Desktop scrub at or above this width, video below it.
const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Start downloading frames when the section is this far from the viewport.
const PRELOAD_MARGIN = "300% 0px";
const LOAD_CONCURRENCY = 6;
const MAX_DPR = 1.5;
const MAX_BITMAP_WIDTH = 1280; // decoded frame width cap (memory vs sharpness)

// Theme-aware frame styling (light + dark, using your existing tokens).
const FRAME_CLASS =
  "overflow-hidden rounded-2xl border border-border bg-card " +
  "shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] " +
  "dark:border-white/10 dark:shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)]";

/* -------------------------------------------------------------------------- */
/*  Mode detection                                                            */
/* -------------------------------------------------------------------------- */

type Mode = "desktop" | "mobile" | "static";

function useMode(): Mode | null {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduce = window.matchMedia(REDUCE_MOTION_QUERY);
    const update = () =>
      setMode(reduce.matches ? "static" : desktop.matches ? "desktop" : "mobile");

    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return mode;
}

/* -------------------------------------------------------------------------- */
/*  Public component                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Place right after the hero:  <Hero /><ScrollFrameSection />
 *
 * Uses the single Lenis from <SmoothScrollProvider> in your root layout –
 * it does not create its own.
 *
 * `position: sticky` breaks if an ancestor has overflow hidden/auto.
 * Use `overflow-x: clip` on wrappers instead.
 */
export function ScrollFrameSection() {
  const mode = useMode();

  if (mode === "desktop") return <DesktopSequence />;
  if (mode === "mobile") return <MobileVideo />;
  if (mode === "static") return <StaticFrame />;

  return <div aria-hidden className="w-full bg-background" style={{ aspectRatio: VIDEO_RATIO }} />;
}

/* -------------------------------------------------------------------------- */
/*  Desktop – framed, scroll-scrubbed canvas                                  */
/* -------------------------------------------------------------------------- */

// Largest frame with the video's ratio that fits under the navbar with padding
// on every side (limited by height on wide screens, by width on narrow ones).
const desktopFrameStyle: CSSProperties = {
  aspectRatio: `${VIDEO_RATIO}`,
  width: `min(100%, calc((100svh - ${NAV_HEIGHT + FRAME_PAD * 2}px) * ${VIDEO_RATIO}))`,
};

function DesktopSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!track || !frame || !canvas || !ctx) return;

    // Frames are decoded to ImageBitmaps off the main thread and resized once
    // to the frame's size, so drawing during scroll is just a fast blit – no
    // decoding, no resampling. This is what removes the "rough" feeling.
    const bitmaps: (ImageBitmap | undefined)[] = new Array(FRAME_COUNT);
    const loaded = new Uint8Array(FRAME_COUNT);
    const state = { frame: 0 }; // fractional frame currently drawn
    let target = 0; // fractional frame the scroll position asks for
    let disposed = false;
    let w = 0;
    let h = 0;
    let lastDrawn = -1;

    /* ------------------------------ Drawing -------------------------------- */

    const drawCover = (img: ImageBitmap, alpha: number) => {
      const imageAspect = img.width / img.height;
      const canvasAspect = w / h;
      let dw: number, dh: number, dx: number, dy: number;

      if (imageAspect > canvasAspect) {
        dh = h;
        dw = dh * imageAspect;
        dx = (w - dw) / 2;
        dy = 0;
      } else {
        dw = w;
        dh = dw / imageAspect;
        dx = 0;
        dy = (h - dh) / 2;
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const nearestLoaded = (index: number) => {
      for (let i = index; i >= 0; i--) if (loaded[i]) return bitmaps[i]!;
      return null;
    };

    const render = () => {
      if (!w || !h) return;

      const exact = Math.min(Math.max(state.frame, 0), FRAME_COUNT - 1);
      const base = Math.floor(exact);
      const frac = exact - base;

      const baseImg = nearestLoaded(base);
      if (!baseImg) return;
      drawCover(baseImg, 1);

      // Blend toward the next frame so motion is continuous, not stepped.
      if (frac > 0.02 && base + 1 < FRAME_COUNT && loaded[base + 1]) {
        drawCover(bitmaps[base + 1]!, frac);
      }
      ctx.globalAlpha = 1;
      lastDrawn = exact;
    };

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = frame.clientWidth;
      h = frame.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";
    };

    setCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
      render();
    });
    resizeObserver.observe(frame);

    /* ------------------------------ Loading -------------------------------- */

    // Coarse → fine (every 8th frame, then 4th, 2nd, all) so a fast scroll
    // before loading finishes still lands near a real frame.
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    push(0);
    push(FRAME_COUNT - 1);
    for (const stride of [8, 4, 2, 1]) {
      for (let i = 0; i < FRAME_COUNT; i += stride) push(i);
    }

    const abort = new AbortController();
    let bitmapWidth = MAX_BITMAP_WIDTH;

    const makeBitmap = async (blob: Blob) => {
      try {
        return await createImageBitmap(blob, {
          resizeWidth: bitmapWidth,
          resizeQuality: "high",
        });
      } catch {
        return await createImageBitmap(blob); // older browsers: no resize options
      }
    };

    const loadFrame = async (index: number) => {
      const res = await fetch(frameSrc(index), { signal: abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return makeBitmap(await res.blob());
    };

    let cursor = 0;
    let inFlight = 0;

    const pump = () => {
      while (!disposed && inFlight < LOAD_CONCURRENCY && cursor < order.length) {
        const index = order[cursor++];
        inFlight++;

        loadFrame(index)
          .then((bmp) => {
            if (disposed) {
              bmp.close();
              return;
            }
            bitmaps[index] = bmp;
            loaded[index] = 1;
            if (Math.abs(index - state.frame) <= 8) render();
          })
          .catch(() => {
            if (index === 0 && !disposed) {
              console.warn(`[ScrollFrameSection] Could not load ${frameSrc(0)} – check /public${FRAME_DIR}`);
            }
          })
          .finally(() => {
            inFlight--;
            pump();
          });
      }
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      bitmapWidth = Math.min(MAX_BITMAP_WIDTH, Math.ceil(frame.clientWidth * dpr));
      pump();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    io.observe(track);

    /* --------------------- Smoothing loop (GSAP ticker) -------------------- */

    // One draw per display frame, framerate-independent easing toward the
    // scroll target. ScrollTrigger only updates `target`; it never draws.
    const tick = (_time: number, deltaMs: number) => {
      const diff = target - state.frame;
      if (Math.abs(diff) < 0.001) {
        if (state.frame !== target) state.frame = target;
        if (lastDrawn !== state.frame) render();
        return;
      }
      const dt = Math.min(deltaMs, 100) / 1000;
      state.frame += diff * (1 - Math.exp(-dt * SMOOTHING));
      render();
    };
    gsap.ticker.add(tick);

    /* --------------------------- GSAP ScrollTrigger ------------------------ */

    const gsapCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        // Frames start when the framed section locks in under the navbar.
        start: `top ${NAV_HEIGHT}px`,
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          target = self.progress * (FRAME_COUNT - 1);
        },
        onRefresh: (self) => {
          // Reload mid-page or layout change: jump straight to the right frame.
          target = self.progress * (FRAME_COUNT - 1);
          state.frame = target;
          render();
        },
      });
    }, track);

    return () => {
      disposed = true;
      abort.abort();
      io.disconnect();
      resizeObserver.disconnect();
      gsap.ticker.remove(tick);
      gsapCtx.revert();
      bitmaps.forEach((b) => b?.close());
    };
  }, []);

  return (
    // Tall track = scroll distance. The sticky section holds the frame in place
    // while the track scrolls past (no GSAP pin-spacer, plays nicely with Lenis).
    <div
      ref={trackRef}
      className="relative bg-background"
      style={{ height: `${(SCROLL_SCREENS + 1) * 100}svh` }}
    >
      {/* Light theme: continue the hero's soft bottom tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40svh] bg-gradient-to-b from-[#f3f6fb] to-transparent dark:hidden"
      />

      <section
        aria-hidden
        className="sticky flex items-center justify-center overflow-hidden"
        style={{
          top: NAV_HEIGHT,
          height: `calc(100svh - ${NAV_HEIGHT}px)`,
          padding: FRAME_PAD,
        }}
      >
        {/* Dark theme: faint glow behind the frame, same family as the hero blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a3690]/30 blur-[140px] dark:block"
        />

        <div ref={frameRef} className={`${FRAME_CLASS} relative`} style={desktopFrameStyle}>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile / tablet – compact landscape rectangle playing the video           */
/* -------------------------------------------------------------------------- */

function VideoShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative w-full bg-background px-4 py-6 sm:px-8 sm:py-14 lg:py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f3f6fb] to-transparent dark:hidden"
      />
      <div
        className={`${FRAME_CLASS} relative mx-auto w-full max-w-6xl`}
        style={{ aspectRatio: VIDEO_RATIO }}
      >
        {children}
      </div>
    </section>
  );
}

function MobileVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS needs the muted *property* set for autoplay; React's attribute isn't enough.
    video.muted = true;

    // Play only while on screen (saves battery + data).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);

    return () => io.disconnect();
  }, []);

  return (
    <VideoShell>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={frameSrc(0)}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src={VIDEO_MP4} type="video/mp4" />
      </video>
    </VideoShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  prefers-reduced-motion – one still frame, no scrubbing, no autoplay       */
/* -------------------------------------------------------------------------- */

function StaticFrame() {
  return (
    <VideoShell>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frameSrc(Math.floor(FRAME_COUNT / 2))}
        alt=""
        draggable={false}
        className="h-full w-full object-cover"
      />
    </VideoShell>
  );
}