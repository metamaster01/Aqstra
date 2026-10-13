"use client";

import { useState } from "react";
import { MediaLibrary } from "./media-library";
import { MediaUploader } from "./media-uploader";
import { inputClass } from "@/components/admin/ui";
import type { MediaFolder } from "@/lib/admin/media-config";

/** The /admin/media screen: upload at the top, browse and delete below. */
export function MediaManager() {
  const [folder, setFolder] = useState<MediaFolder>("resources");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8">
      <section aria-labelledby="upload-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="upload-title" className="font-display font-bold" style={{ margin: 0, fontSize: 16 }}>
            Upload
          </h2>
          <label className="flex items-center gap-2 text-[13px] text-muted">
            Save to
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as MediaFolder)}
              className={`${inputClass} w-auto`}
            >
              <option value="resources">Resources folder</option>
              <option value="docs">Docs folder</option>
            </select>
          </label>
        </div>
        <MediaUploader folder={folder} onUploaded={() => setRefreshKey((k) => k + 1)} />
      </section>

      <section aria-labelledby="library-title">
        <h2 id="library-title" className="font-display mb-3 font-bold" style={{ margin: "0 0 12px", fontSize: 16 }}>
          Library
        </h2>
        <MediaLibrary refreshKey={refreshKey} />
      </section>
    </div>
  );
}
