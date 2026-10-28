export const projectTypes = [
  "Website redesign / modernization",
  "New business website",
  "Custom web application",
  "Mobile application",
  "AI & automation",
  "Systems integration",
  "Other",
] as const;
export const inquiryLimits = { name: 100, business: 150, email: 254, projectType: 80, description: 5000 } as const;
export interface ProjectInquiry { name: string; business: string; email: string; projectType: string; description: string }
export type InquiryErrors = Partial<Record<keyof ProjectInquiry, string>>;
export const isEmail = (email: string) => email.length <= inquiryLimits.email && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email);

export function validateInquiry(values: ProjectInquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.business.trim()) errors.business = "Please enter your business name.";
  if (!isEmail(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!projectTypes.some(type => type === values.projectType)) errors.projectType = "Please choose a project type.";
  if (values.description.trim().length < 20) errors.description = "Please tell us a little more (at least 20 characters).";
  for (const key of Object.keys(inquiryLimits) as (keyof ProjectInquiry)[]) {
    if (values[key].length > inquiryLimits[key]) errors[key] = `Please use no more than ${inquiryLimits[key]} characters.`;
    const allowedText = key === "description" ? values[key].replace(/[\n\r\t]/g, "") : values[key];
    // Reject control characters, including line breaks in email/header fields.
    if (/[\p{Cc}\p{Cf}]/u.test(allowedText)) errors[key] = "Please remove unsupported control characters.";
  }
  return errors;
}
