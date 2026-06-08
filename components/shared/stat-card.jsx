import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon: Icon, hint, accent = "primary" }) {
  const accents = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    green: "bg-emerald-500/10 text-emerald-500",
    red: "bg-destructive/10 text-destructive",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("rounded-lg p-3", accents[accent])}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
