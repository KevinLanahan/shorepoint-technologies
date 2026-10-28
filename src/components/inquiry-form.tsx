"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { inquiryLimits, projectTypes, validateInquiry, type InquiryErrors, type ProjectInquiry } from "@/lib/inquiry";

export function InquiryForm() {
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const inFlight = useRef(false);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (sending) return;
    const first = Object.keys(errors)[0];
    if (first) (formRef.current?.elements.namedItem(first) as HTMLElement)?.focus();
  }, [errors, sending]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || submitted) return;
    const data = new FormData(event.currentTarget);
    const inquiry: ProjectInquiry = { name: String(data.get("name") ?? ""), business: String(data.get("business") ?? ""), email: String(data.get("email") ?? ""), projectType: String(data.get("projectType") ?? ""), description: String(data.get("description") ?? "") };
    const nextErrors = validateInquiry(inquiry);
    setErrors(nextErrors);
    setSendError("");
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) { (formRef.current?.elements.namedItem(firstError) as HTMLElement)?.focus(); return; }
    inFlight.current = true;
    setSending(true);
    try {
      const payload = JSON.stringify({ ...inquiry, website: String(data.get("website") ?? "") });
      if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...JSON.parse(payload), submissionId: attempt.current.id }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        if (result.errors && typeof result.errors === "object") {
          const fieldErrors: InquiryErrors = {};
          for (const key of Object.keys(inquiryLimits) as (keyof ProjectInquiry)[]) {
            if (typeof result.errors[key] === "string") fieldErrors[key] = result.errors[key];
          }
          setErrors(fieldErrors);
        }
        setSendError(response.status === 429
          ? "You’ve reached the inquiry limit. Please wait a little before trying again."
          : "We couldn’t send your inquiry. Your details are still here; please try again shortly.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSendError("We couldn’t confirm your inquiry was sent. Check your connection and try again. Your details are still here.");
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }
  const fieldProps = (name: keyof ProjectInquiry) => ({ id: name, name, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });
  const error = (name: keyof ProjectInquiry) => errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;
  return <div className="inquiry-shell"><div className="form-heading"><span>Tell us what you have in mind.</span></div><form ref={formRef} onSubmit={submit} noValidate aria-busy={sending} onChange={() => { if (submitted) setSubmitted(false); if (sendError) setSendError(""); }}><fieldset disabled={sending} className="inquiry-fields"><div className="contact-honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" maxLength={200}/></div><div className="form-row"><div className="field"><label htmlFor="name">Name <span>*</span></label><input {...fieldProps("name")} autoComplete="name" placeholder="Your name" required maxLength={100}/>{error("name")}</div><div className="field"><label htmlFor="business">Business name <span>*</span></label><input {...fieldProps("business")} autoComplete="organization" placeholder="Your business" required maxLength={150}/>{error("business")}</div></div><div className="field"><label htmlFor="email">Email <span>*</span></label><input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@yourbusiness.com" required maxLength={254}/>{error("email")}</div><div className="field"><label htmlFor="projectType">Project type <span>*</span></label><select {...fieldProps("projectType")} required defaultValue=""><option value="" disabled>Select a project type</option>{projectTypes.map(type=><option key={type}>{type}</option>)}</select>{error("projectType")}</div><div className="field"><label htmlFor="description">A little about your project <span>*</span></label><textarea {...fieldProps("description")} placeholder="What are you looking to build or improve?" rows={4} minLength={20} maxLength={5000} required/>{error("description")}</div></fieldset><p className="form-disclaimer">Your details will be emailed to Shorepoint Technologies so we can respond to your inquiry.</p><button className="button submit-button" type="submit" disabled={sending || submitted}>{sending ? "Sending Inquiry…" : submitted ? "Inquiry Sent" : "Send Project Inquiry"}{sending ? <LoaderCircle size={17} className="sending-icon"/> : <ArrowUpRight size={17}/>}</button>{sendError && <p className="field-error send-error" role="alert">{sendError}</p>}<div role="status" aria-live="polite">{submitted && <p className="form-success"><CheckCircle2 size={19}/><span>Your inquiry has been accepted for delivery. Thank you for getting in touch.</span></p>}</div></form></div>;
}
