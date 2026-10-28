# Shorepoint Technologies

A responsive, dark agency website built with Next.js App Router, TypeScript, Tailwind CSS 4, and Lucide React. No database, authentication, payments, analytics, or external font requests.

## Run locally

Use Node.js 22 LTS or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production server:

```sh
npm run build
npm start
```

## Checks

```sh
npm run typecheck
npm run lint
npm run build
```

If a restricted environment prevents Turbopack from binding its internal worker port, use `npm run build -- --webpack`.

## Structure

- `src/app`: root layout, SEO metadata, homepage, global styles, original SVG favicon.
- `src/components`: navigation, brand, hero, services, project showcases, about, contact, inquiry form, footer.
- `src/lib/inquiry.ts`: typed inquiry model and validation, independent of the form UI.

Major sections render as server components. Only navigation and the inquiry form require client JavaScript. Visuals use CSS, original SVG, and Lucide icons. Interface concepts use illustrative sample content and are not screenshots or representations of completed product features.

## Inquiry behavior

The form validates name, business, email, project type, and a description of at least 20 characters. It displays inline errors, focuses the first invalid field, and announces the demo result. It performs no network request and uses no persistent storage. Refreshing the page clears entered information. Connect a server action or API at the marked integration boundary in `inquiry-form.tsx`; validate on the server as well before enabling real submissions.

## Content and launch notes

- Square POS integration for Yellow Dog Coffee is explicitly planned, not complete.
- Marketing Agency CMS is labeled Client Project; no deployment or savings claims are made.
- Replace the labeled concepts only with approved screenshots and client permission.
- Before public launch, connect and test a real inquiry backend and revise the demo copy. Set canonical and social image URLs once a real domain and approved sharing image are available.
- Dependency versions are pinned with a lockfile. Registry access was unavailable during implementation, so versions came from locally available packages and cache; newest stable releases could not be confirmed. Review updates with `npm outdated` when online.
- Animations and smooth scrolling honor reduced-motion preferences. The page includes a skip link, semantic landmarks, explicit form labels, focus indicators, and an Escape-dismissable mobile menu.

## Implementation verification

- `npm run typecheck`: passed.
- `npm run lint`: passed with no warnings.
- `npm run build -- --webpack`: production compilation and static generation passed.
- Inquiry validation smoke check: accepted a valid inquiry and rejected all five invalid fields.
- Standard Turbopack build and browser preview were blocked by this environment's port-binding restriction (`EPERM`). Visual browser QA remains outstanding.
- Initial online dependency installation failed with registry DNS resolution errors. Local packages/cache supplied dependencies; a clean online `npm ci` has not been verified here.
