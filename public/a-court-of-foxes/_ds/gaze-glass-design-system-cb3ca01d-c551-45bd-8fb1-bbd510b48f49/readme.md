# Gaze Glass — Design System

> *"Welcome, Mortal. Look through the glass."*

Gaze Glass is not an author website. It is a **Divine Observatory** — an immersive fantasy world brought to life through an interactive site that gives mortals the power to conjure meaning from moments shared between humans and the unseen forces shaping their lives.

Every design decision reinforces four constants: **mystery, reverence, observation, and meaning.** Each page should feel like a chapter of a sacred book rather than a marketing website. The emotional target is a single feeling:

> *"I have discovered a place that was waiting for me."*

---

## Sources

This system was built from brand materials supplied by the team, plus the live site:

- **Live site:** [www.gazeglass.com](https://www.gazeglass.com)
- **GitHub:** [UniqueMarkMichael/GazeGlass](https://github.com/UniqueMarkMichael/GazeGlass) — *not yet connected during this build.* Connect GitHub via the Import menu to let future design work reference the real site code for pixel-accurate UI recreations.
- **Uploads:** logos (color / black / white), color palette, typography guide, `Gaze_Glass_Typography_System.pdf`, brand illustration, and the *Family of Mortals* key art.

If you have access to the repo above, explore it to recreate product surfaces more faithfully than brand materials alone allow.

---

## Content fundamentals

**Who is speaking.** Gaze Glass speaks as an ancient observer addressing a single mortal. It is reverent, unhurried, and certain — the voice of something that has watched for a very long time.

- **Person.** Address the reader directly, often as **"Mortal."** Speak of the gods in the **present tense** ("The divine watches"). The brand refers to itself rarely and never as "we, the company."
- **Tone.** Quiet confidence. Meaning arrives slowly. Favor short, declarative, mythic sentences over explanation.
- **Casing.** Sentence case for body. Section labels (eyebrows) are UPPERCASE with wide tracking (0.22em), often numbered like museum placards ("01 / The Seer Records").
- **Emoji.** Never. The only recurring glyph is the four-point spark **✦** (and occasionally **◆**) used as ornament.
- **Never.** Sarcastic · cynical · corporate · sales-driven. No SaaS phrasing, no "Sign up now!", no growth-hack urgency.

**Voice examples:**
- "Welcome, Mortal."
- "Look through the glass."
- "There are many lives yet to witness."
- "Your name is recorded." (a confirmation, not "Success!")

---

## Visual foundations

**Colors.** Dark by default — the observatory between worlds. The palette is treated as physics: gold light enters the dark, passes through the glass, and fractures into the divine spectrum.

- **Primary:** Ink Indigo `#1A1733` (the night sky of the gods) · Gold Leaf `#C9A227` (divine illumination) · Parchment Bone `#EDE3CC` (ancient knowledge).
- **Divine spectrum (accents, ~5% of any surface):** Larimar `#5FB7C4` (love) · Honey Amber `#E0A030` (vision) · Magenta Aura `#B5179E` (beauty).
- **Proportion:** roughly 70% ink / 15% parchment / 10% gold / 5% spectrum. **Gold is illumination, never decoration** — use it sparingly, once per view as the focal call.
- A deeper ink scale (`--gg-ink-900 … --gg-ink-400`) provides backdrops, surfaces, and hairline borders.

**Typography — three voices, one story.**
- **Gods = Playfair Display** (weight 600): hero headlines, god names, section titles, pull quotes. Dramatic, mythic.
- **Mortals = Mulish** (400/500/600): body, navigation, forms, buttons. Clear and human — never below 16px.
- **Spirits = EB Garamond** (italic, 20–32px): letters, signatures, epigraphs, the Seer's voice. Timeless and remembered.
- Two faces on screen at most. Never long body copy in a serif. Never trendy or futuristic typefaces.

**Layout & space.** Large editorial layouts, generous negative space, museum-quality breathing room. Section rhythm uses 96–128px vertical space; chapter breaks more. Content max ~1180px, prose ~68ch. Favor slow discovery over dense dashboards.

**Backgrounds.** Deep ink fields, occasionally lifted by a faint radial gold glow (`--gg-radial-glow`) behind focal content. Atmospheric illustration (watercolor + ink) is used full-bleed for hero moments, veiled with gradients so text stays legible. No flat startup gradients; no stock photography.

**Corners & borders.** Etched, not bubbly. Radii are restrained: 2–4px on most surfaces, 8px max, pill only for badges. Borders are thin — hairline parchment (`--gg-hairline`) or a faint gold edge (`--gg-border-gold`). Cards carry an illuminated top hairline rather than heavy chrome.

**Shadows & glow.** Deep, atmospheric shadows (never harsh black drops). Gold glow (`--gg-glow-gold`, `--gg-glow-gold-soft`) is reserved for sacred / featured elements and focus states.

**Motion.** Slow discovery. Reverent ease-out (`--gg-ease`), durations 200–900ms. Content fades and rises into view on scroll. **Nothing bounces.** Respect `prefers-reduced-motion`.

**States.** Hover lightens gold (`--gg-gold-bright`) or brightens text to gold; links gain a subtle indent. Press shrinks slightly (`translateY(1px)`). Focus uses a gold ring / glow, never a default blue outline. Inputs are underline-only by default (boxed only on parchment forms).

**Transparency & blur.** Used sparingly for caustic-glass veils over imagery — parchment films at 4–14% opacity, optional backdrop blur (`--gg-blur`) for overlays.

---

## Iconography

Gaze Glass has **no icon library** — its iconography is restrained and symbolic, not utilitarian.

- The **four-point spark ✦** (and **◆**) are the brand's primary glyphs, used as ornament, list markers, divider centers, and confirmation marks. They are Unicode characters set in the active typeface, tinted gold.
- The **logo mark** (the spark held within a circular lens) is the central symbol — see `assets/logo-mark-*.png`.
- No emoji. No multi-color icon sets. If a product surface genuinely needs functional UI icons (nav, close, arrows), use **thin-stroke line glyphs** that match the etched hairline aesthetic, kept monochrome (parchment or gold). Prefer a Unicode arrow (→) or the spark over importing a chunky icon set.
- When a future need calls for a real icon font, substitute the lightest-weight option available (e.g. Phosphor Thin / Lucide at 1px) and flag the substitution.

---

## Visual assets

Located in `assets/`:

- `logo-mark-color.png` · `logo-mark-black.png` · `logo-mark-white.png` — the mark on indigo, parchment, and void.
- `illustration-world-through-glass.png` — the brand illustration (orb · mirror · stained glass).
- `family-of-mortals.png` — *Family of Mortals* key art.
- `reference-color-palette.png` · `reference-typography-guide.png` — original supplied reference sheets.

---

## Index — what's in this system

**Foundations** (`styles.css` → `tokens/`)
- `tokens/fonts.css` — the three Google-Font voices.
- `tokens/colors.css` — primary, spectrum, ink scale + semantic aliases.
- `tokens/typography.css` — families, scale, weights, tracking.
- `tokens/spacing.css` — spacing scale, layout maxes, radii.
- `tokens/effects.css` — shadows, glows, gradients, motion easings.

**Components** (`components/core/`) — React primitives on the design tokens:
- `Button` · `Badge` · `Card` · `Input` · `Eyebrow` · `Divider`

**Guidelines** (`guidelines/`) — specimen cards shown in the Design System tab (Colors, Type, Spacing, Brand).

**Deliverables**
- `Gaze Glass Brand Book.html` — the full agency-style brand identity book.
- `Family of Mortals Landing.html` — email-capture landing page for the *Family of Mortals* chronicle.

**Meta**
- `SKILL.md` — makes this system portable as an Agent Skill.

---

## Fonts — substitution note

All three typefaces (**Playfair Display, Mulish, EB Garamond**) are served from Google Fonts and match the brand's typography guide exactly. No local font binaries were supplied; if you have licensed/optimized versions, drop them in and add `@font-face` rules to `tokens/fonts.css`.

---

*Gods Watch · Mortals Pray · Spirits Remember.*
