import type { PageSection } from "../../lib/content";
import { TextBlock } from "./block/text-block";
import { ImageBlock } from "./block/image-block";
import { VideoBlock } from "./block/video-block";
import { CalloutBlock, CodeBlock, ListBlock } from "./block/misc-blocks";

/**
 * Renders an ordered list of page_sections. This is the one place that knows
 * how a `type` maps to a component — a future "Add Section" admin UI only
 * ever needs to produce rows matching lib/content.ts's SectionContent union,
 * nothing here has to change when content is added.
 */
export function SectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.id} id={s.anchor ?? undefined} className="scroll-mt-24">
          {s.title && (
            <h2 className="font-display text-[20px] font-bold tracking-[-0.015em] text-foreground sm:text-[22px]">
              {s.title}
            </h2>
          )}
          <div className={s.title ? "mt-3" : ""}>{renderBlock(s)}</div>
        </section>
      ))}
    </div>
  );
}

function renderBlock(s: PageSection) {
  switch (s.type) {
    case "text":
      return <TextBlock {...(s.content as any)} />;
    case "image":
      return <ImageBlock {...(s.content as any)} />;
    case "video":
      return <VideoBlock {...(s.content as any)} />;
    case "callout":
      return <CalloutBlock {...(s.content as any)} />;
    case "code":
      return <CodeBlock {...(s.content as any)} />;
    case "list":
      return <ListBlock {...(s.content as any)} />;
    default:
      return null;
  }
}
