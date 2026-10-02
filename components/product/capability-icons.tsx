/**
 * Six hand-drawn glyphs for the Platform Capabilities cards — custom inline
 * SVG rather than pulled from lucide, same approach as the AI engine mark
 * and the data-flow section. All share one visual language: 24x24 viewBox,
 * ~1.8px rounded strokes, fill="currentColor" only for small accent dots.
 */

const base = { viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function AdvancedSearchGlyph({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" />
      <path d="M8 9.5h5M8 12.5h3" stroke="currentColor" />
      <path d="M19.5 19.5L15 15" stroke="currentColor" />
    </svg>
  );
}

export function DataEnrichmentGlyph({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="13" r="6" stroke="currentColor" />
      <circle cx="17" cy="7" r="3" stroke="currentColor" />
      <path d="M14.6 9.3L12.5 11.2" stroke="currentColor" />
      <path d="M17 5.6v2.8M15.6 7h2.8" stroke="currentColor" />
    </svg>
  );
}

export function VerificationGlyph({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.2l6.5 2.6v5.1c0 4.5-2.8 7.2-6.5 8.4-3.7-1.2-6.5-3.9-6.5-8.4V5.8L12 3.2z" stroke="currentColor" />
      <path d="M8.8 12.3l2.1 2.1 4.3-4.6" stroke="currentColor" />
    </svg>
  );
}

export function ListManagementGlyph({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 7.2c0-1 .8-1.8 1.8-1.8h3.6l1.6 1.8h7a1.8 1.8 0 011.8 1.8v8.2c0 1-.8 1.8-1.8 1.8H5.8A1.8 1.8 0 014 17.2V7.2z"
        stroke="currentColor"
      />
      <path d="M8 12.5h8" stroke="currentColor" opacity="0.6" />
    </svg>
  );
}

export function CampaignBuilderGlyph({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 12.2L20 4.5l-5.3 15.8-3.4-7-7.8-3.1z" stroke="currentColor" strokeLinejoin="round" />
      <path d="M11.3 13.3L20 4.5" stroke="currentColor" />
    </svg>
  );
}

export function CrmSyncGlyph({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 12a7.5 7.5 0 0113-5.1" stroke="currentColor" />
      <path d="M19.5 12a7.5 7.5 0 01-13 5.1" stroke="currentColor" />
      <path d="M17.5 4.7v3.2h-3.2M6.5 19.3v-3.2h3.2" stroke="currentColor" />
    </svg>
  );
}
