import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Tag,
  Trash2,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import {
  STATUS_LABEL,
  STATUS_ORDER,
  STATUS_STYLES,
  type Lead,
  type LeadNote,
  type LeadStatus,
} from "@/lib/lead-types";

export const Route = createFileRoute("/_app/leads/$id")({
  head: () => ({ meta: [{ title: "Lead — LeadDesk" }] }),
  component: LeadDetailPage,
});

function LeadDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: leadData, error: leadErr }, { data: notesData }] = await Promise.all([
      supabase.from("leads").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
    ]);
    if (leadErr) toast.error(leadErr.message);
    setLead((leadData as Lead) ?? null);
    setNotes((notesData as LeadNote[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function changeStatus(status: LeadStatus) {
    if (!lead) return;
    const prev = lead.status;
    setLead({ ...lead, status });
    const { error } = await supabase.from("leads").update({ status }).eq("id", lead.id);
    if (error) {
      setLead({ ...lead, status: prev });
      toast.error(error.message);
    } else {
      toast.success(`Marked as ${STATUS_LABEL[status]}`);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim() || !lead) return;
    setSavingNote(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("lead_notes").insert({
      lead_id: lead.id,
      content: noteText.trim(),
      author_id: userData.user?.id,
    });
    setSavingNote(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNoteText("");
    load();
  }

  async function deleteNote(noteId: string) {
    const { error } = await supabase.from("lead_notes").delete().eq("id", noteId);
    if (error) toast.error(error.message);
    else {
      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success("Note deleted");
    }
  }

  async function deleteLead() {
    if (!lead) return;
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Lead deleted");
    navigate({ to: "/leads" });
  }

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  }

  if (!lead) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground mb-4">Lead not found.</p>
        <Link to="/leads">
          <Button variant="outline">Back to leads</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <Link
        to="/leads"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4 mr-1" /> All leads
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: lead info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-gradient-to-br from-primary to-[oklch(0.32_0.14_280)] text-primary-foreground grid place-items-center font-display text-2xl font-semibold">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="mt-3 text-xl font-display font-semibold">{lead.name}</h1>
              <span
                className={`mt-2 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border ${STATUS_STYLES[lead.status]}`}
              >
                {STATUS_LABEL[lead.status]}
              </span>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <InfoRow icon={Mail} label="Email">
                <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                  {lead.email}
                </a>
              </InfoRow>
              {lead.phone && (
                <InfoRow icon={Phone} label="Phone">
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </InfoRow>
              )}
              {lead.company && (
                <InfoRow icon={Building2} label="Company">
                  {lead.company}
                </InfoRow>
              )}
              {lead.source && (
                <InfoRow icon={Tag} label="Source">
                  {lead.source}
                </InfoRow>
              )}
              <InfoRow icon={Calendar} label="Received">
                {format(new Date(lead.created_at), "PP · p")}
              </InfoRow>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Update status
              </div>
              <Select value={lead.status} onValueChange={(v) => changeStatus(v as LeadStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-4 mr-2" />
                  Delete lead
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the lead and all of its notes. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteLead} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>

        {/* Right: message + notes */}
        <div className="lg:col-span-2 space-y-4">
          {lead.message && (
            <Card className="p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Original message
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{lead.message}</p>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Notes & follow-ups</h2>
            <form onSubmit={addNote} className="flex gap-2 mb-6">
              <Textarea
                rows={2}
                placeholder="Log a call, meeting, or next step…"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="resize-none"
              />
              <Button type="submit" disabled={savingNote || !noteText.trim()}>
                <Send className="size-4" />
              </Button>
            </form>

            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No notes yet. Add one above.
              </p>
            ) : (
              <ol className="relative border-l-2 border-border ml-2 space-y-5">
                {notes.map((n) => (
                  <li key={n.id} className="ml-5 relative group">
                    <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{n.content}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
                        title="Delete note"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate">{children}</div>
      </div>
    </div>
  );
}
