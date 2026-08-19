# Portfolio — Brooke A. Mendez

Personal portfolio site built with [Astro](https://astro.build) and
[Tailwind CSS v4](https://tailwindcss.com). Static output, no client framework, ~2 KB of
inlined JS (theme toggle, mobile menu, scroll reveal).

## ⚠️ Two files you still need to add

Both are optional-by-design: the site hides the related UI until the file exists, so it
never ships a broken link. `npm run build` prints a warning naming anything missing.

| File                | What it enables                                              |
| ------------------- | ------------------------------------------------------------ |
| `public/avatar.jpg` | Headshot in the hero, plus the `og:image` used in link previews |
| `public/resume.pdf` | The "Resume" download buttons in the hero and Contact section |

Drop them in with exactly those names and rebuild — no code changes needed. Or let the
helper script do it, which also converts a PNG/WebP headshot to JPEG and refuses files whose
contents don't match their extension:

```powershell
# pick from a list of likely files in Downloads / Desktop / Pictures / Documents
.\scripts\add-assets.ps1

# or point it straight at them
.\scripts\add-assets.ps1 -Photo "$HOME\Downloads\headshot.jpg" -Resume "$HOME\Downloads\Brooke_A_Mendez.pdf"
```

## Commands

| Command           | Action                                |
| ----------------- | ------------------------------------- |
| `npm install`     | Install dependencies                  |
| `npm run dev`     | Dev server at `http://localhost:4321` |
| `npm run build`   | Build the static site to `./dist/`    |
| `npm run preview` | Preview the production build          |
| `npm run check`   | Type-check all Astro/TS files         |

## Editing content

**All site content lives in [`src/data/profile.ts`](src/data/profile.ts).** That's the only
file you need to touch — identity, about, experience, projects, skills, education,
certifications, and social links.

Conventions worth knowing:

- **Sections auto-hide.** Empty an array (`export const projects = []`) and both the section
  and its nav link disappear. No other edits needed.
- **`end: 'Present'`** marks a role as current; it also feeds `worksFor` in the page's
  structured data.
- **`variant: 'break'`** renders a muted, minimal timeline entry — used for the 2023–2025
  career break so the gap reads as intentional rather than unexplained.
- **`featured: true`** makes a project card span full width and sort first. Dusty's Trail and
  Mystiqare are featured.
- **`metrics`** on a project renders the stat row (`+14%` / `add-to-cart activity`). Three
  metrics fit a featured card, two fit a half-width one.
- **`profile.phone`** is `null` on purpose — a phone number on a public page attracts
  scrapers and cold calls. Set it to `'321-615-1737'` to show it in Contact.

## Before deploying

Set `site` in [`astro.config.mjs`](astro.config.mjs) to your real domain. It drives the
canonical URL and the Open Graph tags, both of which are currently pointing at a
placeholder domain.

## Deploying

`dist/` is plain static files — any host works.

- **Netlify** — connect the repo, build command `npm run build`, publish directory `dist`.
- **Vercel** — connect the repo; the Astro preset is detected automatically.
- **GitHub Pages** — set `site` to `https://<user>.github.io` and add `base: '/<repo>'` in
  `astro.config.mjs`, then publish `dist/` via GitHub Actions.

## Structure

```
src/
├── data/profile.ts        all content
├── lib/assets.ts          build-time guard for optional /public files
├── layouts/Base.astro     <head>, SEO/OG tags, theme bootstrap, scroll reveal
├── components/
│   ├── Header.astro       sticky nav, theme toggle, mobile menu
│   ├── Hero.astro         photo, name, headline, CTAs, socials
│   ├── Section.astro      shared section shell (eyebrow + title + lede)
│   ├── About.astro
│   ├── Experience.astro   timeline, incl. project links and career break
│   ├── Projects.astro     cards with metric rows and live site links
│   ├── Skills.astro       grouped tags + certifications
│   ├── Education.astro
│   ├── Contact.astro
│   ├── Footer.astro
│   └── Icon.astro         inline SVG set
├── pages/index.astro      section order + JSON-LD Person schema
└── styles/global.css      design tokens, light/dark, motion prefs
```

## Design notes

- Theme tokens are CSS custom properties defined once in `global.css` (`--surface`, `--text`,
  `--border`, `--accent`). Dark mode redefines only those variables under `.dark`, so
  components never carry per-theme classes.
- The theme resolves in an inline `<head>` script before first paint — no flash. It follows
  `prefers-color-scheme` until the user explicitly toggles, then remembers the choice.
- Scroll-reveal is progressive enhancement: both `.no-js` and `prefers-reduced-motion` render
  everything visible immediately.
- `vite` is pinned via `overrides` in `package.json` to match the copy Astro uses. Without it,
  `@tailwindcss/vite` pulls a second, newer Vite and the two `Plugin` types conflict under
  `astro check`.
