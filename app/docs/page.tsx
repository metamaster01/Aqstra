import { notFound, redirect } from "next/navigation";
import { getCategoryTree, getDocsNavPages } from "../../lib/queries";
import type { DocCategory, DocPage } from "../../lib/content";

/** First page in sidebar order (a group's own pages first, then its children). */
function firstPage(tree: DocCategory[], byCat: Map<string, DocPage[]>): DocPage | null {
  for (const cat of tree) {
    const own = byCat.get(cat.id)?.[0];
    if (own) return own;
    const nested = firstPage(cat.children ?? [], byCat);
    if (nested) return nested;
  }
  return null;
}

/** /docs has no content of its own — send people to the first page. */
export default async function DocsIndex() {
  const [tree, pages] = await Promise.all([getCategoryTree("docs"), getDocsNavPages()]);

  const byCat = new Map<string, DocPage[]>();
  for (const p of pages) {
    if (!p.categoryId) continue;
    byCat.set(p.categoryId, [...(byCat.get(p.categoryId) ?? []), p]);
  }

  const first = firstPage(tree, byCat);
  if (!first) notFound();
  redirect(`/docs/${first.slug}`);
}