/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the real route and validation; only external SDK/network boundaries are mocked.
function harness({ providerError = false, rate = 0, storeFails = false, env = {} } = {}) {
  const sends = [], commands = [], cache = new Map();
  const environment = { NODE_ENV: 'production', VERCEL: '1', RESEND_API_KEY: 'test-key', CONTACT_EMAIL: 'destination@example.com', RESEND_FROM_EMAIL: 'sender@example.com', UPSTASH_REDIS_REST_URL: 'https://redis.example.com', UPSTASH_REDIS_REST_TOKEN: 'test-token', ...env };
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = { exports: {} }; cache.set(filename, loaded);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const customRequire = specifier => {
      if (specifier === 'resend') return { Resend: class {
        emails = { send: async (...args) => { sends.push(args); return providerError ? { data: null, error: { message: 'SECRET provider error' } } : { data: { id: 'test-id' }, error: null }; } };
      } };
      if (specifier.startsWith('@/')) return load(path.join('src', specifier.slice(2)) + '.ts');
      if (specifier.startsWith('.')) return load(path.resolve(path.dirname(filename), specifier) + '.ts');
      return require(specifier);
    };
    const context = { module: loaded, exports: loaded.exports, require: customRequire, Request, Response, URL, TextDecoder, Uint8Array, AbortSignal, setTimeout, clearTimeout, process: { env: environment }, console: { error() {} }, fetch: async (_url, options) => {
      commands.push(JSON.parse(options.body));
      if (storeFails) throw new Error('SECRET redis error');
      return Response.json({ result: rate });
    } };
    vm.runInNewContext(code, context, { filename });
    return loaded.exports;
  }
  return { route: load('src/app/api/contact/route.ts'), load, sends, commands };
}
const valid = { name: 'Alex <Owner>', business: 'Example & Company', email: 'alex@example.com', projectType: 'Custom web application', description: 'We need a scheduling tool for our small business.', website: '', submissionId: '12345678-1234-4234-8234-123456789abc' };
function request(body = valid, headers = {}) {
  return new Request('https://shorepoint.example/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://shorepoint.example', 'x-vercel-forwarded-for': '203.0.113.10', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}

test('accepts only after provider acceptance; sender, destination, replyTo and escaped details are correct', async () => {
  const h = harness(); const result = await h.route.POST(request());
  assert.equal(result.status, 200); assert.equal((await result.json()).success, true);
  assert.equal(h.sends.length, 1);
  const [email] = h.sends[0];
  assert.equal(email.from, 'Shorepoint Technologies <sender@example.com>');
  assert.equal(email.to[0], 'destination@example.com'); assert.equal(email.replyTo, valid.email);
  assert.ok(email.html.includes('Alex &lt;Owner&gt;')); assert.ok(email.html.includes('Example &amp; Company'));
  for (const key of ['name', 'business', 'email', 'projectType', 'description']) assert.ok(email.text.includes(valid[key]));
  assert.equal(h.commands[0][0], 'EVAL'); assert.ok(!h.commands[0].join(' ').includes('203.0.113.10'));
});
test('same submission and contents reuse provider idempotency key', async () => {
  const h = harness(); await h.route.POST(request()); await h.route.POST(request());
  assert.equal(h.sends[0][1].idempotencyKey, h.sends[1][1].idempotencyKey);
});
test('rejects malformed JSON, arrays, unexpected keys and non-string fields', async () => {
  const h = harness();
  for (const body of ['{', '[]', { ...valid, name: {} }, { ...valid, extra: 'field' }]) assert.equal((await h.route.POST(request(body))).status, 400);
  assert.equal(h.sends.length, 0);
});
test('rejects honeypot and invalid submission identifiers without sending', async () => {
  const h = harness();
  for (const body of [{ ...valid, website: 'spam' }, { ...valid, submissionId: 'invalid' }]) assert.equal((await h.route.POST(request(body))).status, 400);
  assert.equal(h.sends.length, 0);
});
test('enforces allowlisted project type, lengths, email format and header injection protection', async () => {
  const h = harness();
  for (const patch of [{ name: 'a'.repeat(101) }, { business: 'b'.repeat(151) }, { email: 'not an email' }, { email: 'alex@example.com\r\nBcc: bad@example.com' }, { name: 'Alex\n' }, { projectType: 'unknown' }, { description: 'short' }, { description: 'x'.repeat(5001) }]) {
    assert.equal((await h.route.POST(request({ ...valid, ...patch }))).status, 422);
  }
  assert.equal(h.sends.length, 0);
});
test('enforces body byte limit with and without Content-Length', async () => {
  const h = harness();
  assert.equal((await h.route.POST(request(valid, { 'content-length': '32769' }))).status, 413);
  assert.equal((await h.route.POST(request(' '.repeat(32769)))).status, 413);
});
test('rejects cross-origin and non-JSON requests', async () => {
  const h = harness();
  assert.equal((await h.route.POST(request(valid, { origin: 'https://other.example' }))).status, 403);
  assert.equal((await h.route.POST(request(valid, { 'content-type': 'text/plain' }))).status, 415);
});
test('rate limit returns 429 and retry header without sending', async () => {
  const h = harness({ rate: 600 }); const result = await h.route.POST(request());
  assert.equal(result.status, 429); assert.equal(result.headers.get('retry-after'), '600'); assert.equal(h.sends.length, 0);
});
test('store outage fails closed and hides internal details', async () => {
  const h = harness({ storeFails: true }); const result = await h.route.POST(request());
  assert.equal(result.status, 503); assert.ok(!(await result.text()).includes('SECRET')); assert.equal(h.sends.length, 0);
});
test('provider rejection never displays success or internal errors', async () => {
  const h = harness({ providerError: true }); const result = await h.route.POST(request());
  assert.equal(result.status, 502); const body = await result.json(); assert.notEqual(body.success, true); assert.ok(!JSON.stringify(body).includes('SECRET'));
});
test('missing configuration fails without calling provider', async () => {
  const h = harness({ env: { RESEND_API_KEY: '' } }); assert.equal((await h.route.POST(request())).status, 503); assert.equal(h.sends.length, 0);
});
test('production does not trust arbitrary forwarding headers outside Vercel', async () => {
  const h = harness({ env: { VERCEL: '' } }); assert.equal((await h.route.POST(request())).status, 503); assert.equal(h.sends.length, 0);
});
