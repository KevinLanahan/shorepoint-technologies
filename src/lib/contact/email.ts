import type { ProjectInquiry } from "../inquiry";

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

export function inquiryEmail(inquiry: ProjectInquiry) {
  const fields = [["Name", inquiry.name], ["Business", inquiry.business], ["Email", inquiry.email], ["Project type", inquiry.projectType], ["Project description", inquiry.description]];
  const text = `Shorepoint Technologies — New project inquiry\n\n${fields.map(([label, value]) => `${label}\n${value}`).join("\n\n")}\n\nReply to this email to contact the customer.`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>New project inquiry</title></head><body style="margin:0;background:#f4f7fa;font-family:Arial,Helvetica,sans-serif;color:#0a1220"><div style="max-width:600px;margin:32px auto;background:#fff;border:1px solid #d7e0e8"><header style="background:#0a1220;padding:28px;color:#f4f7fa"><p style="color:#58c9e8;font-size:12px;letter-spacing:2px">SHOREPOINT TECHNOLOGIES</p><h1 style="font-size:24px;font-weight:500">New project inquiry</h1></header><main style="padding:28px">${fields.map(([label,value]) => `<h2 style="font-size:12px;color:#42576b;margin:24px 0 8px">${label}</h2><p style="font-size:16px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;margin:0">${escapeHtml(value)}</p>`).join("")}<p style="margin-top:32px;padding-top:20px;border-top:1px solid #d7e0e8;font-size:13px;color:#42576b">Reply to this email to contact the customer.</p></main></div></body></html>`;
  return { text, html };
}
