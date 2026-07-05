# Gaze Glass QA And Visual Audit

Date: July 5, 2026

## Scope

Reviewed the current local preview across the major visitor surfaces:

- Home
- Observations
- Spirits
- Sorting Glass
- A Court of Foxes cover
- A Court of Foxes reader

Evidence screenshots live in:

`audits/2026-07-05-gaze-glass-qa/screenshots/`

## Overall Health

The site is in strong shape. The art direction feels distinctive, premium, and consistent: dark glass, divine gold, parchment, fox-spirit color accents, large editorial type, and immersive story art. The most important experience, A Court of Foxes, now feels much cleaner on both desktop and mobile after removing the floating global memory/audio controls from the reading surface.

## Functional QA

Passed:

- Production build completes successfully.
- Project contrast check passes for observation entry labels, borders, and focus ring.
- Git whitespace check passes.
- No broken images were found in the captured page sweep.
- No horizontal overflow was found in the captured desktop/mobile states.
- No console errors were found during the captured page sweep.
- A Court of Foxes contains all 16 chapters in the chapter rail.
- A Court of Foxes desktop rail scrolls independently so later chapters remain reachable.
- A Court of Foxes mobile layout scrolls naturally as one page.
- Witness Choice card is present in Chapter One.
- Witness Choice options display as three columns on desktop and one clean column on mobile.

## Fix Applied During QA

The global "Glass Remembers" dock and sound control were visually competing with A Court of Foxes, especially on the mobile cover and mobile chapter list.

Change made:

- Hide the global memory/audio controls while the Court reader is active.
- Hide those controls across the A Court mobile experience, where they were most likely to cover content.

This keeps A Court of Foxes feeling like a dedicated, immersive reader instead of a normal marketing page with site utilities layered on top.

Note: the tiny black "N" visible in local screenshots is the Next.js development helper. It is not a Gaze Glass UI element and should not appear in the production site.

## Page Audit

### Home

Status: healthy.

The first impression is atmospheric and cinematic. The visual density feels appropriate for the brand, and the page gives visitors an immediate sense that Gaze Glass is a mythic story world rather than a generic fiction site.

Screenshots:

- `01-home-desktop.png`
- `07-home-mobile.png`

### Observations

Status: healthy.

The Observations page has a strong editorial hero and a clear reading invitation. The added imagery helps break up copy density and makes the archive feel more alive.

Screenshots:

- `02-observations-desktop.png`
- `08-observations-mobile.png`

### Spirits

Status: healthy.

The page supports the spirits category and the Court of Foxes promotion well. It feels aligned with the broader Gaze Glass language.

Screenshot:

- `03-spirits-desktop.png`

### Sorting Glass

Status: healthy.

The renaming from Glass Naming to Sorting Glass reads more intuitively. The experience feels like an active ritual rather than a static quiz.

Screenshot:

- `04-sorting-glass-desktop.png`

### A Court Of Foxes Cover

Status: healthy after fix.

The cover art is the strongest visual asset on the site. Desktop feels polished and book-like. Mobile now has a cleaner first impression because the global dock no longer competes with the title and cover area.

Screenshots:

- `05-court-cover-desktop.png`
- `09-court-cover-mobile.png`
- `11-court-cover-mobile-after-fix.png`

### A Court Of Foxes Reader

Status: healthy after fix.

The reader is the site's flagship experience. The left rail, large chapter art, reading controls, parchment panel, and Witness Choice card combine into a much more native-feeling reading environment than a normal web article. Desktop and mobile both work, with desktop using an independent scroll rail and mobile using a long-form stacked layout.

Screenshots:

- `06-court-reader-desktop.png`
- `10-court-reader-mobile.png`
- `12-court-reader-mobile-after-fix.png`
- `13-court-reader-desktop-after-fix.png`
- `14-court-reader-desktop-verified.png`
- `15-court-reader-mobile-verified.png`

## Visual Design Notes

Strongest qualities:

- The world has a memorable visual signature.
- Typography feels lush and literary without becoming generic fantasy.
- The Court of Foxes reader now has enough interaction to feel special without breaking the story.
- The Witness Choice system fits the brand because it asks the visitor to notice, not simply choose.
- Mobile layouts now preserve the mood without trapping the visitor or hiding content.

Recommended future polish:

- Do a keyboard-only pass on A Court of Foxes from cover through witness choices and chapter navigation.
- Do a screen-reader pass for the reader controls, especially the icon-only focus tools.
- Consider giving every major story/category page one unmistakable hero image or moving visual moment above the fold.
- Keep using A Court of Foxes as the benchmark for future experiences; it is currently the richest part of the site.

## Verdict

Gaze Glass is visually coherent, responsive, and functioning well in the checked paths. The main issue found during QA was an overlay problem in A Court of Foxes, and that has been fixed. The site now feels cleaner, more intentional, and more immersive across desktop and mobile.
