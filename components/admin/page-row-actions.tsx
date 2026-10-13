"use client";

import Link from "next/link";
import { Eye, EyeOff, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { ActionForm } from "./action-form";
import { ConfirmAction } from "./confirm-action";
import { iconBtn } from "./ui";
import { deletePage, setPublished } from "@/lib/admin/page-actions";

export function PageRowActions({
  id,
  title,
  published,
  editHref,
  viewHref,
}: {
  id: string;
  title: string;
  published: boolean;
  editHref: string;
  viewHref: string;
}) {
  return (
    <div className="flex items-center justify-end">
      <Link href={editHref} aria-label={`Edit ${title}`} title="Edit" className={iconBtn}>
        <Pencil className="size-4" />
      </Link>

      {published && (
        <a href={viewHref} target="_blank" rel="noreferrer" aria-label={`View ${title} on the site`} title="View on site" className={iconBtn}>
          <ExternalLink className="size-4" />
        </a>
      )}

      <ActionForm action={setPublished} className="inline-flex">
        {(pending) => (
          <>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="publish" value={published ? "false" : "true"} />
            <button
              type="submit"
              disabled={pending}
              aria-label={published ? `Unpublish ${title}` : `Publish ${title}`}
              title={published ? "Unpublish (move to drafts)" : "Publish"}
              className={iconBtn}
            >
              {published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </>
        )}
      </ActionForm>

      <ConfirmAction
        action={deletePage}
        fields={{ id }}
        title="Delete this page?"
        message={`"${title}" and all of its sections will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete page"
        trigger={<Trash2 className="size-4" />}
        triggerLabel={`Delete ${title}`}
        triggerClassName={`${iconBtn} hover:text-red-600`}
      />
    </div>
  );
}
