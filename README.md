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
page links to its browser edition. Velvet Cruise uses **Play the Demo**; Emerald Hollows uses **Play the Game**.
Keep `games/more-projects/index.html` and its `#velvet-cruise` and
`#emerald-hollows` anchors available for older external posts.

## Update Velvet Cruise

The public browser game at `games/more-projects/velvet-cruise/` is the coastal
**demo-e** edition. It has five stages ending at E. Its content notice appears
before play, including direct URLs. Records stay local. Online leaderboards
and game statistics are disabled in this demo.

The Full Windows/Mac edition has all routes. Its information pages show
**Soon available** and a **Play the Demo** link. Other games keep their own
availability text.

Build the reviewed game source with `npm run check`, `npm test`,
`npm run qa:demo` and `npm run build:demo`. Browser output is
`output/web-demo-e/game`. Run the content-notice and route browser checks
from the game repository before publishing.

Copy the complete reviewed browser output into a new immutable directory
under `games/more-projects/velvet-cruise/releases/`. Retain its hashed scripts,
CSS and assets together. Update the root game `index.html` with a relative
`base` selecting that release. Record the exact game commit, release,
entry file, `demo-e` edition and disabled online/statistics flags in
`build-info.json`. Keep previous releases for cached sessions.

`tools/update-velvet-cruise.mjs` is a historical Full updater. Do not use it
for the public demo. It builds `standalone` and would replace the demo.

GitHub Pages publishes the website root from `main`. Publishing does not
run game build tools. Verify the public information page, collection entry,
button targets, direct start notice and demo route after deployment.

The existing Cloudflare Worker remains available for the purchased Full
versions. Private report credentials must never enter this repository.

With a local static server running, `node tools/check-velvet-cruise.cjs`
checks the collection, assets, keyboard play and touch controls. It needs
Playwright and Chromium. On Windows, set `CHROMIUM_PATH` to the Chrome
executable if necessary.
