import { createHash } from "node:crypto";
import { Resend } from "resend";
import { isEmail } from "@/lib/inquiry";
import { readContactRequest, ContactRequestError } from "@/lib/contact/request";
import { checkContactRateLimit } from "@/lib/contact/rate-limit";
import { inquiryEmail } from "@/lib/contact/email";

export const runtime = "nodejs";
export const maxDuration = 30;

function reply(status: number, body: object, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  try {
    // JSON-only requests prevent ordinary cross-site form posts. Also reject cross-origin fetches.
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return reply(403, { message: "Please submit your inquiry from this website." });
    const { inquiry, submissionId } = await readContactRequest(request);
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    if (!apiKey || !to || !from || !isEmail(to) || !isEmail(from)) {
      console.error("Contact service configuration is incomplete.");
      return reply(503, { message: "The contact form is temporarily unavailable. Please try again later." });
    }
    const retryAfter = await checkContactRateLimit(request);
    if (retryAfter) return reply(429, { message: "You’ve reached the inquiry limit. Please wait a little before trying again." }, { "Retry-After": String(retryAfter) });
    // Bind the browser's retry identifier to the normalized content. No PII in the key.
    const digest = createHash("sha256").update(JSON.stringify({ inquiry, to, from })).digest("hex");
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: `Shorepoint Technologies <${from}>`,
      to: [to],
      replyTo: inquiry.email,
      subject: "New project inquiry — Shorepoint Technologies",
      ...inquiryEmail(inquiry),
    }, { idempotencyKey: `contact/${submissionId}/${digest}` });
    if (error || !data?.id) {
      console.error("Contact email was not accepted by the email provider.");
      return reply(502, { message: "We couldn’t send your inquiry. Your details are still here; please try again shortly." });
    }
    return reply(200, { success: true, message: "Your inquiry has been accepted for delivery. Thank you for getting in touch." });
  } catch (error) {
    if (error instanceof ContactRequestError) return reply(error.status, { message: error.message, errors: error.errors });
    // Do not log request contents, credentials, or provider responses.
    console.error("Contact request failed due to a service error.");
    return reply(503, { message: "We couldn’t send your inquiry right now. Your details are still here; please try again shortly." });
  }
}
