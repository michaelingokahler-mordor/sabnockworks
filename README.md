# Sabnock Works

Static website for Sabnock Works.

## Structure

- `index.html` - homepage
- `imprint.html` - legal notice
- `assets/style.css` - website design
- `assets/media/` - website images

GitHub Pages publishes the root of the `main` branch directly. No Node.js, build process, or deployment workflow is required.

## Update Velvet Cruise

The playable web edition lives at `games/more-projects/velvet-cruise/`.
It includes its own assets and does not use the Tesana SDK.
Scores and badges are saved in the player's browser.

Keep the game source in a sibling `Velvet-Cruise` checkout with its dependencies installed.
Build and copy the web edition:

```bash
node tools/update-velvet-cruise.mjs ../Velvet-Cruise
```

This runs the game's TypeScript and local-storage checks before building.
The generated `build-info.json` records the source commit and entry file.
Previous hashed JavaScript files are retained for existing browser sessions.

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
