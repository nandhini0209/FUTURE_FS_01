import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Users, LogOut, Inbox } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">Access restricted</h1>
          <p className="text-sm text-muted-foreground">
            Your account doesn't have admin access. Contact an administrator.
          </p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/leads", label: "Leads", icon: Users },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="px-6 py-5 border-b">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              L
            </div>
            <div>
              <div className="font-display font-semibold leading-tight">LeadDesk</div>
              <div className="text-xs text-muted-foreground">Mini CRM</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t space-y-2">
          <div className="px-3 py-2 text-xs">
            <div className="text-muted-foreground">Signed in as</div>
            <div className="truncate font-medium">{user.email}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="size-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="md:hidden border-b bg-card px-4 py-3 flex items-center gap-3">
          <Inbox className="size-5 text-primary" />
          <span className="font-display font-semibold">LeadDesk</span>
          <div className="ml-auto flex gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-xs px-2 py-1 rounded hover:bg-accent">
                {n.label}
              </Link>
            ))}
            <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
