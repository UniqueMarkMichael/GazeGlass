# Gaze Glass QA Notes - 2026-06-26

## Scope

- Desktop viewport: 1440 x 1000
- Mobile viewport: 390 x 844
- Pages checked: home, observations archive, mortals, gods, spirits, seer, and all five mortal observation pages.
- Immersive reader checked on Marcella: entry screen, View, Leave, sound panel, Reading Mode, Reading Room, Read Aloud controls, text controls, and mobile layout.

## Results

- Production build passes.
- TypeScript check passes.
- Public pages loaded without console errors.
- Main route images loaded without broken image reports.
- All five observation pages loaded with titles, story text, no broken images, and no empty links.
- Mobile observation page and immersive reader reported no horizontal overflow.

## Fixes Made During QA

- Hardened the focus-audio track switching path so an old stopped audio object cannot flip the UI back to an inactive state after a new track is selected.
- Confirmed Reading Mode and Reading Room are treated as play actions, not passive selectors.
- Added a stronger visual shield behind the immersive-reader bottom dock so story text does not visually bleed through the controls.

## Test Limitation

- The automated browser could confirm that the MP3 files are served correctly as `audio/mpeg`, but it could not prove audible playback because browser automation may block or suppress media playback. Manual click testing in a real browser is still recommended for sound.

## Evidence

Screenshots are saved in this folder:

- `01-desktop-home.png`
- `02-desktop-observations.png`
- `03-desktop-mortals.png`
- `04-desktop-gods.png`
- `05-desktop-spirits.png`
- `06-desktop-seer.png`
- `07-desktop-observation-entry.png`
- `08-desktop-immersive-entry.png`
- `09-desktop-immersive-reading.png`
- `10-desktop-sound-panel.png`
- `13-desktop-sound-after-race-fix.png`
- `14-mobile-home.png`
- `15-mobile-observations.png`
- `16-mobile-observation-entry.png`
- `17-mobile-immersive-entry.png`
- `18-mobile-immersive-reading.png`
- `19-mobile-sound-panel.png`
- `20-desktop-reading-after-dock.png`
- `20-desktop-sound-after-dock.png`
- `21-mobile-reading-after-dock.png`
- `21-mobile-sound-after-dock.png`
