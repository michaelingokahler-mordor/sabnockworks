# Dedicated game pages implementation plan

**Goal:** Give Velvet Cruise and Lathmar: Emerald Hollows dedicated information pages, and make all five homepage cards lead to information before playing.

**Architecture:** Reuse the existing More Projects descriptions, artwork, controls, Velvet Cruise screenshot carousel and playlist. Keep the old collection, its anchors and both game applications at their current addresses. Add normal links from each homepage title, image and themed action to its information page.

**Tech stack:** Static HTML/CSS and the existing screenshot carousel script.

**Specification:** User-approved proposal in this chat, 26 October 2026.

## Approved navigation

- Lathmar: The Fallen Depths: Enter the Depths, target https://lathmar.de/.
- War of the Wizards: Enter the Arena, target /games/war-of-the-wizards/.
- Routes of Africa: Explore the Expedition, target /games/routes-of-africa/.
- Velvet Cruise: Discover Velvet Cruise, target /games/velvet-cruise/.
- Lathmar: Emerald Hollows: Explore Emerald Hollows, target /games/emerald-hollows/.
- The three playable games use Play the Game on their information pages.

## Constraints and review focus

- Preserve the More Projects HTML file and its existing anchors for old external posts.
- Do not move or edit playable builds, game storage, or URLs under /games/more-projects/.
- Preserve current descriptions, assets, carousel operation and mobile layouts.
- Add page-specific titles, descriptions, canonical URLs, social metadata, VideoGame and breadcrumb structured data.
- Update the sitemap and llms.txt to identify the new information pages.
- Use link/HTML and browser checks for these static changes, without adding a mirrored runtime test suite.

## Tasks

- [x] Create the two information pages from existing content.
- [x] Update homepage titles, image links and themed actions; align War of the Wizards play wording.
- [x] Update discovery metadata and the developer notes.
- [x] Verify old URL compatibility, all local links, JSON-LD, desktop/mobile layout, click paths and the screenshot carousel.
- Publication after these checks: commit and push the approved website changes, then verify local/upstream/remote parity and the live pages. Report the final commit and live result in the chat.

## Verification record

- Five HTML pages and 172 local links/assets/anchors passed static checks, including the five title/image/action paths, JSON-LD, canonical URLs and sitemap entries.
- The legacy More Projects HTML is unchanged against the starting commit, including both game section anchors. No playable build, artwork, carousel script or storage code changed.
- Browser click checks reached Velvet Cruise and Emerald Hollows through their new information pages, and War of the Wizards through its linked homepage image and information page.
- Velvet Cruise's screenshot carousel advanced from 1–3 / 17 to 2–4 / 17. Both new pages rendered on desktop and at a 390px viewport without horizontal overflow after the controls-grid fix.
- Emerald's inherited fixed two-column controls initially overflowed at 390px. The new information pages now use an adaptive controls grid, verified at viewport widths 390, 430, 850, 1024 and 1440 with no row or document overflow.
- Independent review found no actionable critical, important or minor issues. Its responsive-layout check was completed by the browser checks above. Existing external playlist availability was outside the change.
