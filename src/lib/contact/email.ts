import type { ProjectInquiry } from "../inquiry";

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

export function inquiryEmail(inquiry: ProjectInquiry) {
  const fields = [["Name", inquiry.name], ["Business", inquiry.business], ["Email", inquiry.email], ["Project type", inquiry.projectType], ["Project description", inquiry.description]];
  const text = `Shorepoint Technologies — New project inquiry\n\n${fields.map(([label, value]) => `${label}\n${value}`).join("\n\n")}\n\nReply to this email to contact the customer.`;
  const contactCell = ([label, value]: string[]) => `<td class="contact-cell" width="50%" valign="top" style="width:50%;padding:0 12px 16px 0;vertical-align:top"><p style="margin:0 0 4px;font-size:11px;line-height:16px;font-weight:bold;letter-spacing:0.4px;color:#71627f">${label}</p><p style="margin:0;font-size:14px;line-height:21px;color:#27212e;word-wrap:break-word;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(value)}</p></td>`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New project inquiry</title>
<style>@media screen and (max-width:480px){.contact-cell{display:block!important;width:100%!important;padding:0 0 14px!important}}</style>
</head>
<body style="margin:0;padding:0;background:#eeecf2;font-family:Arial,Helvetica,sans-serif;color:#27212e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eeecf2" style="width:100%;background:#eeecf2">
<tr><td align="center" style="padding:20px 10px">
<!--[if mso]><table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:580px;table-layout:fixed;border:1px solid #ded8e5;background:#ffffff">
<tr><td bgcolor="#1c1b21" style="padding:19px 22px 20px;background:#1c1b21;border-top:3px solid #aa79ec">
<p style="margin:0 0 9px;color:#d8b9ff;font-size:11px;line-height:16px;font-weight:bold;letter-spacing:0.8px">SHOREPOINT TECHNOLOGIES</p>
<h1 style="margin:0;color:#f4eff8;font-size:22px;line-height:28px;font-weight:600">New project inquiry</h1>
</td></tr>
<tr><td style="padding:20px 22px 4px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed">
<tr>${fields.slice(0, 2).map(contactCell).join("")}</tr>
<tr>${fields.slice(2, 4).map(contactCell).join("")}</tr>
</table>
</td></tr>
<tr><td style="padding:0 22px 20px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed">
<tr><td style="border-top:1px solid #e5deec;padding-top:16px">
<h2 style="margin:0 0 9px;color:#614581;font-size:12px;line-height:18px;font-weight:bold">Project description</h2>
<p style="margin:0;color:#27212e;font-size:14px;line-height:22px;word-wrap:break-word;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(inquiry.description).replace(/\r\n|\r|\n/g, "<br>")}</p>
</td></tr></table>
</td></tr>
<tr><td bgcolor="#f5f2f8" style="padding:12px 22px;border-top:1px solid #e5deec;background:#f5f2f8;color:#71627f;font-size:12px;line-height:18px">Reply directly to this email to contact the customer.</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`;
  return { text, html };
}
