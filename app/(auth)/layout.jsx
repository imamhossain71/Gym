import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="grid flex-1 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary via-primary/80 to-accent p-10 text-white lg:flex">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Dumbbell className="h-7 w-7" />
            FitHub
          </Link>
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">
              Run your gym.
              <br />
              Grow your members.
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              Members, attendance, payments, diet plans, trainers and
              analytics — all in one platform built for modern fitness centers.
            </p>
          </div>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} FitHub. All rights reserved.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-primary lg:hidden"
            >
              <Dumbbell className="h-6 w-6" />
              FitHub
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
