// "use client";

// /**
//  * Lottie wrapper for .json animations stored in /public.
//  *
//  *   npm i lottie-react
//  *
//  * - Loaded lazily and client-only (lottie-web touches `document`, which breaks SSR).
//  * - The JSON is fetched from /public instead of imported, so it does not bloat the JS bundle.
//  * - The box keeps its size while loading, so the page never jumps.
//  * - Reduced motion: plays once and stops instead of looping.
//  */

// import {
//   useEffect,
//   useState,
//   type ComponentType,
//   type CSSProperties,
// } from "react";
// import dynamic from "next/dynamic";
// import { useReducedMotion } from "framer-motion";

// type LottieAnimationProps = {
//   animationData: object;
//   loop: boolean;
//   autoplay: boolean;
//   rendererSettings: { preserveAspectRatio: string };
//   style: CSSProperties;
// };

// const Lottie = dynamic<LottieAnimationProps>(
//   () =>
//     import("lottie-react").then(
//       (mod) => mod.Lottie as unknown as ComponentType<LottieAnimationProps>,
//     ),
//   { ssr: false },
// );

// export function LottieAnimation({
//   src,
//   label,
//   className = "",
//   loop = true,
// }: {
//   /** path inside /public, e.g. "/lottie/coming-soon.json" */
//   src: string;
//   /** accessible description of the animation */
//   label: string;
//   /** size it with Tailwind, e.g. "h-[260px] w-full sm:h-[340px]" */
//   className?: string;
//   loop?: boolean;
// }) {
//   const reduce = useReducedMotion();
//   const [data, setData] = useState<object | null>(null);

//   useEffect(() => {
//     let cancelled = false;
//     fetch(src)
//       .then((r) => r.json())
//       .then((json) => {
//         if (!cancelled) setData(json);
//       })
//       .catch(() => {
//         /* if it fails to load, the page still works without the animation */
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [src]);

//   return (
//     <div role="img" aria-label={label} className={className}>
//       {data && (
//         <Lottie
//           animationData={data}
//           loop={loop && !reduce}
//           autoplay
//           rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
//           style={{ width: "100%", height: "100%" }}
//         />
//       )}
//     </div>
//   );
// }





"use client";

/**
 * Lottie wrapper for .json animations stored in /public.
 *
 *   npm i lottie-web
 *
 * Uses lottie-web directly (no React wrapper), which avoids the module-interop
 * problems lottie-react has with Next.js dynamic imports.
 *
 * - Loaded only in the browser, inside an effect (lottie-web needs `document`).
 * - The JSON is fetched from /public instead of imported, so it does not bloat the JS bundle.
 * - The box keeps its size while loading, so the page never jumps.
 * - Reduced motion: plays once and stops instead of looping.
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { AnimationItem } from "lottie-web";

type LottieWeb = typeof import("lottie-web").default;

/** Finds loadAnimation however the bundler wrapped the module (default / default.default). */
function resolveLottie(mod: unknown): LottieWeb {
  let m: unknown = mod;
  for (let i = 0; i < 3; i++) {
    if (typeof (m as LottieWeb | undefined)?.loadAnimation === "function") break;
    m = (m as { default?: unknown } | undefined)?.default;
  }
  return m as LottieWeb;
}

export function LottieAnimation({
  src,
  label,
  className = "",
  loop = true,
}: {
  /** path inside /public, e.g. "/lottie/coming-soon.json" */
  src: string;
  /** accessible description of the animation */
  label: string;
  /** size it with Tailwind, e.g. "h-[260px] w-full sm:h-[340px]" */
  className?: string;
  loop?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let anim: AnimationItem | undefined;
    let cancelled = false;

    (async () => {
      try {
        const [mod, res] = await Promise.all([import("lottie-web"), fetch(src)]);
        const data = await res.json();
        if (cancelled || !box.current) return;

        const lottie = resolveLottie(mod);
        anim = lottie.loadAnimation({
          container: box.current,
          renderer: "svg",
          loop: loop && !reduce,
          autoplay: true,
          animationData: data,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
      } catch (err) {
        // the page still works without the animation
        console.warn(`[LottieAnimation] could not load ${src}`, err);
      }
    })();

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src, loop, reduce]);

  return <div ref={box} role="img" aria-label={label} className={className} />;
}