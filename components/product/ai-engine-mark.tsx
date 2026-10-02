/**
 * Shared "compute / AI engine" mark — originally built inline inside
 * DataFlowSection, pulled out here so PlatformCapabilitiesSection's root
 * node (and anything else that wants the AQSTRA engine glyph) can reuse the
 * exact same SVG instead of a copy-pasted duplicate.
 */
export function AIEngineMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 20 L20 7 M20 20 L33 20 M20 20 L20 33 M20 20 L7 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M20 20 L29.2 10.8 M20 20 L29.2 29.2 M20 20 L10.8 29.2 M20 20 L10.8 10.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="20" cy="7" r="2.6" fill="currentColor" />
      <circle cx="33" cy="20" r="2.6" fill="currentColor" />
      <circle cx="20" cy="33" r="2.6" fill="currentColor" />
      <circle cx="7" cy="20" r="2.6" fill="currentColor" />
      <circle cx="29.2" cy="10.8" r="1.8" fill="currentColor" opacity="0.75" />
      <circle cx="29.2" cy="29.2" r="1.8" fill="currentColor" opacity="0.75" />
      <circle cx="10.8" cy="29.2" r="1.8" fill="currentColor" opacity="0.75" />
      <circle cx="10.8" cy="10.8" r="1.8" fill="currentColor" opacity="0.75" />
      <rect x="14.5" y="14.5" width="11" height="11" rx="3" fill="currentColor" />
    </svg>
  );
}
