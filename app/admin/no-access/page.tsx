import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { getAdminState } from "@/lib/admin/auth";

export const metadata = { title: "No access" };

export default async function NoAccessPage() {
  const state = await getAdminState();
  if (state.status === "anonymous") redirect("/admin/login");
  if (state.status === "admin") redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <div className="w-full max-w-[420px] rounded-2xl border border-border bg-card p-8 text-center dark:border-white/15 dark:bg-white/[0.03]">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-red-500/10 text-red-500">
          <ShieldAlert className="size-5" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-[20px] font-bold tracking-tight">No admin access</h1>
        <p className="mt-2 text-[14px] leading-[1.7] text-muted">
          {state.email ? <strong className="break-all text-foreground">{state.email}</strong> : "This account"} is signed in,
          but isn&apos;t on the admin list. Ask an owner to add you, or sign in with a different account.
        </p>
        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
