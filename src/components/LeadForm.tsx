import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { api, type LeadPayload } from "@/lib/api";
import { Button } from "./ui/Button";
import { FieldGroup, Input, Select, Textarea } from "./ui/Field";

const teamSizes = ["1-10", "11-50", "51-200", "201-1,000", "1,000+"];

export function LeadForm() {
  const [form, setForm] = useState<LeadPayload>({
    name: "",
    email: "",
    company: "",
    role: "",
    teamSize: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof LeadPayload>(key: K, value: LeadPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await api.submitLead(form);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">Thanks, {form.name.split(" ")[0]}!</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          Your demo request has been received and saved. Our team will reach out at{" "}
          <span className="font-medium text-slate-800">{form.email}</span> shortly.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() => {
            setForm({ name: "", email: "", company: "", role: "", teamSize: "", message: "" });
            setStatus("idle");
          }}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Request a demo">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Full name" htmlFor="lead-name">
          <Input
            id="lead-name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </FieldGroup>
        <FieldGroup label="Work email" htmlFor="lead-email">
          <Input
            id="lead-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </FieldGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Company" htmlFor="lead-company">
          <Input
            id="lead-company"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </FieldGroup>
        <FieldGroup label="Your role" htmlFor="lead-role">
          <Input
            id="lead-role"
            value={form.role}
            placeholder="e.g. Credit Manager"
            onChange={(e) => set("role", e.target.value)}
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Team size" htmlFor="lead-team">
        <Select
          id="lead-team"
          value={form.teamSize}
          onChange={(e) => set("teamSize", e.target.value)}
        >
          <option value="">Select…</option>
          {teamSizes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <FieldGroup label="What would you like to see? (optional)" htmlFor="lead-message">
        <Textarea
          id="lead-message"
          value={form.message}
          placeholder="Tell us about your credit review workflow…"
          onChange={(e) => set("message", e.target.value)}
        />
      </FieldGroup>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === "submitting" ? "Submitting…" : "Request a demo"}
      </Button>
      <p className="text-center text-xs text-slate-400">
        We’ll only use your details to follow up about CreditFlow AI.
      </p>
    </form>
  );
}
