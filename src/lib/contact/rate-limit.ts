import { createHmac } from "node:crypto";
import { isIP } from "node:net";

// One atomic operation keeps counters consistent across concurrent serverless instances.
// A shared hourly budget also limits abuse from rotating addresses.
export const RATE_LIMIT_SCRIPT = `
local ip = tonumber(redis.call('GET', KEYS[1]) or '0')
local total = tonumber(redis.call('GET', KEYS[2]) or '0')
if ip >= 5 then return math.max(1, redis.call('TTL', KEYS[1])) end
if total >= 50 then return math.max(1, redis.call('TTL', KEYS[2])) end
if redis.call('INCR', KEYS[1]) == 1 then redis.call('EXPIRE', KEYS[1], 600) end
if redis.call('INCR', KEYS[2]) == 1 then redis.call('EXPIRE', KEYS[2], 3600) end
return 0
`;

export async function checkContactRateLimit(request: Request): Promise<number> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || new URL(url).protocol !== "https:") throw new Error("Rate limit configuration unavailable");
  // Vercel overwrites this header. Never trust arbitrary proxy headers on other hosts.
  let identity = "local-development";
  if (process.env.VERCEL === "1") {
    identity = request.headers.get("x-vercel-forwarded-for")?.trim() ?? "";
    if (!isIP(identity)) throw new Error("Trusted client address unavailable");
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("Trusted hosting configuration unavailable");
  }
  const hash = createHmac("sha256", token).update(identity).digest("hex");
  const scope = process.env.VERCEL_ENV === "preview" ? "preview" : "main";
  const prefix = `shorepoint:contact:${scope}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", RATE_LIMIT_SCRIPT, "2", `${prefix}:ip:${hash}`, `${prefix}:hour`]),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Rate limit store unavailable");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("result" in result) || typeof result.result !== "number" || !Number.isInteger(result.result) || result.result < 0) {
    throw new Error("Invalid rate limit response");
  }
  return result.result;
}
