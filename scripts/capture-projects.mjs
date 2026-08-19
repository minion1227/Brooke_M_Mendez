/**
 * Captures a storefront screenshot for each project, then downsizes it for the
 * web and writes it to public/projects/<slug>.jpg.
 *
 * Run:  npm run capture:projects
 *
 * Drives the Chrome or Edge already installed on the machine over the DevTools
 * Protocol -- no Puppeteer, no Chromium download. CDP rather than Chrome's
 * `--screenshot` flag because these are live Shopify storefronts: they open
 * newsletter and cookie modals on load, and `--screenshot` fires the moment the
 * page loads with no chance to dismiss anything. Here we load, wait, clear the
 * overlays, and only then capture.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { setTimeout as sleep } from 'node:timers/promises';
import sharp from 'sharp';

const BROWSERS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

/**
 * `scrollY` frames the shot lower down the page.
 *
 * Mystiqare's hero is a <video>, and headless Chrome will not composite a video
 * frame into a screenshot — it stays on a low-res poster no matter how long you
 * wait for it to buffer. Framing on the product grid below shows the storefront
 * honestly instead of shipping what looks like a broken image.
 */
const TARGETS = [
  { slug: 'dustys-trail', url: 'https://dustystrail.com' },
  { slug: 'mystiqare', url: 'https://mystiqare.com', scrollY: 430 },
  { slug: 'easure-scrubs', url: 'https://easurescrubs.com' },
  { slug: 'perdido-hat-co', url: 'https://perdidohatco.com' },
];

// Captured at 1x, wide, then downscaled. Not 2x: at deviceScaleFactor 2 these
// storefronts pick retina entries from their srcset that never finish loading,
// leaving the blur-up placeholder in the shot. Rendering wide at 1x and shrinking
// gets the sharpness without tripping that.
const VIEWPORT = { width: 1440, height: 960 };
const DEVICE_SCALE_FACTOR = 1;
const OUTPUT_WIDTH = 1000;
const SETTLE_MS = 3500; // after load, for lazy hero imagery and popup timers
const NAV_TIMEOUT_MS = 45_000;
const SETTLE_BUDGET_MS = 25_000; // hard cap on the in-page warm-up routine

/* ── Overlay removal, evaluated inside the page ──────────────────────────── */

/*
 * Deliberately does NOT click "close" controls. That was the first approach and
 * it backfired: on one storefront a selector matched the search toggle, which
 * *opened* a full-screen search drawer and left the page dimmed. Geometry is a
 * far more reliable signal than a button's label.
 *
 * Rule: a fixed or sticky element pinned to the top edge and shorter than a
 * quarter of the viewport is the site's own header or announcement bar and
 * belongs in the shot. Anything else fixed — centred modals, bottom-corner
 * signup boxes, chat bubbles, cookie bars — is chrome we don't want.
 */
const DISMISS_OVERLAYS = `(() => {
  const vw = innerWidth, vh = innerHeight;
  const removed = [];

  document.querySelectorAll('body *').forEach((el) => {
    if (!el.isConnected) return;
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') return;
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;

    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;

    const coverage = (r.width * r.height) / (vw * vh);
    const z = parseInt(cs.zIndex, 10) || 0;

    // Header / announcement bar: lives in the top band and is short. Note the
    // top band is generous — a sticky nav often sits below an announcement bar
    // rather than flush at y=0, and an earlier stricter test ripped one out and
    // left a white gap where the navigation had been.
    if (r.top < vh * 0.25 && r.height < vh * 0.3) return;

    // Corner widgets: chat bubbles, signup boxes, cookie bars.
    const isBottomWidget = r.bottom > vh * 0.75 && coverage < 0.25;
    // Real modals and their backdrops.
    const isModal = coverage > 0.15 || (z >= 900 && coverage > 0.05);

    if (isBottomWidget || isModal) {
      removed.push((el.id || el.className || el.tagName).toString().slice(0, 60));
      el.remove();
    }
  });

  // Modals commonly lock scroll; undo that so the hero lays out normally.
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.position = '';
  ['modal-open', 'overflow-hidden', 'no-scroll', 'popup-open'].forEach((c) =>
    document.body.classList.remove(c)
  );

  return removed;
})()`;

/* ── Trim dead space ─────────────────────────────────────────────────────── */

/**
 * Crops flat, single-colour rows off the bottom of a screenshot.
 *
 * Some storefronts leave a band of empty background below the fold where a
 * section hasn't rendered yet. In a card that band reads as a broken image, so
 * we detect rows that match the very last row and cut them — while refusing to
 * trim more than 45% of the height, so a legitimately minimal page is never
 * gutted.
 */
async function trimFlatBottom(buffer) {
  const image = sharp(buffer);
  const { width } = await image.metadata();
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const rowAt = (y) => {
    const offset = y * info.width * channels;
    return [data[offset], data[offset + 1], data[offset + 2]];
  };

  const isRowFlat = (y, reference) => {
    // Sample across the row rather than testing every pixel — enough to tell a
    // blank band from real content, and far cheaper.
    for (let x = 0; x < info.width; x += 16) {
      const offset = (y * info.width + x) * channels;
      for (let c = 0; c < 3; c++) {
        if (Math.abs(data[offset + c] - reference[c]) > 6) return false;
      }
    }
    return true;
  };

  const reference = rowAt(info.height - 1);
  let cut = info.height;
  const floor = Math.floor(info.height * 0.55); // never trim past this

  while (cut - 1 > floor && isRowFlat(cut - 1, reference)) cut -= 1;

  // Leave a small margin so the crop doesn't shave content pixels.
  cut = Math.min(info.height, cut + 8);
  if (cut >= info.height - 4) return buffer; // nothing worth trimming

  return sharp(buffer)
    .extract({ left: 0, top: 0, width, height: cut })
    .png()
    .toBuffer();
}

/* ── Minimal CDP client ──────────────────────────────────────────────────── */

class CDP {
  #ws;
  #id = 0;
  #pending = new Map();
  #listeners = new Map();

  static async connect(url) {
    const client = new CDP();
    client.#ws = new WebSocket(url);

    await new Promise((resolve, reject) => {
      client.#ws.addEventListener('open', resolve, { once: true });
      client.#ws.addEventListener('error', () => reject(new Error('CDP socket failed')), {
        once: true,
      });
    });

    client.#ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id !== undefined) {
        const entry = client.#pending.get(msg.id);
        if (!entry) return;
        client.#pending.delete(msg.id);
        if (msg.error) entry.reject(new Error(msg.error.message));
        else entry.resolve(msg.result);
      } else if (msg.method) {
        client.#listeners.get(msg.method)?.forEach((fn) => fn(msg.params));
      }
    });

    return client;
  }

  /**
   * Every call is bounded. A page promise that never settles (a video that
   * never buffers, a script that never resolves) would otherwise hang the whole
   * run with no output — which is exactly what happened before this guard.
   */
  send(method, params = {}, sessionId, timeoutMs = 30_000) {
    const id = ++this.#id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.#ws.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id);
        reject(new Error(`${method} timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      this.#pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
    });
  }

  once(method) {
    return new Promise((resolve) => {
      const list = this.#listeners.get(method) ?? [];
      const handler = (params) => {
        this.#listeners.set(
          method,
          (this.#listeners.get(method) ?? []).filter((f) => f !== handler)
        );
        resolve(params);
      };
      this.#listeners.set(method, [...list, handler]);
    });
  }

  close() {
    this.#ws.close();
  }
}

/* ── Launch ──────────────────────────────────────────────────────────────── */

const browser = BROWSERS.find((path) => existsSync(path));
if (!browser) {
  console.error('No Chrome or Edge found. Install one, or add its path to BROWSERS.');
  process.exit(1);
}
console.log(`Using ${browser}\n`);

const profileDir = join(tmpdir(), `capture-profile-${process.pid}`);
const outDir = join('public', 'projects');
mkdirSync(outDir, { recursive: true });

const chrome = spawn(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-features=Translate,MediaRouter',
    // Hero videos stay on their low-res poster frame unless autoplay is allowed.
    '--autoplay-policy=no-user-gesture-required',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`,
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
    'about:blank',
  ],
  { stdio: 'ignore', windowsHide: true }
);

// Chrome writes its chosen debugging port here once the socket is listening.
const portFile = join(profileDir, 'DevToolsActivePort');
let debugPort = null;
for (let i = 0; i < 100; i++) {
  if (existsSync(portFile)) {
    const line = readFileSync(portFile, 'utf8').split('\n')[0].trim();
    if (line) {
      debugPort = line;
      break;
    }
  }
  await sleep(150);
}

if (!debugPort) {
  chrome.kill();
  rmSync(profileDir, { recursive: true, force: true });
  console.error('Chrome never reported a debugging port.');
  process.exit(1);
}

const { webSocketDebuggerUrl } = await (
  await fetch(`http://127.0.0.1:${debugPort}/json/version`)
).json();
const cdp = await CDP.connect(webSocketDebuggerUrl);

/* ── Capture ─────────────────────────────────────────────────────────────── */

let captured = 0;

for (const { slug, url, scrollY = 0 } of TARGETS) {
  let targetId;
  try {
    ({ targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' }));
    const { sessionId } = await cdp.send('Target.attachToTarget', {
      targetId,
      flatten: true,
    });

    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      mobile: false,
    }, sessionId);

    const loaded = cdp.once('Page.loadEventFired');
    await cdp.send('Page.navigate', { url }, sessionId);

    // Proceed on timeout rather than failing: a slow third-party widget should
    // not cost us the whole screenshot.
    await Promise.race([loaded, sleep(NAV_TIMEOUT_MS)]);
    await sleep(SETTLE_MS);

    // Storefronts lazy-load hero and product imagery behind an IntersectionObserver,
    // so a page that never scrolls keeps serving blurry LQIP placeholders. Walk
    // down the page to trip those observers, then return to the top.
    // Whatever happens inside, this settles within SETTLE_BUDGET_MS and we take
    // the screenshot regardless — a half-warmed page beats no page.
    await cdp.send(
      'Runtime.evaluate',
      {
        expression: `Promise.race([(async () => {
          const step = innerHeight * 0.75;
          for (let y = 0; y < document.body.scrollHeight && y < step * 6; y += step) {
            scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 250));
          }
          scrollTo(0, 0);
          // Force any remaining lazy images to fetch immediately.
          document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
            img.loading = 'eager';
          });
          await new Promise((r) => setTimeout(r, 600));

          // Wait for the real images to actually decode. Several of these
          // storefronts blur-up from a tiny placeholder, and screenshotting on a
          // timer alone catches the placeholder rather than the final image.
          await Promise.all(
            [...document.images].slice(0, 60).map((img) =>
              img.decode ? img.decode().catch(() => {}) : Promise.resolve()
            )
          );
          if (document.fonts && document.fonts.ready) await document.fonts.ready;

          // Some heroes are <video>, not <img>. Headless Chrome leaves them on a
          // low-res poster frame, so nudge each one to buffer and land on a real
          // frame before we shoot.
          await Promise.all(
            [...document.querySelectorAll('video')].slice(0, 6).map(async (v) => {
              try {
                v.muted = true;
                v.playsInline = true;
                if (v.readyState < 2) {
                  await Promise.race([
                    new Promise((r) => v.addEventListener('loadeddata', r, { once: true })),
                    new Promise((r) => setTimeout(r, 6000)),
                  ]);
                }
                await v.play().catch(() => {});
                await new Promise((r) => setTimeout(r, 1200));
                v.pause();
              } catch {}
            })
          );

          await new Promise((r) => setTimeout(r, 600));
        })(), new Promise((r) => setTimeout(r, ${SETTLE_BUDGET_MS}))])`,
        awaitPromise: true,
      },
      sessionId,
      SETTLE_BUDGET_MS + 10_000
    );
    await sleep(2000);

    // Escape closes well-behaved modals natively, letting the site restore its
    // own scroll state before we start removing nodes.
    for (const type of ['rawKeyDown', 'keyUp']) {
      await cdp.send(
        'Input.dispatchKeyEvent',
        { type, key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
        sessionId
      );
    }
    await sleep(400);

    // Two passes: some popups are on a timer and appear after the first sweep.
    const removed = [];
    for (let pass = 0; pass < 2; pass++) {
      const { result } = await cdp.send(
        'Runtime.evaluate',
        { expression: DISMISS_OVERLAYS, returnByValue: true },
        sessionId
      );
      removed.push(...(result?.value ?? []));
      await sleep(900);
    }

    if (scrollY) {
      await cdp.send(
        'Runtime.evaluate',
        { expression: `scrollTo({ top: ${scrollY}, behavior: 'instant' })` },
        sessionId
      );
      await sleep(1200);
    }

    const { data } = await cdp.send(
      'Page.captureScreenshot',
      { format: 'png', captureBeyondViewport: false },
      sessionId
    );

    const input = Buffer.from(data, 'base64');
    const trimmed = await trimFlatBottom(input);

    const output = await sharp(trimmed)
      .resize(OUTPUT_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toBuffer();

    writeFileSync(join(outDir, `${slug}.jpg`), output);
    captured += 1;

    const note = removed.length ? `, cleared ${removed.length} overlay(s)` : '';
    console.log(`  OK    ${slug}: ${(output.length / 1024).toFixed(0)} KB${note}`);
  } catch (err) {
    console.log(`  FAIL  ${slug}: ${err.message}`);
  } finally {
    if (targetId) await cdp.send('Target.closeTarget', { targetId }).catch(() => {});
  }
}

cdp.close();
chrome.kill();
await sleep(500);
rmSync(profileDir, { recursive: true, force: true });

console.log(`\n${captured}/${TARGETS.length} captured into ${outDir}/`);
if (captured < TARGETS.length) process.exitCode = 1;
