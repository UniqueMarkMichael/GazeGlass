# A Court of Foxes QA Notes

Date: 2026-07-03
Preview: http://127.0.0.1:3040/a-court-of-foxes

## Scope

- Production build check for the full Next.js app.
- Route smoke test for primary site pages, manifest, robots, and sitemap.
- Asset reference check for all Court of Foxes images in the reader component.
- Desktop browser QA at 1440 x 900.
- Mobile browser QA at 390 x 844.
- Reader flow checks through cover, Chapter 1, Chapter 8, fork choice, and the "Both" ending.

## Results

- Build: passed.
- Route smoke test: all tested routes returned 200.
- Court of Foxes assets: 54 references checked, 0 missing.
- Console errors during desktop and mobile reader passes: 0.
- Broken images during desktop and mobile reader passes: 0.
- Horizontal overflow: none detected on the tested desktop or mobile viewports.

## Issues Found And Fixed

- Desktop fork overlap: the fixed Sound control could overlap the lower-left edge of the "Cross the Dark" action, causing clicks to hit Sound instead of advancing.
  - Fix: the reader now marks fork/ending stage globally, and the Sound control shifts away from the fork action on desktop.

- Desktop fork continuation visibility: after selecting a path, the "Cross the Dark" button could sit partly below the 900px viewport.
  - Fix: the fork grid uses tighter row spacing and a two-column confirmation row on desktop.

- Mobile fork continuation visibility: after selecting a path, the continuation was below the mobile viewport and could be awkward near the fixed Glass controls.
  - Fix: selecting a path scrolls the confirmation into view, and the mobile fork screen has extra bottom space.

## Evidence Screenshots

- Desktop final fork selected: `screenshots/35-desktop-choice-selected-final-after-mobile-fix.png`
- Desktop final ending: `screenshots/36-desktop-ending-final-after-mobile-fix.png`
- Mobile cover: `screenshots/29-mobile-cover-final-fixed.png`
- Mobile Chapter 1: `screenshots/30-mobile-chapter1-final-fixed.png`
- Mobile Chapter 8: `screenshots/31-mobile-chapter8-final-fixed.png`
- Mobile fork: `screenshots/32-mobile-choice-final-fixed.png`
- Mobile fork selected: `screenshots/33-mobile-choice-selected-final-fixed.png`
- Mobile ending: `screenshots/34-mobile-ending-final-fixed.png`

## Notes

- This was a functional and visual QA pass, not a full WCAG audit.
- Chapters 1-8 are present in the current reader. The fork endings are reachable and currently reveal the Marok, Kitsu, or Both ending copy depending on the selected path.
