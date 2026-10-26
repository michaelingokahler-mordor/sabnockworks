# Homepage games and readable essays implementation plan

> **For agentic workers:** Use native execution for the static content changes below, followed by a focused independent review.

**Goal:** Give Velvet Cruise and Lathmar: Emerald Hollows their own homepage entries, link Emerald Hollows from Lathmar.de, and publish full HTML reading editions of Ancient Mega Dungeons and Heinrich Barth.

**Architecture:** Reuse both websites' existing HTML and CSS. Keep the games at their existing addresses. Convert the already published PDFs into static article pages, preserving text, illustrations, references and PDF downloads.

**Tech stack:** Static HTML/CSS, Python PDF extraction, local HTTP preview.

**Spec:** The user's 26 October 2026 instructions in this chat and the existing site templates.

## Constraints

- English website copy; retain the existing visual styles and actual game artwork.
- Keep “Free to play while in development.” for both browser games.
- Do not alter game bundles, storage or playable URLs.
- Preserve the essays' wording and distinguish the existing sources from new introductory copy.
- Prepare local changes for review; the user subsequently authorized committing and pushing both websites to their existing main branches.
- These reversible content edits need link, content and visual checks, without a new runtime test suite.

## Review focus

- Both homepage game entries must be visible and link to the correct playable game.
- The Lathmar link must identify Emerald Hollows as a separate cave puzzle game.
- PDF conversion must not lose paragraph continuations, source hyperlinks, illustrations or special characters.
- Article contents links must work and mobile layouts must remain readable.
- New article URLs must be linked from the archive and included in the sitemap.

## Tasks

- [x] Add homepage game entries using the existing work-card layout; update the heading and related metadata.
- [x] Add the Emerald Hollows link and context to Lathmar.de; update its homepage modification date.
- [x] Add complete HTML reading editions at `articles/ancient-mega-dungeons/` and `articles/heinrich-barth/`, using the existing article template; connect archive, homepage, related game page, sitemap and llms.txt.
- [x] Check extracted content against each PDF, validate local links and JSON-LD, preview desktop/mobile layouts, and review the focused diff.

## Verification record

- Full retained PDF text compared to rendered HTML text, including spaces and special characters. Both pass. Repeated print footers, cover/imprint pages and duplicate print contents omitted; edition note retained on the web pages.
- Ancient Mega Dungeons: 14 body illustrations, all 24 source URL targets retained. Heinrich Barth: source notes retained; the published PDF contains no URI annotations.
- Static verification: six changed/new HTML pages, 168 local links/assets/anchors, unique IDs, JSON-LD, article structure and both XML sitemaps pass.
- Local Edge desktop and 390px viewport checks cover the homepage, article layouts and Lathmar reference; no horizontal overflow in measured views.
- Independent read-only review: no actionable critical, important or minor findings.
- Review boundary: historical claims are reproduced from the published essays; external source uptime and live publication are not newly certified. No game code, game URLs or browser storage changed.
- At the implementation review, all changes were local. The user subsequently authorized committing and pushing both websites on 26 October 2026.
