import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Utensils,
  Activity,
  Dumbbell,
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { DashboardShell } from "@/components/shared/dashboard-shell";

const NAV = [
  { href: "/member", label: "Dashboard", icon: LayoutDashboard },
  { href: "/member/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/member/payments", label: "Payments", icon: CreditCard },
  { href: "/member/diet", label: "Diet Plan", icon: Utensils },
  { href: "/member/bmi", label: "BMI Tracker", icon: Activity },
  { href: "/member/trainer", label: "My Trainer", icon: Dumbbell },
];

export default async function MemberLayout({ children }) {
  const user = await requireUser(["super_admin", "member"]);
  return (
    <DashboardShell nav={NAV} user={user} areaLabel="Member">
      {children}
    </DashboardShell>
  );
}
