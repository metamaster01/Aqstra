import { SolutionIcon } from "@/components/solutions/solution-ui";
import { CLIENTS } from "@/lib/demo/marketing";

// Alternating type styles so the wordmarks don't all look the same.
const STYLES = [
  "font-display font-extrabold tracking-tight",
  "font-sans font-semibold tracking-[0.02em]",
  "font-display font-bold italic tracking-tight",
  "font-sans font-bold uppercase tracking-[0.12em] text-[13px]",
];

/** Client logos drifting right to left, forever. Pauses on hover; still (and wrapped) for reduced motion. */
export function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="border-y border-border bg-background py-12 sm:py-14">
      <style>{`
        @keyframes aq-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .aq-marquee-track { animation: aq-marquee 40s linear infinite; }
        .aq-marquee:hover .aq-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .aq-marquee-track { animation: none; width: auto; flex-wrap: wrap; justify-content: center; row-gap: 1.25rem; }
          .aq-dup { display: none; }
        }
      `}</style>

      <p className="px-6 text-center text-[11.5px] font-semibold uppercase tracking-[0.16em] text-muted">
        Trusted by revenue teams at fast-growing companies
      </p>

      <div className="aq-marquee relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="aq-marquee-track flex w-max items-center">
          {[...CLIENTS, ...CLIENTS].map((c, i) => {
            const dup = i >= CLIENTS.length;
            return (
              // Padding (not gap) on each item, so one full copy is exactly half the track and the loop is seamless.
              <li key={`${c.name}-${i}`} aria-hidden={dup || undefined} className={`${dup ? "aq-dup " : ""}pr-14 sm:pr-20`}>
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo} alt={dup ? "" : c.name} className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
                ) : (
                  <span className={`flex items-center gap-2 whitespace-nowrap text-[18px] text-foreground/45 transition-colors hover:text-foreground/80 ${STYLES[i % STYLES.length]}`}>
                    <SolutionIcon name={c.icon} className="size-5" />
                    {c.name}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
