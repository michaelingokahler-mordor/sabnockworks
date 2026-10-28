# Sabnock Works

Static website for Sabnock Works.

## Structure

- `index.html` - homepage
- `imprint.html` - legal notice
- `assets/style.css` - website design
- `assets/media/` - website images

GitHub Pages publishes the root of the `main` branch directly. No Node.js, build process, or deployment workflow is required.

## War of the Wizards web edition

The full Godot browser edition lives at `games/war-of-the-wizards/play/`.
The game page links to it with **Play online**. Both pages show
**Free to play while in development.** and **Feedback appreciated.**
The feedback link opens an email with the subject `War of the Wizards feedback`.
The browser edition has no ten-round demo limit. The separate Windows demo
retains its own ten-round limit.

Copy the reviewed web deployment from the game repository's
`builds/web/deployment/` directory. Preserve the exported file names and keep
the `.wasm`, `.pck`, JavaScript, audio worklets and license files together.
The build uses Godot 4.5.1 Compatibility rendering without threads, so it does
not require cross-origin isolation headers. The web export's existing checks
are documented in the game repository.

## Game information pages

The information pages are `games/velvet-cruise/` and `games/emerald-hollows/`.
Homepage images, titles and themed links lead to these pages. Each information
page has a **Play the Game** link to the existing browser edition.
Keep `games/more-projects/index.html` and its `#velvet-cruise` and
`#emerald-hollows` anchors available for older external posts.

## Update Velvet Cruise

The playable web edition lives at `games/more-projects/velvet-cruise/`.
It includes its own assets and does not use the Tesana SDK.
Scores and badges are saved in the player's browser.

The current statistics release is `2026-10-28-e07bc15-statistics`, built from
game commit `e07bc1564aa5f9b982fbacd7e51cb1c7fe8dca9b`. It includes the online
adapter and anonymous load/start counters. The private report is served by
the existing Cloudflare Worker at `/stats/`; its access key is a Worker
secret and must never be copied into this repository.

Publish reviewed immutable release directories and update only the wrapper
index and build metadata. Keep earlier releases for cached pages. Production
statistics require `VELVET_PRODUCTION_STATISTICS=1` during the standalone
build. Follow `reports/statistics-2026-10-28/README.md` in the game repository
for build, deployment and rollback details.

The helper below is historical. It copies into the root and does not prepare
the current immutable statistics release. Do not use it to replace this release:

```bash
node tools/update-velvet-cruise.mjs ../Velvet-Cruise
```

This runs the game's TypeScript and local-storage checks before building.
The generated `build-info.json` records the source commit and entry file.
Previous hashed JavaScript files are retained for existing browser sessions.

The entry page selects `releases/2026-10-28-e07bc15-statistics/` through a relative base URL,
so each release loads a matching atlas, metadata and scripts. Retain older root
assets and release folders for cached pages. Current extended-tour records use
the existing `tour2` keys and boards; legacy local records are not deleted or
reinterpreted as scores under the new driving rules. The basic updater above
requires a checkout that already includes the online adapter; do not replace
this release with a local-only build.

To refresh the screenshots, run a local static server:

```bash
python -m http.server 8080 --bind 127.0.0.1
```

In the game checkout, run the capture tool with Chromium and Playwright available:

```bash
node tools/art/capture-web.cjs http://127.0.0.1:8080/games/more-projects/velvet-cruise/ ../sabnockworks/assets/media
```

The tool captures the title, garage, course map, and all fifteen stages.
Review the images, then check the collection page on desktop and mobile.
The site remains static; publishing does not run these tools.

With the local server running, check the collection, links, assets, keyboard play,
and touch controls with `node tools/check-velvet-cruise.cjs`.
This check also needs Chromium and Playwright.
