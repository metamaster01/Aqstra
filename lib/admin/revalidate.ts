import { revalidatePath } from "next/cache";

/** Call after any change visitors can see, so public pages never serve stale content. */
export function revalidatePublic() {
  revalidatePath("/docs", "layout");
  revalidatePath("/resources");
  revalidatePath("/resource", "layout");
}
