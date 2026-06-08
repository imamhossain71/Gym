import Link from "next/link";
import { CalendarCheck, Activity, CreditCard, Clock } from "lucide-react";
import { requireUser } from "@/lib/session";
import { connectDB } from "@/lib/db";
import { calculateBMI, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export default async function MemberDashboard() {
  const user = await requireUser(["super_admin", "member"]);

  await connectDB();
  const member = await Member.findOne({ userId: user.id }).lean();

  let attendanceThisMonth = 0;
  let nextDue = null;
  let bmi = { bmi: 0, category: "Unknown" };

  if (member) {
    const monthPrefix = new Date().toISOString().slice(0, 7); // YYYY-MM
    attendanceThisMonth = await Attendance.countDocuments({
      memberId: member._id,
      date: { $regex: `^${monthPrefix}` },
    });
    nextDue = await Payment.findOne({
      memberId: member._id,
      status: { $in: ["due", "overdue"] },
    })
      .sort({ dueDate: 1 })
      .lean();
    bmi = calculateBMI(member.weight, member.height);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user.name} 🏋️</h1>
        <p className="text-muted-foreground">Your fitness snapshot.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Membership"
          value={member?.status ? member.status : "—"}
          hint={member?.expiryDate ? `Expires ${formatDate(member.expiryDate)}` : ""}
          icon={Clock}
        />
        <StatCard
          label="Check-ins (month)"
          value={attendanceThisMonth}
          icon={CalendarCheck}
          accent="green"
        />
        <StatCard
          label="Your BMI"
          value={bmi.bmi || "—"}
          hint={bmi.category}
          icon={Activity}
          accent="accent"
        />
        <StatCard
          label="Next Due"
          value={nextDue ? formatDate(nextDue.dueDate) : "Clear"}
          icon={CreditCard}
          accent={nextDue ? "red" : "green"}
        />
      </div>

      {!member?.height && (
        <Card>
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Add your height, weight, age and goal to unlock BMI tracking and
              an auto-generated diet plan.
            </span>
            <Button asChild>
              <Link href="/member/bmi">Set up profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
