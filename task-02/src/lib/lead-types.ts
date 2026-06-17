export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  lost: "Lost",
};

export const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "converted", "lost"];

export const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-info/15 text-info border-info/30",
  contacted: "bg-warning/20 text-warning-foreground border-warning/40",
  converted: "bg-success/15 text-success border-success/30",
  lost: "bg-muted text-muted-foreground border-border",
};

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_id: string | null;
  content: string;
  created_at: string;
}
