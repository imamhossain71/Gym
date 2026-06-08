import { Users, Star, Utensils } from "lucide-react";
import { requireUser } from "@/lib/session";
import { connectDB } from "@/lib/db";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Trainer from "@/models/Trainer";
import Member from "@/models/Member";

export const dynamic = "force-dynamic";

export default async function TrainerDashboard() {
  const user = await requireUser(["super_admin", "trainer"]);

  await connectDB();
  const trainer = await Trainer.findOne({ userId: user.id }).lean();
  const assignedCount = trainer
    ? await Member.countDocuments({ trainerId: trainer._id })
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi {user.name} 💪</h1>
        <p className="text-muted-foreground">Your coaching overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned Members" value={assignedCount} icon={Users} />
        <StatCard
          label="Your Rating"
          value={trainer?.rating ? trainer.rating.toFixed(1) : "—"}
          hint={`${trainer?.reviewCount || 0} reviews`}
          icon={Star}
          accent="accent"
        />
        <StatCard
          label="Active Diet Plans"
          value={assignedCount}
          icon={Utensils}
          accent="green"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trainer workspace</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Manage your assigned members, build custom diet plans, set your
          availability, and view member reviews from the sidebar.
        </CardContent>
      </Card>
    </div>
  );
}
