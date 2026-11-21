import { StoryCardSkeleton } from "@/components/news/states";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:px-14" aria-busy="true" aria-label="Loading news">
      <div className="mb-10 h-14 w-2/3 max-w-xl animate-pulse rounded-xl bg-foreground/10" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <StoryCardSkeleton key={i} />)}</div>
    </div>
  );
}
