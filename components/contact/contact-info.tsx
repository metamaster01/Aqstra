import { Clock, LifeBuoy, Mail, type LucideIcon } from "lucide-react";
import { CONTACT, CONTACT_IMAGE } from "@/lib/contact";
import { SolutionImage } from "@/components/solutions/solution-image";

const METHODS: { icon: LucideIcon; title: string; detail: string; note: string; href?: string }[] = [
  {
    icon: Mail,
    title: "Sales and demos",
    detail: CONTACT.salesEmail,
    note: "Pricing, plans and product walkthroughs",
    href: `mailto:${CONTACT.salesEmail}`,
  },
  {
    icon: LifeBuoy,
    title: "Support",
    detail: CONTACT.supportEmail,
    note: "Help with your account or workspace",
    href: `mailto:${CONTACT.supportEmail}`,
  },
  {
    icon: Clock,
    title: "Response time",
    detail: `Usually ${CONTACT.responseTime}`,
    note: "Messages sent at weekends are answered the next working day",
  },
];

export function ContactInfo() {
  return (
    <div>
      <h2 className="font-display text-[22px] font-bold tracking-[-0.02em] text-foreground">Prefer to reach us directly?</h2>
      <p className="mt-1.5 text-[14px] leading-[1.7] text-muted">Pick whichever is easiest. We read everything.</p>

      <ul className="mt-6 space-y-3">
        {METHODS.map(({ icon: Icon, title, detail, note, href }) => (
          <li
            key={title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 dark:border-white/15 dark:bg-white/[0.03]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary dark:text-[#8aa4ff]">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-foreground">{title}</p>
              {href ? (
                <a href={href} className="mt-0.5 block text-[14px] font-semibold text-primary [overflow-wrap:anywhere] hover:underline dark:text-[#9db8ff]">
                  {detail}
                </a>
              ) : (
                <p className="mt-0.5 text-[14px] font-semibold text-foreground">{detail}</p>
              )}
              <p className="mt-1 text-[12.5px] leading-[1.6] text-muted">{note}</p>
            </div>
          </li>
        ))}
      </ul>

      <SolutionImage image={CONTACT_IMAGE} sizes="(min-width: 1024px) 440px, 100vw" className="mt-6" />
    </div>
  );
}
