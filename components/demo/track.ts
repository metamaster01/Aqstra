import type { DemoEventType } from "@/lib/demo/types";

/** Fire-and-forget: records a buying signal against the visitor's demo request. Never blocks the UI. */
export function trackDemoEvent(type: DemoEventType, meta?: Record<string, string | number>) {
  try {
    void fetch("/api/demo/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, meta }),
      keepalive: true,
    });
  } catch {
    /* tracking must never break the demo */
  }
}
