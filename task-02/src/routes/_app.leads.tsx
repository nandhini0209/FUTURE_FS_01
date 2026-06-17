import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Mail, Building2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  STATUS_LABEL,
  STATUS_ORDER,
  STATUS_STYLES,
  type Lead,
  type LeadStatus,
} from "@/lib/lead-types";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({ meta: [{ title: "Leads — LeadDesk" }] }),
  component: LeadsListPage,
});

function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company ?? "").toLowerCase().includes(q)
      );
    });
  }, [leads, search, filter]);

  const counts = useMemo(() => {
    const c: Record<LeadStatus | "all", number> = {
      all: leads.length,
      new: 0,
      contacted: 0,
      converted: 0,
      lost: 0,
    };
    leads.forEach((l) => c[l.status]++);
    return c;
  }, [leads]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            {leads.length} total · {counts.new} new · {counts.converted} converted
          </p>
        </div>
        <NewLeadDialog open={open} setOpen={setOpen} onCreated={load} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company…"
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses ({counts.all})</SelectItem>
            {STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]} ({counts[s]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-16">Loading leads…</div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="size-12 rounded-full bg-accent grid place-items-center mx-auto mb-4">
            <Mail className="size-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold">No leads yet</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
            New submissions from your contact form will land here.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="divide-y">
            {filtered.map((lead) => (
              <Link
                key={lead.id}
                to="/leads/$id"
                params={{ id: lead.id }}
                className="block px-5 py-4 hover:bg-accent/40 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary to-[oklch(0.32_0.14_280)] text-primary-foreground grid place-items-center font-semibold text-sm shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{lead.name}</span>
                      <span
                        className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border ${STATUS_STYLES[lead.status]}`}
                      >
                        {STATUS_LABEL[lead.status]}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" /> {lead.email}
                      </span>
                      {lead.company && (
                        <span className="hidden sm:flex items-center gap-1">
                          <Building2 className="size-3" /> {lead.company}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
                    <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function NewLeadDialog({
  open,
  setOpen,
  onCreated,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "manual",
    message: "",
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone || null,
      company: form.company || null,
      source: form.source || null,
      message: form.message || null,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Lead added");
    setForm({ name: "", email: "", phone: "", company: "", source: "manual", message: "" });
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Add lead
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New lead</DialogTitle>
          <DialogDescription>Capture a lead manually.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Source</Label>
              <Input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g. website, referral, event"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
