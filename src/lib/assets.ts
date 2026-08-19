import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { profile } from '../data/profile';

/**
 * Resolves an optional local asset at build time.
 *
 * A portfolio that ships a "Download resume" button pointing at a file nobody
 * ever added is worse than one with no button. So if the path is local and the
 * file isn't in /public, we return null and the UI hides that element instead.
 * External URLs are passed through untouched — we can't check those.
 */
function resolveLocalAsset(url: string | null, label: string): string | null {
  if (!url) return null;
  if (!url.startsWith('/')) return url;

  const path = fileURLToPath(new URL(`../../public${url}`, import.meta.url));
  if (existsSync(path)) return url;

  console.warn(
    `[portfolio] ${label} is set to "${url}" but public${url} does not exist — ` +
      `hiding it. Add the file to public/ or set it to null in src/data/profile.ts.`
  );
  return null;
}

export const resumeHref = resolveLocalAsset(profile.resumeUrl, 'profile.resumeUrl');
export const avatarHref = resolveLocalAsset(profile.avatar, 'profile.avatar');
