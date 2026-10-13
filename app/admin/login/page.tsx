import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminState, safeNext } from "@/lib/admin/auth";

export const metadata = { title: "Sign in" };

const NOTICES: Record<string, string> = {
  "signed-out": "You've been signed out.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNext(sp.next);

  const state = await getAdminState();
  if (state.status === "admin") redirect(next);

  const notice =
    state.status === "forbidden"
      ? "That account doesn't have admin access. Sign in with a different account."
      : sp.reason
        ? NOTICES[sp.reason]
        : undefined;

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3f6fb] to-background dark:hidden" />
        <div className="absolute inset-0 hidden dark:block">
          <div className="absolute -top-32 left-1/2 h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-[#3a3690]/35 blur-[130px]" />
        </div>
      </div>

      <div className="w-full max-w-[400px]">
        <div className="mb-7 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary dark:text-[#8aa4ff]">
            <LockKeyhole className="size-5" aria-hidden />
          </span>
          <p className="mt-4 font-display text-[22px] font-extrabold tracking-tight">AQSTRA</p>
          <h1 className="mt-1 text-[14px] font-medium text-muted">Admin sign in</h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_24px_60px_-34px_rgba(37,99,235,0.35)] sm:p-8 dark:border-white/15 dark:bg-white/[0.03] dark:shadow-none">
          <LoginForm next={next} notice={notice} />
        </div>

        <p className="mt-6 text-center text-[12px] text-muted">Authorized personnel only.</p>
      </div>
    </main>
  );
}
