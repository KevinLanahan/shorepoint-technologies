import { inquiryLimits, validateInquiry, type ProjectInquiry } from "../inquiry";

export class ContactRequestError extends Error {
  constructor(public status: number, message: string, public errors?: ReturnType<typeof validateInquiry>) { super(message); }
}

const MAX_BODY_BYTES = 32 * 1024;
export async function readContactRequest(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new ContactRequestError(415, "Please submit the contact form as JSON.");
  }
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) {
    throw new ContactRequestError(413, "Your inquiry is too large. Please shorten the description.");
  }
  if (!request.body) throw new ContactRequestError(400, "Please include your inquiry details.");
  const reader = request.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let body: unknown;
  try {
    const read = async () => {
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) throw new ContactRequestError(413, "Your inquiry is too large. Please shorten the description.");
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    };
    body = await Promise.race([read(), new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new ContactRequestError(408, "The request took too long. Please try again.")), 5000);
    })]);
  } catch (error) {
    void reader.cancel().catch(() => {});
    if (error instanceof ContactRequestError) throw error;
    throw new ContactRequestError(400, "We couldn’t read your inquiry. Please try again.");
  } finally { clearTimeout(timer); reader.releaseLock(); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ContactRequestError(400, "Please include valid inquiry details.");
  const record = body as Record<string, unknown>;
  const keys = [...Object.keys(inquiryLimits), "website", "submissionId"];
  if (Object.keys(record).some(key => !keys.includes(key)) || keys.some(key => typeof record[key] !== "string")) {
    throw new ContactRequestError(400, "Please include all the required form fields.");
  }
  if ((record.website as string).length > 200 || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(record.submissionId as string)) {
    throw new ContactRequestError(400, "Please refresh the page and try again.");
  }
  if (record.website) throw new ContactRequestError(400, "We couldn’t submit this inquiry. Please try again.");
  const inquiry = Object.fromEntries(Object.keys(inquiryLimits).map(key => [key, record[key]])) as unknown as ProjectInquiry;
  // Validate raw values first so trimming cannot conceal CRLF/header injection or oversize inputs.
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length) throw new ContactRequestError(422, "Please check the highlighted fields.", errors);
  for (const key of Object.keys(inquiryLimits) as (keyof ProjectInquiry)[]) {
    inquiry[key] = inquiry[key].trim().normalize("NFC");
  }
  inquiry.description = inquiry.description.replace(/\r\n?/g, "\n");
  const normalizedErrors = validateInquiry(inquiry);
  if (Object.keys(normalizedErrors).length) throw new ContactRequestError(422, "Please check the highlighted fields.", normalizedErrors);
  return { inquiry, submissionId: record.submissionId as string };
}
