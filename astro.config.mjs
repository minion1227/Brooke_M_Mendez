// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * The canonical site URL, used for the <link rel="canonical"> tag, the Open
 * Graph tags, and the absolute image URL in the Person schema.
 *
 * Resolved from the environment so the deployed build is always self-correct:
 *   SITE_URL          set this to override everything (e.g. a custom domain)
 *   URL               Netlify sets this to the site's primary address
 *   DEPLOY_PRIME_URL  Netlify sets this on branch and preview deploys
 *
 * Getting this wrong is invisible locally and only shows up as broken link
 * previews after launch, so it is worth not hard-coding.
 */
const site =
  process.env.SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  'http://localhost:4321';

export default defineConfig({
  site,
  server: {
    // Astro's default host is `localhost`, which on Windows resolves to the IPv6
    // loopback (::1) first. Browsers that try IPv4 (127.0.0.1) then get
    // ERR_CONNECTION_REFUSED. Binding explicitly keeps both reachable.
    host: '127.0.0.1',
    port: 4321,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
