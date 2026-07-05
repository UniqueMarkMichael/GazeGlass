# Gaze Glass Accessibility QA

Date: July 5, 2026

## Scope

Accessibility pass for the A Court of Foxes reader, focused on:

- Keyboard entry into the reader
- Focus order and focus visibility
- Reader control labels and state
- Screen-reader-oriented semantics
- Witness Choice state announcement
- Mobile reflow

Screenshots live in:

`audits/2026-07-05-gaze-glass-accessibility/screenshots/`

## Result

The A Court of Foxes reader is now stronger for keyboard and assistive-technology users. The most important improvements were adding a skip link into the story, removing hidden global controls from the keyboard path, making Beauty-sight keyboard-accessible, and giving choice/progress states better semantics.

This is not a full WCAG certification. It is a targeted accessibility QA pass based on DOM semantics, keyboard-oriented browser checks, screenshots, and project checks. A final manual VoiceOver/NVDA pass is still recommended before launch.

## Fixes Applied

- Added a "Skip to story text" link at the start of the reader state.
- Focus now moves to the chapter heading when the reader opens or the chapter changes.
- Added progressbar semantics to reader progress.
- Added `aria-current` to the active chapter.
- Added a clearer label and pressed state to the day/night reader toggle.
- Renamed the support region from "ADHD reader supports" to "Reader support tools."
- Added roving tabindex and arrow-key support to the pace selector.
- Made the Beauty-sight image keyboard focusable with a clear role and label.
- Added live status semantics to Witness Choice confirmation.
- Added pressed states to route/witness choices.
- Removed hidden global memory/audio controls from the keyboard focus path inside A Court of Foxes.

## Verification

Passed:

- Production build completes successfully.
- Git whitespace check passes.
- Project contrast check passes.
- No console errors in the verified reader pass.
- No visible controls without accessible names were found.
- No visible images without `alt` text were found.
- No horizontal overflow was found on desktop or mobile.
- Reader opens with focus on the chapter heading.
- Skip link exists as the first reader focus target.
- Hidden global controls are no longer present in the reader focus order.
- Beauty-sight has a keyboard role, label, and focus behavior.
- Pace selector responds to arrow-key movement and keeps only one radio option in the tab order.
- Witness Choice selection updates `aria-pressed` and announces confirmation through a polite status region.

## Screenshots

- `01-cover-initial.png` - cover before entering the reader.
- `02-reader-after-entering.png` - reader after entering from the cover.
- `03-beauty-sight-keyboard.png` - Beauty-sight keyboard target state.
- `04-pace-arrow-key.png` - pace selector after arrow-key movement.
- `05-witness-choice-selected.png` - Witness Choice after selection.
- `06-mobile-reader-accessibility.png` - mobile reader state.
- `08-reader-accessibility-final.png` - final desktop reader verification.
- `09-mobile-accessibility-final.png` - final mobile reader verification.

## Remaining Risks

- The browser automation surface did not produce normal Enter/Space activation for native buttons, so button activation should still be checked manually with a physical keyboard.
- A real screen-reader pass was not run. VoiceOver on macOS/iOS and NVDA on Windows should be used before production confidence.
- The chapter rail is long. The new skip link prevents it from trapping readers before the story, but future work could add a second skip target for "Reader tools" if keyboard users need faster access to those controls.

## Verdict

The reader is meaningfully more accessible now. It keeps the visual mood intact while giving keyboard and assistive-technology users clearer paths, labels, state, and escape routes.
