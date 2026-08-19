// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Set `site` to your final URL before deploying (used for canonical + OG tags).
export default defineConfig({
  site: 'https://brooke.example.com',
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
