export const projectTypes = ["Custom web application", "Mobile application", "AI & automation", "Systems integration", "Something else / Not sure yet"] as const;
export interface ProjectInquiry { name: string; business: string; email: string; projectType: string; description: string }
export type InquiryErrors = Partial<Record<keyof ProjectInquiry, string>>;
export function validateInquiry(values: ProjectInquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.business.trim()) errors.business = "Please enter your business name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!projectTypes.some(type => type === values.projectType)) errors.projectType = "Please choose a project type.";
  if (values.description.trim().length < 20) errors.description = "Please tell us a little more (at least 20 characters).";
  return errors;
}
