import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { STATUS_LABEL, STATUS_ORDER, STATUS_STYLES, type LeadStatus } from "@/lib/lead-types";
import { Users, TrendingUp, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LeadDesk" }] }),
  component: DashboardPage,
});

interface Stats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  last7: number;
  notes: number;
}

function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: leads }, { count: notes }] = await Promise.all([
        supabase.from("leads").select("status, created_at"),
        supabase.from("lead_notes").select("*", { count: "exact", head: true }),
      ]);
      const byStatus: Record<LeadStatus, number> = { new: 0, contacted: 0, converted: 0, lost: 0 };
      let last7 = 0;
      const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
      (leads ?? []).forEach((l: any) => {
        byStatus[l.status as LeadStatus]++;
        if (new Date(l.created_at).getTime() > cutoff) last7++;
      });
      setStats({ total: leads?.length ?? 0, byStatus, last7, notes: notes ?? 0 });
    })();
  }, []);

  const conversion =
    stats && stats.total > 0 ? Math.round((stats.byStatus.converted / stats.total) * 100) : 0;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">A snapshot of your lead pipeline.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total leads" value={stats?.total ?? "—"} accent="text-primary" />
        <StatCard
          icon={Sparkles}
          label="New this week"
          value={stats?.last7 ?? "—"}
          accent="text-info"
        />
        <StatCard
          icon={TrendingUp}
          label="Conversion rate"
          value={stats ? `${conversion}%` : "—"}
          accent="text-success"
        />
        <StatCard
          icon={MessageSquare}
          label="Notes logged"
          value={stats?.notes ?? "—"}
          accent="text-warning"
        />
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Pipeline by status</h2>
        <div className="space-y-3">
          {STATUS_ORDER.map((s) => {
            const count = stats?.byStatus[s] ?? 0;
            const pct = stats && stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={s}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[s]}`}
                  >
                    {STATUS_LABEL[s]}
                  </span>
                  <span className="text-muted-foreground">
                    {count} {count === 1 ? "lead" : "leads"}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon className={`size-4 ${accent}`} />
      </div>
      <div className="mt-3 text-3xl font-display font-semibold">{value}</div>
    </Card>
  );
}
