import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/** Get the current session in Server Components / route handlers. */
export function auth() {
  return getServerSession(authOptions);
}

/**
 * Require an authenticated user, optionally restricted to specific roles.
 * Redirects to /login (or the user's home) when the check fails.
 */
export async function requireUser(allowedRoles) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    const home = {
      super_admin: "/admin",
      gym_admin: "/admin",
      trainer: "/trainer",
      member: "/member",
    };
    redirect(home[session.user.role] || "/");
  }
  return session.user;
}
