# Portfolio — Brooke A. Mendez

Personal portfolio for a senior e-commerce engineer. Built with
[Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com) — static
output, no client framework, a couple of KB of inlined JS for the theme toggle,
mobile menu, scroll-spy nav, and reading progress.

## Commands

| Command                    | Action                                              |
| -------------------------- | --------------------------------------------------- |
| `npm install`              | Install dependencies                                |
| `npm run dev`              | Dev server at `http://127.0.0.1:4321`               |
| `npm run build`            | Build the static site to `./dist/`                  |
| `npm run preview`          | Preview the production build                        |
| `npm run check`            | Type-check every Astro and TS file                  |
| `npm run optimize:avatar`  | Re-crop `public/avatar.jpg` after replacing it      |
| `npm run capture:projects` | Re-screenshot every project storefront              |
| `npm run fetch:fonts`      | Re-download the self-hosted webfonts                |

## Editing content

**All site content lives in [`src/data/profile.ts`](src/data/profile.ts)** — identity,
about, experience, projects, skills, education, and social links. Nothing else needs
touching for a content change.

Conventions worth knowing:

- **Sections auto-hide.** Empty an array (`export const projects = []`) and both the
  section and its nav link disappear.
- **`experience` must stay newest-first** — it renders as a reverse-chronological
  timeline, and the career break sits in its true date position rather than at the end,
  so the gap reads as part of the sequence.
- **`end: 'Present'`** marks a role current and feeds `worksFor` in the page's schema.
- **`metrics`** on a project renders the outcome row (`+14%` / `add-to-cart activity`).
  Three fit across; two also lay out cleanly.
- **`profile.address`** is the structured form of `profile.location`. Both exist so the
  visible text and the machine-readable schema can never drift apart.

### Replacing the photo or resume

Drop the files in as `public/avatar.jpg` and `public/resume.pdf`, or run
`scripts/add-assets.ps1`, which finds them, converts a PNG or WebP headshot to JPEG,
and refuses files whose contents do not match their extension.

After a new photo, run `npm run optimize:avatar`. It crops square around a named focal
point (`FOCUS`, `FRAME`, `PLACE_Y` at the top of the script) — sharp's built-in `top`
anchor only positions vertically, which leaves an off-centre face in a round frame.

Both assets are optional by design: [`src/lib/assets.ts`](src/lib/assets.ts) checks at
build time and hides the photo or the download buttons rather than shipping a 404. The
build prints a warning naming anything missing.

## Deploying

`dist/` is plain static files, so any static host works. The repo is set up for
Netlify: [`netlify.toml`](netlify.toml) already carries the build command, publish
directory, Node version, and cache headers, so nothing needs typing into a dashboard.

**Netlify** — netlify.com → *Add new site* → *Import an existing project* → GitHub →
pick this repo → Deploy. Every `git push` to `main` rebuilds and republishes.

**Vercel** — vercel.com → *Add New Project* → import this repo. The Astro preset is
detected automatically; `netlify.toml` is ignored.

**GitHub Pages** — workable but fiddlier: a project site is served from
`/<repo>/` rather than the domain root, so every root-relative asset path
(`/fonts/…`, `/avatar.jpg`, `/projects/…`) needs a base prefix. Prefer a host that
serves at the root, or name the repo `<user>.github.io`.

### The canonical URL

`site` in [`astro.config.mjs`](astro.config.mjs) is resolved from the environment
rather than hard-coded, because a stale value there is invisible locally and only
shows up as broken link previews after launch:

| Variable           | Set by                                  |
| ------------------ | --------------------------------------- |
| `SITE_URL`         | you — overrides everything               |
| `URL`              | Netlify, the site's primary address     |
| `DEPLOY_PRIME_URL` | Netlify, on branch and preview deploys  |

Falling back to `http://localhost:4321` for local builds.

Attaching a custom domain later needs no code change: add it in the host's dashboard
and `URL` updates itself. Only set `SITE_URL` if you need to force a specific value.

## Structure

```
src/
├── data/profile.ts        all content
├── lib/assets.ts          build-time guard for optional /public files
├── layouts/Base.astro     head, SEO/OG tags, theme bootstrap, reveal, progress bar
├── components/
│   ├── Sidebar.astro      sticky identity panel, scroll-spy nav, CTAs, socials
│   ├── Header.astro       mobile-only bar: wordmark, theme toggle, menu
│   ├── Section.astro      shared section shell (serif title + gilded rule + lede)
│   ├── About.astro
│   ├── Experience.astro   timeline, incl. project links and the career break
│   ├── Projects.astro     cards with storefront thumbnails and outcome metrics
│   ├── Skills.astro       grouped tags + certifications
│   ├── Education.astro
│   ├── Contact.astro
│   ├── Footer.astro
│   └── Icon.astro         inline SVG set
├── pages/index.astro      section order + JSON-LD Person schema
└── styles/global.css      tokens, type system, materiality, motion prefs

scripts/
├── add-assets.ps1         install a photo and resume into public/
├── optimize-avatar.mjs    square focal-point crop, retina-sized
├── capture-projects.mjs   storefront screenshots over the Chrome DevTools Protocol
└── fetch-fonts.mjs        download the webfonts and print their @font-face rules
```

## Design notes

**Layout.** Two columns from `lg` up: a sticky identity sidebar (30%, capped at 26rem)
beside a scrolling content track. Below `lg` they stack, with the sidebar becoming the
hero and the nav moving into the mobile menu.

**Type.** Cormorant Garamond for display, Jost for text, monospace retained for
technical tags. Self-hosted, latin subset only, three weights — around 114 KB versus the
380 KB Google serves across all subsets, and no third-party request on the critical path.

**Colour.** Warm porcelain and espresso grounds with a champagne-bronze accent. The
neutral ramp is warmed toward the accent; pure grey beside a warm accent reads cold.
Dark mode redefines only the tokens, so no component carries a per-theme class.

**Two border weights.** `--border` for card edges and tag pills, `--rule` a step
stronger for section dividers. At a single weight the section breaks were invisible
against the ground and one section ran into the next.

**Measure.** `.measure` caps running text at 74 characters. The shell is deliberately
wide so grids and cards can use the screen, but prose past ~75 characters is tiring.

**Motion** is transform- and opacity-only, both scroll handlers throttled to one check
per animation frame. Everything is disabled under `prefers-reduced-motion`, and the
staggered entrance has a no-JS fallback so content can never be left invisible.

**Nav highlight** uses a scroll listener rather than an `IntersectionObserver`. The
observer stops firing near the page bottom, and a "last section past the reading line"
rule can never select the final section — the page runs out of scroll first.

**Build.** `vite` is pinned via `overrides` in `package.json` to match the copy Astro
uses; without it `@tailwindcss/vite` pulls a second, newer Vite and the two `Plugin`
types conflict under `astro check`.
