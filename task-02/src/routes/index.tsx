import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Workflow, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeadDesk — Mini CRM for website leads" },
      {
        name: "description",
        content:
          "Capture leads from your contact forms, track follow-ups, and convert more customers with a focused mini CRM.",
      },
      { property: "og:title", content: "LeadDesk — Mini CRM" },
      {
        property: "og:description",
        content: "Capture, track, and convert website leads in one focused dashboard.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-5 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
              L
            </div>
            <span className="font-display font-semibold">LeadDesk</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/contact" className="px-3 py-2 hover:text-primary">
              Contact form demo
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              Admin sign in
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
            Mini CRM
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-display font-semibold tracking-tight leading-[1.05]">
            Never lose a lead from
            <br />
            <span className="bg-gradient-to-r from-primary to-[oklch(0.55_0.18_290)] bg-clip-text text-transparent">
              your website again.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            LeadDesk captures submissions from your contact forms, tracks every conversation,
            and helps your team turn inquiries into customers — fast.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
            >
              Open the CRM <ArrowRight className="size-4 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 rounded-md border bg-card font-medium hover:bg-accent transition"
            >
              Try the public form
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Feature
            icon={Sparkles}
            title="Capture instantly"
            text="Leads submitted on your contact form land in the CRM in real time."
          />
          <Feature
            icon={Workflow}
            title="Pipeline statuses"
            text="Track each lead through New, Contacted, Converted, or Lost."
          />
          <Feature
            icon={MessageSquare}
            title="Notes & follow-ups"
            text="Log every call, email, and next step on a clean timeline."
          />
          <Feature
            icon={ShieldCheck}
            title="Admin only"
            text="Role-based access keeps your data behind a secure login."
          />
        </div>
      </section>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        Built with LeadDesk · A mini CRM
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card">
      <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
