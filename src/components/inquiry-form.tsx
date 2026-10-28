"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { projectTypes, validateInquiry, type InquiryErrors, type ProjectInquiry } from "@/lib/inquiry";

export function InquiryForm() {
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const inquiry: ProjectInquiry = { name: String(data.get("name") ?? ""), business: String(data.get("business") ?? ""), email: String(data.get("email") ?? ""), projectType: String(data.get("projectType") ?? ""), description: String(data.get("description") ?? "") };
    const nextErrors = validateInquiry(inquiry);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) { (formRef.current?.elements.namedItem(firstError) as HTMLElement)?.focus(); return; }
    // Integration boundary: send validated `inquiry` to a server action or API here.
    // Demo deliberately performs no network request or persistent storage.
    setSubmitted(true);
  }
  const fieldProps = (name: keyof ProjectInquiry) => ({ id: name, name, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });
  const error = (name: keyof ProjectInquiry) => errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;
  return <div className="inquiry-shell"><div className="form-heading"><span>Tell us what you have in mind.</span><span className="demo-label">DEMO FORM</span></div><form ref={formRef} onSubmit={submit} noValidate onChange={() => { if (submitted) setSubmitted(false); }}><div className="form-row"><div className="field"><label htmlFor="name">Name <span>*</span></label><input {...fieldProps("name")} autoComplete="name" placeholder="Your name" required maxLength={100}/>{error("name")}</div><div className="field"><label htmlFor="business">Business name <span>*</span></label><input {...fieldProps("business")} autoComplete="organization" placeholder="Your business" required maxLength={150}/>{error("business")}</div></div><div className="field"><label htmlFor="email">Email <span>*</span></label><input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@yourbusiness.com" required maxLength={254}/>{error("email")}</div><div className="field"><label htmlFor="projectType">Project type <span>*</span></label><select {...fieldProps("projectType")} required defaultValue=""><option value="" disabled>Select a project type</option>{projectTypes.map(type=><option key={type}>{type}</option>)}</select>{error("projectType")}</div><div className="field"><label htmlFor="description">A little about your project <span>*</span></label><textarea {...fieldProps("description")} placeholder="What are you looking to build or improve?" rows={4} minLength={20} maxLength={5000} required/>{error("description")}</div><p className="form-disclaimer">Demo only. Your information stays in this page and is not sent, saved, or delivered to Shorepoint Technologies.</p><button className="button submit-button" type="submit">Preview Project Inquiry <ArrowUpRight size={17}/></button><div role="status" aria-live="polite">{submitted && <p className="form-success"><CheckCircle2 size={19}/><span>Demo inquiry validated. Nothing has been sent or saved. You can edit your details and preview again.</span></p>}</div></form></div>;
}
