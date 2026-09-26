import { redirect } from "next/navigation";
import { getAuthUser, isOwnerUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user || !isOwnerUser(user)) {
    redirect("/login?next=/owner/projects");
  }

  return <>{children}</>;
}
