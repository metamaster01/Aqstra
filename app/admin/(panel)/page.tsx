import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, FolderTree, Mail, Newspaper, Plus, Target, type LucideIcon } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/admin/queries";
import { getInboxSummary } from "@/lib/admin/inbox";
import { Badge, PageHeader, btn, cardClass, formatDate } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  sub: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${cardClass} group block p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50`}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary dark:text-[#9db8ff]">
          <Icon className="size-[18px]" aria-hidden />
        </span>
        <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
      <p className="mt-4 font-display text-[28px] font-extrabold leading-none tracking-tight">{value}</p>
      <p className="mt-1.5 text-[13px] font-semibold">{label}</p>
      <p className="mt-0.5 text-[12.5px] text-muted">{sub}</p>
    </Link>
  );
}

export default async function DashboardPage() {
  const admin = await requireAdmin("/admin");
  const [data, inbox] = await Promise.all([getDashboardData(), getInboxSummary()]);

  const drafts = data.docs.drafts + data.resources.drafts;

  return (
    <>
      <PageHeader title="Dashboard" description={`Signed in as ${admin.email}.`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          icon={BookOpen}
          label="Docs"
          value={data.docs.published}
          sub={`published · ${data.docs.drafts} draft${data.docs.drafts === 1 ? "" : "s"}`}
          href="/admin/docs"
        />
        <Stat
          icon={Newspaper}
          label="Resources"
          value={data.resources.published}
          sub={`published · ${data.resources.drafts} draft${data.resources.drafts === 1 ? "" : "s"}`}
          href="/admin/resources"
        />
        <Stat icon={FolderTree} label="Categories" value={data.categories} sub="across docs and resources" href="/admin/categories" />
        <Stat
          icon={Newspaper}
          label="Drafts waiting"
          value={drafts}
          sub={drafts === 0 ? "nothing to publish" : "not visible to visitors"}
          href={data.docs.drafts >= data.resources.drafts ? "/admin/docs?status=draft" : "/admin/resources?status=draft"}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
        <Stat
          icon={Mail}
          label="Messages"
          value={inbox.messages.new}
          sub={`new · ${inbox.messages.total} in total`}
          href="/admin/messages?status=new"
        />
        <Stat
          icon={Target}
          label="Demo requests"
          value={inbox.demos.new}
          sub={`new · ${inbox.demos.total} in total`}
          href="/admin/demo-requests?status=new"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6">
        <section className={`${cardClass} p-5 sm:p-6`} aria-labelledby="recent-title">
          <h2 id="recent-title" className="font-display font-bold" style={{ fontSize: 17, margin: 0 }}>
            Recently edited
          </h2>

          {data.recent.length === 0 ? (
            <p className="mt-4 text-[14px] text-muted">Nothing here yet. Create your first page to get started.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {data.recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={p.type === "Doc" ? `/admin/docs/${p.id}` : `/admin/resources/${p.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-primary"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold">{p.title}</span>
                      <span className="mt-0.5 block text-[12.5px] text-muted">
                        {p.type} · {formatDate(p.updated_at)}
                      </span>
                    </span>
                    <Badge tone={p.published ? "success" : "warning"}>{p.published ? "Published" : "Draft"}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${cardClass} p-5 sm:p-6`} aria-labelledby="actions-title">
          <h2 id="actions-title" className="font-display font-bold" style={{ fontSize: 17, margin: 0 }}>
            Quick actions
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/admin/docs/new" className={btn("primary")}>
              <Plus className="size-4" aria-hidden /> New doc page
            </Link>
            <Link href="/admin/resources/new" className={btn("secondary")}>
              <Plus className="size-4" aria-hidden /> New resource
            </Link>
            <Link href="/admin/messages" className={btn("secondary")}>
              <Mail className="size-4" aria-hidden /> Open messages
            </Link>
            <Link href="/admin/demo-requests" className={btn("secondary")}>
              <Target className="size-4" aria-hidden /> Open demo requests
            </Link>
            <Link href="/admin/categories" className={btn("secondary")}>
              <FolderTree className="size-4" aria-hidden /> Manage categories
            </Link>
            <a href="/" target="_blank" rel="noreferrer" className={btn("ghost")}>
              <ExternalLink className="size-4" aria-hidden /> View public site
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
