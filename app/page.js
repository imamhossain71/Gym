import Link from "next/link";
import {
  Dumbbell,
  Users,
  CalendarCheck,
  CreditCard,
  Activity,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const FEATURES = [
  { icon: Users, title: "Member Management", desc: "Registrations, plans, ID cards & status tracking." },
  { icon: CalendarCheck, title: "Attendance", desc: "Manual or QR check-in with monthly reports." },
  { icon: CreditCard, title: "Payments & Dues", desc: "Record payments, invoices & overdue alerts." },
  { icon: Activity, title: "BMI & Diet Plans", desc: "Auto-generated diet plans by goal & BMI." },
  { icon: Dumbbell, title: "Trainer Module", desc: "Hire trainers, schedules & assignments." },
  { icon: Star, title: "Reviews & Ratings", desc: "Rate trainers and the gym with moderation." },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <Dumbbell className="h-6 w-6" />
          FitHub
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-6 py-24 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Multi-gym SaaS platform
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Everything you need to{" "}
            <span className="text-primary">run your gym</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Members, attendance, payments, diet plans, trainers and analytics —
            unified in one powerful dashboard built for modern fitness centers.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FitHub — Gym Management SaaS
      </footer>
    </div>
  );
}
