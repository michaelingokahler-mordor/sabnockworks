// Functional checks against a local static server, including the real game.
const assert = require('node:assert/strict');
const { mkdirSync, writeFileSync } = require('node:fs');
const { chromium } = require('playwright');
const base = (process.argv[2] || 'http://127.0.0.1:8080').replace(/\/$/, '');
const local = ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname);
const version = process.argv[3] ? '?v=' + encodeURIComponent(process.argv[3]) : '';
const output = 'output/velvet-cruise-check';
mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, proxy: !local && process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const errors = [], failures = [], gameExternal = [];
  const contexts = [];
  let gamePage;
  async function context(options) {
    const ctx = await browser.newContext({ locale: 'en-US', ...options });
    contexts.push(ctx);
    await ctx.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (['blob:', 'data:'].includes(url.protocol)) return route.continue();
      if (url.origin === new URL(base).origin) {
        if (local) return route.continue();
        // Node honors the managed proxy's NODE_EXTRA_CA_CERTS trust.
        // Keep TLS verification enabled when forwarding live browser requests.
        const response = await route.fetch();
        return route.fulfill({ response });
      }
      if (route.request().frame().page() === gamePage) gameExternal.push(url.hostname);
      return route.abort('blockedbyclient');
    });
    ctx.on('page', page => {
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (new URL(response.url()).origin === new URL(base).origin && response.status() >= 400) failures.push({ url: response.url(), status: response.status() }); });
    });
    return ctx;
  }
  try {
    const desktop = await context({ viewport: { width: 1440, height: 1000 } });
    const page = await desktop.newPage();
    await page.goto(base + '/games/more-projects/' + version + '#velvet-cruise', { waitUntil: 'load' });
    const article = page.locator('#velvet-cruise');
    const gallery = article.locator('[data-screenshot-carousel]');
    const track = gallery.locator('.screenshot-carousel-track');
    const previous = gallery.getByRole('button', { name: 'Previous screenshots' });
    const next = gallery.getByRole('button', { name: 'Next screenshots' });
    assert.equal(await track.locator('figure').count(), 17);
    assert.ok((await track.locator('figure').nth(0).textContent()).includes('The garage'));
    assert.ok((await track.locator('figure').nth(1).textContent()).includes('The course map'));
    assert.equal(await article.locator('img').count(), 18);
    assert.ok((await article.innerText()).includes('Free to play while in development.'));
    assert.ok((await article.innerText()).includes('Feedback appreciated.'));
    const hrefs = await article.locator('a').evaluateAll(links => links.map(link => link.href));
    assert.ok(hrefs.every(href => !/tesana\.com|585604|585605/.test(href)));
    for (const image of await article.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(img => img.decode());
      assert.deepEqual(await image.evaluate(img => [img.naturalWidth, img.naturalHeight]), [1280, 720]);
    }
    for (const data of await page.locator('script[type="application/ld+json"]').allTextContents()) JSON.parse(data);
    await article.locator('.more-project-feature').screenshot({ path: output + '/desktop-section.png' });
    await track.evaluate(element => element.scrollTo({ left: 0, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('[data-carousel-previous]').disabled);
    const visibleCards = () => track.evaluate(element => {
      const viewport = element.getBoundingClientRect();
      return [...element.children].filter(slide => {
        const box = slide.getBoundingClientRect();
        return box.left >= viewport.left - 1 && box.right <= viewport.right + 1;
      }).length;
    });
    assert.equal(await visibleCards(), 3, 'Three full screenshots on a wide desktop');
    await next.click();
    await page.waitForFunction(() => document.querySelector('[data-carousel-position]').textContent.startsWith('2\u2013'));
    await previous.click();
    await page.waitForFunction(() => document.querySelector('[data-carousel-previous]').disabled);
    await track.focus();
    await page.keyboard.press('End');
    await page.waitForFunction(() => document.querySelector('[data-carousel-next]').disabled);
    assert.equal((await gallery.locator('[data-carousel-position]').innerText()), '15\u201317 / 17');
    assert.equal(await previous.isEnabled(), true);
    await page.keyboard.press('Home');
    await page.waitForFunction(() => document.querySelector('[data-carousel-previous]').disabled);
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(() => document.querySelector('[data-carousel-position]').textContent.startsWith('2\u2013'));
    await page.keyboard.press('Home');
    await page.waitForFunction(() => document.querySelector('[data-carousel-previous]').disabled);
    await page.setViewportSize({ width: 1000, height: 1000 });
    assert.equal(await visibleCards(), 2, 'Two full screenshots on a smaller desktop');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await track.evaluate(element => element.blur());
    await gallery.screenshot({ path: output + '/screenshot-carousel.png' });
    const mobile = await context({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(base + '/games/more-projects/' + version + '#velvet-cruise', { waitUntil: 'load' });
    const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.equal(overflow, false, 'The mobile collection must not scroll horizontally');
    const mobileTrack = mobilePage.locator('.screenshot-carousel-track');
    await mobileTrack.scrollIntoViewIfNeeded();
    const swipeBox = await mobileTrack.boundingBox();
    const swipe = await mobile.newCDPSession(mobilePage);
    const touchY = swipeBox.y + swipeBox.height * .4;
    await swipe.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: swipeBox.x + swipeBox.width * .85, y: touchY }] });
    for (let i = 1; i <= 8; i++) {
      await swipe.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: swipeBox.x + swipeBox.width * (.85 - .7 * i / 8), y: touchY }] });
      await mobilePage.waitForTimeout(30);
    }
    await swipe.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobilePage.waitForFunction(() => {
      const element = document.querySelector('.screenshot-carousel-track');
      const stride = element.children[1].offsetLeft - element.children[0].offsetLeft;
      return element.scrollLeft > 20 && Math.abs(element.scrollLeft / stride - Math.round(element.scrollLeft / stride)) < .002;
    });
    assert.equal(await mobileTrack.evaluate(element => {
      const viewport = element.getBoundingClientRect();
      return [...element.children].filter(slide => {
        const box = slide.getBoundingClientRect();
        return box.left >= viewport.left - 1 && box.right <= viewport.right + 1;
      }).length;
    }), 1, 'Touch scrolling must settle on one complete mobile screenshot');
    assert.equal(await mobilePage.getByRole('button', { name: 'Previous screenshots' }).isEnabled(), true);
    await mobilePage.locator('[data-screenshot-carousel]').screenshot({ path: output + '/touch-carousel.png' });
    await mobilePage.screenshot({ path: output + '/mobile-section.png', fullPage: true });

    gamePage = page;
    const play = article.getByRole('link', { name: 'Play online' });
    assert.equal(await play.getAttribute('href'), './velvet-cruise/');
    await play.click();
    assert.equal(new URL(page.url()).pathname, '/games/more-projects/velvet-cruise/');
    await page.goto(page.url() + '#autopilot&sim=8');
    await page.waitForFunction(() => typeof window.__trackBench === 'function');
    for (let i = 0; i < 4; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(300); }
    await page.waitForFunction(() => window.__race?.state === 'race' && window.__race.kmh > 100);
    const before = await page.evaluate(() => window.__race);
    await page.waitForFunction(z => window.__race.z > z + 50000, before.z);
    const after = await page.evaluate(() => window.__race);
    await page.screenshot({ path: output + '/browser-race.png' });

    // Exercise the actual touch menu and accelerator on a portrait phone.
    await mobilePage.goto(base + '/games/more-projects/velvet-cruise/#tumbletest');
    await mobilePage.waitForFunction(() => typeof window.__trackBench === 'function');
    const tap = async (x, y) => {
      const box = await mobilePage.locator('#game canvas').boundingBox();
      await mobilePage.touchscreen.tap(box.x + x * box.width / 320, box.y + y * box.height / 180);
      await mobilePage.waitForTimeout(300);
    };
    await tap(160, 76);
    await tap(160, 167);
    await tap(160, 167);
    await tap(160, 117);
    await mobilePage.waitForFunction(() => window.__race?.state === 'race', { timeout: 15000 });
    const touchBox = await mobilePage.locator('#game canvas').boundingBox();
    const client = await mobile.newCDPSession(mobilePage);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchBox.x + touchBox.width * .9, y: touchBox.y + touchBox.height * .85 }] });
    await mobilePage.waitForFunction(() => window.__race.kmh > 80, { timeout: 15000 });
    const touchRace = await mobilePage.evaluate(() => window.__race);
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobilePage.screenshot({ path: output + '/touch-race.png' });
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    assert.deepEqual(gameExternal, [], 'The game must be served entirely by this website');
    const result = { galleryImages: 18, carouselImages: 17, desktopVisible: 3, smallerDesktopVisible: 2, carouselArrows: true, carouselKeyboard: true, carouselSwipe: true, stages: 15, mobileOverflow: overflow, playDestination: new URL(page.url()).pathname, before, after, touchRace, errors, failures, gameExternal };
    writeFileSync(output + '/result.json', JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally {
    for (const ctx of contexts) await ctx.unrouteAll({ behavior: 'wait' });
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
