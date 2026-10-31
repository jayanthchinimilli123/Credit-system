import { Link } from "react-router-dom";
import {
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  FileSearch,
  ScrollText,
  ArrowRight,
  CheckCircle2,
  Gauge,
  Lock,
  Scale,
  Database,
} from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/LeadForm";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";

const features = [
  {
    icon: Sparkles,
    title: "AI credit recommendations",
    body: "Summarized risk, a suggested limit, and a confidence score for every application, so reviewers start from a clear, structured view.",
  },
  {
    icon: FileSearch,
    title: "Explainable source context",
    body: "Every recommendation shows where it came from: ERP payment history, invoice aging, trade references, and policy matches.",
  },
  {
    icon: ShieldCheck,
    title: "Human decision controls",
    body: "Accept, edit, decline, override, escalate, or request more information. AI never finalizes a credit decision on its own.",
  },
  {
    icon: ScrollText,
    title: "Full audit and policy trail",
    body: "Every AI and human action is recorded with timestamps and reasons, and checked against your credit policy rules.",
  },
];

const steps = [
  { n: "1", title: "AI analyzes the application", body: "Risk signals, exposure, and references are summarized into a recommendation." },
  { n: "2", title: "The human reviews the evidence", body: "Confidence, reasoning, and source context sit side by side for fast, confident review." },
  { n: "3", title: "The reviewer decides, and it is logged", body: "Approve, edit, decline, override, or escalate. Every decision is written to the audit trail." },
];

const stats = [
  { icon: Scale, value: "5", label: "Risk signal categories" },
  { icon: ShieldCheck, value: "6", label: "Credit policy rules" },
  { icon: ScrollText, value: "100%", label: "Decisions audited" },
  { icon: Database, value: "Live", label: "Database-backed demo" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <LayoutGrid className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <span className="text-sm font-semibold text-slate-900">CreditFlow AI</span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
            <a href="#features" className="focus-ring hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline-block">
              Features
            </a>
            <a href="#how" className="focus-ring hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline-block">
              How it works
            </a>
            <a href="#demo" className="focus-ring hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline-block">
              Request a demo
            </a>
            <LinkButton to="/app" size="sm">
              Launch live demo
              <ArrowRight className="h-3.5 w-3.5" />
            </LinkButton>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative background: soft gradient + dotted grid */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(99 102 241 / 0.12) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge tone="bg-white text-brand-700 ring-brand-600/20" className="mb-5 shadow-sm" dot>
              Human-in-the-loop credit risk review
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Review credit applications faster, with the human always in control.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              CreditFlow AI combines AI-generated risk recommendations with human approval,
              override, and audit controls, so credit managers move quickly without handing the
              final decision to a machine.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton to="/app" size="lg">
                Launch the live demo
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <a
                href="#demo"
                className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Request a demo
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No sign-up to explore
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-brand-500" /> Database-backed demo
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-slate-400" /> Sample data only
              </span>
            </div>
          </div>

          {/* Hero product visual */}
          <div className="relative lg:pl-6">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-600 shadow-card">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-semibold text-slate-900">{s.value}</div>
              <div className="mt-0.5 text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Built for credit managers, not chatbots
            </h2>
            <p className="mt-3 text-slate-600">
              A focused review workspace where AI assists, evidence is visible, and the human
              makes the call.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-panel"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase: AI recommendation explained */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <Badge tone="bg-brand-50 text-brand-700 ring-brand-600/20" className="mb-4">
              Explainable by design
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Every recommendation shows its reasoning
            </h2>
            <p className="mt-3 text-slate-600">
              AI summarizes the risk, suggests a limit, and pairs a confidence score with the
              evidence behind it. The reviewer sees exactly why, then decides.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Confidence is always paired with reasoning",
                "Source context links back to ERP, invoices, and references",
                "Overrides require a reason note for the audit trail",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendation card mockup */}
          <div className="rounded-2xl border border-brand-200/70 bg-white p-6 shadow-panel">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">AI Recommendation</div>
                  <div className="text-[11px] text-slate-400">Requires human review</div>
                </div>
              </div>
              <Badge tone="bg-amber-50 text-amber-700 ring-amber-600/20">Medium risk</Badge>
            </div>

            <div className="mt-5">
              <div className="text-[11px] uppercase tracking-wide text-slate-400">Recommendation</div>
              <div className="text-lg font-semibold text-slate-900">Approve with adjusted limit</div>
              <div className="mt-1 text-sm text-slate-600">
                Requested $250,000, suggested <span className="font-medium text-brand-700">$175,000</span>
              </div>
            </div>

            <div className="mt-5">
              <ConfidenceIndicator value={84} />
            </div>

            <div className="mt-5 rounded-lg bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
              Strong payment history over the last 12 months, but recent invoice aging and higher
              order volume create moderate exposure. Approve with a reduced limit until two more
              payment cycles complete.
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white">
                <CheckCircle2 className="h-3.5 w-3.5" /> Accept
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700">
                Edit limit
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700">
                Escalate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              How it works
            </h2>
          </div>
          <div className="relative mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <LinkButton to="/app" size="lg">
              Explore the workspace
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Demo / lead capture */}
      <section id="demo" className="scroll-mt-20 border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-24 lg:grid-cols-2">
          <div className="lg:pr-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Request a personalized demo
            </h2>
            <p className="mt-3 text-slate-600">
              See how CreditFlow AI fits your credit review workflow. Tell us a little about your
              team and we will be in touch.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Walkthrough of the human-in-the-loop review flow",
                "How AI recommendations stay explainable and auditable",
                "Connecting policy rules to real approval thresholds",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-white">
              <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2.2} />
            </div>
            <span className="font-medium text-slate-700">CreditFlow AI</span>
          </div>
          <p className="text-center">Prototype with sample data. Built with React, Vercel, and Neon Postgres.</p>
          <Link to="/app" className="focus-ring rounded font-medium text-brand-600 hover:text-brand-700">
            Launch demo
          </Link>
        </div>
      </footer>
    </div>
  );
}
