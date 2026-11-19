const SITE = 'https://sabnockworks.com';
const ENDPOINT = 'https://emerald-hollows-api.emerald-hollows.workers.dev/game-statistics/events';
const SOURCE_KEY = 'sabnockworks-entry-source';
const SOURCE_LIFETIME_MS = 30 * 60 * 1000;
const GAME_PATHS = {
  'war-of-the-wizards': '/games/war-of-the-wizards/play/',
  'emerald-hollows': '/games/more-projects/emerald-hollows/',
};
const HOSTNAME = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?)$/;

export function sourceFromReferrer(referrer) {
  if (!referrer) return 'direct';
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace(/^www\./, '').replace(/\.$/, '');
    if (['http:', 'https:'].includes(url.protocol) && HOSTNAME.test(hostname)) return hostname;
  } catch { /* Malformed or unavailable referrer. */ }
  return 'unknown';
}

export function rememberSource(referrer, storage, now = Date.now()) {
  const source = sourceFromReferrer(referrer);
  try {
    if (source === 'sabnockworks.com') {
      const saved = JSON.parse(storage?.getItem(SOURCE_KEY) ?? 'null');
      if (saved && (HOSTNAME.test(saved.source) || ['direct', 'unknown'].includes(saved.source)) &&
          saved.until > now && saved.until <= now + SOURCE_LIFETIME_MS) return saved.source;
    } else {
      storage?.setItem(SOURCE_KEY, JSON.stringify({ source, until: now + SOURCE_LIFETIME_MS }));
    }
  } catch { /* Some browsers disable session storage. */ }
  return source;
}

function productionPage() {
  return typeof document !== 'undefined' && location.origin === SITE &&
    !navigator.webdriver && !/[?&#](?:qa|test|debug)(?:[=&]|$)/i.test(location.search + location.hash);
}

function entrySource() {
  try {
    return rememberSource(document.referrer, window.sessionStorage);
  } catch {
    return sourceFromReferrer(document.referrer);
  }
}

const source = productionPage() ? entrySource() : 'unknown';
let loaded = false;
let pending = 0;

async function send(body) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        keepalive: true,
        signal: AbortSignal.timeout(4000),
        body,
      });
      if (response.ok || (response.status < 500 && response.status !== 429)) return;
    } catch { /* Retry the same event after a connection failure. */ }
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, attempt === 0 ? 250 : 1000));
  }
}

export function recordGameStatistic(game, type) {
  try {
    const gamePath = GAME_PATHS[game];
    if (!productionPage() || !gamePath || ![gamePath, gamePath + 'index.html'].includes(location.pathname)) return;
    if (!['game_loaded', 'run_start'].includes(type) || (type === 'game_loaded' && loaded) || pending >= 20) return;
    const body = JSON.stringify({ id: crypto.randomUUID(), game, type, source, timestamp: Date.now() });
    if (type === 'game_loaded') loaded = true;
    pending++;
    void send(body).catch(() => {}).finally(() => { pending--; });
  } catch { /* Statistics must never interrupt gameplay. */ }
}
