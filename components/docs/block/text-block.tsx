export function TextBlock({ body }: { body: string }) {
  // `body` is plain markdown-ish text for now — swap the split for a markdown
  // renderer (e.g. `react-markdown`) later without touching the caller.
  const paragraphs = body.split(/\n{2,}/);
  return (
    <div className="max-w-none text-[15.5px] leading-[1.8] text-foreground/90">
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-4" : ""}>
          {p}
        </p>
      ))}
    </div>
  );
}
