import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/** Map each role to the dashboard area it owns. */
const ROLE_HOME = {
  super_admin: "/admin",
  gym_admin: "/admin",
  trainer: "/trainer",
  member: "/member",
};

/** Which path prefixes each role is allowed to access. */
const ROLE_ACCESS = {
  super_admin: ["/admin", "/trainer", "/member"], // platform owner sees all
  gym_admin: ["/admin"],
  trainer: ["/trainer"],
  member: ["/member"],
};

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;
    const role = token?.role;

    if (!role) return NextResponse.next();

    const allowed = ROLE_ACCESS[role] || [];
    const isProtected = ["/admin", "/trainer", "/member"].some((p) =>
      pathname.startsWith(p)
    );

    // Logged-in user hitting an area they don't own -> bounce to their home.
    if (isProtected && !allowed.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL(ROLE_HOME[role] || "/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Returning false here triggers a redirect to the signIn page.
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/trainer/:path*", "/member/:path*"],
};
