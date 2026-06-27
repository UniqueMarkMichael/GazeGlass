export const COMPONENT_STYLES = `
:host {
  --om-entry-bg: #171524;
  --om-entry-page-bg: #0b0a18;
  --om-entry-text: #f7f0df;
  --om-entry-subtext: #ded4bd;
  --om-entry-border: #d6b64b;
  --om-entry-focus: #f0d36b;
  display: block;
  position: relative;
  z-index: 0;
}

:host([data-om-open]) {
  z-index: 2147483647;
}

.om-entry {
  display: inline-grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.72rem;
  min-height: 44px;
  margin: 1rem 0;
  padding: 0.78rem 1.08rem 0.82rem 0.82rem;
  border: 1px solid var(--om-entry-border);
  border-radius: 999px;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 226, 143, 0.2), transparent 55%),
    linear-gradient(180deg, rgba(201, 162, 39, 0.18), rgba(201, 162, 39, 0.08)),
    var(--om-entry-bg);
  color: var(--om-entry-text);
  cursor: pointer;
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  box-shadow:
    inset 0 0 0 1px rgba(255, 236, 166, 0.08),
    0 12px 30px rgba(3, 2, 11, 0.24);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.om-entry:hover {
  border-color: #efd56e;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 230, 154, 0.28), transparent 58%),
    linear-gradient(180deg, rgba(201, 162, 39, 0.25), rgba(201, 162, 39, 0.11)),
    var(--om-entry-bg);
  box-shadow:
    inset 0 0 0 1px rgba(255, 236, 166, 0.14),
    0 16px 38px rgba(3, 2, 11, 0.3);
  transform: translateY(-1px);
}

.om-entry:active {
  transform: translateY(0);
  box-shadow:
    inset 0 0 0 1px rgba(255, 236, 166, 0.1),
    0 8px 22px rgba(3, 2, 11, 0.24);
}

.om-entry:focus-visible {
  outline: 3px solid var(--om-entry-focus);
  outline-offset: 4px;
}

.om-entry-glyph {
  display: grid;
  place-items: center;
  width: 2.2rem;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--om-entry-border), transparent 32%);
  border-radius: 50%;
  background: rgba(11, 10, 24, 0.64);
  color: var(--om-entry-focus);
  box-shadow: inset 0 0 18px rgba(201, 162, 39, 0.16);
}

.om-entry-glyph svg {
  width: 1.22rem;
  height: 1.22rem;
  stroke: currentColor;
  stroke-width: 1.8;
  fill: none;
}

.om-entry-copy {
  display: grid;
  gap: 0.08rem;
  min-width: 0;
  text-align: left;
}

.om-entry strong {
  font-weight: 720;
  line-height: 1.1;
}

.om-entry-copy span {
  color: var(--om-entry-subtext);
  font-size: 0.78rem;
  line-height: 1.15;
}

.om-source {
  display: block;
}

.om-block {
  box-sizing: border-box;
  position: relative;
  scroll-margin-block: 24vh;
  border-radius: 8px;
  transition:
    opacity var(--om-lantern-fade) cubic-bezier(0.4, 0, 0.2, 1),
    background-color var(--om-lantern-fade) cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow var(--om-lantern-fade) cubic-bezier(0.4, 0, 0.2, 1);
}

.om-image-block {
  position: relative;
  margin: clamp(2rem, 7vw, 4.8rem) 0;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 68%);
  background: var(--om-bg-elev);
  box-shadow: 0 1.4rem 4rem rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.om-image-block img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.om-image-block-wide img {
  aspect-ratio: 3 / 4;
}

.om-image-block figcaption {
  position: absolute;
  right: 1rem;
  bottom: 0.9rem;
  left: 1rem;
  z-index: 1;
  color: color-mix(in srgb, var(--om-text), transparent 18%);
  font-family: Georgia, serif;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-style: italic;
  line-height: 1.35;
  text-shadow: 0 0.15rem 1rem rgba(0, 0, 0, 0.8);
}

.om-image-block::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 46%, rgba(0, 0, 0, 0.5)),
    radial-gradient(circle at 50% 28%, transparent 0 42%, rgba(0, 0, 0, 0.18) 74%);
  pointer-events: none;
}

.om-root {
  --om-bg: #12131c;
  --om-bg-elev: #1b1c26;
  --om-text: #f5f0e6;
  --om-text-dim: #a9a493;
  --om-accent: #c9a227;
  --om-selection: rgba(201, 162, 39, 0.3);
  --om-measure: 38rem;
  --om-fs-body: 1.18rem;
  --om-lh-body: 1.7;
  --om-dur: 280ms;
  --om-lantern-dim: 0.42;
  --om-lantern-wash: color-mix(in srgb, var(--om-accent) 10%, transparent);
  --om-lantern-fade: var(--om-dur);
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: grid;
  width: 100%;
  max-width: 100%;
  height: 100dvh;
  min-height: 100svh;
  overflow: hidden;
  overflow-x: clip;
  overscroll-behavior: contain;
  touch-action: pan-y;
  isolation: isolate;
  background: var(--om-bg);
  color: var(--om-text);
  opacity: 0;
  pointer-events: none;
  transition: opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

.om-root[data-om-theme="parchment"] {
  --om-bg: #faf6ee;
  --om-bg-elev: #ffffff;
  --om-text: #262019;
  --om-text-dim: #5b5347;
  --om-accent: #8c6a18;
  --om-selection: rgba(140, 106, 24, 0.22);
}

.om-root[data-om-theme="moonlight"] {
  --om-bg: #1a2230;
  --om-bg-elev: #222c3d;
  --om-text: #dce3ec;
  --om-text-dim: #93a0b2;
  --om-accent: #b9c6da;
  --om-selection: rgba(185, 198, 218, 0.28);
}

.om-root[data-om-theme="aurora"] {
  --om-bg: #071f25;
  --om-bg-elev: #12343a;
  --om-text: #f4f0dc;
  --om-text-dim: #b7d3c9;
  --om-accent: #e0c25d;
  --om-selection: rgba(224, 194, 93, 0.25);
}

.om-root.is-open {
  opacity: 1;
  pointer-events: auto;
}

.om-threshold,
.om-witnessing {
  display: grid;
  place-items: center;
  min-height: 100%;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  height: 100%;
  padding:
    max(2rem, env(safe-area-inset-top))
    max(1rem, env(safe-area-inset-right))
    max(2rem, env(safe-area-inset-bottom))
    max(1rem, env(safe-area-inset-left));
}

.om-plate {
  width: min(34rem, 100%);
  text-align: center;
}

.om-plate h2 {
  margin: 0.4rem 0 0.8rem;
  font-family: Georgia, serif;
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 500;
}

.om-plate p {
  margin: 0;
  color: var(--om-text-dim);
  line-height: 1.6;
}

.om-mode-intro {
  display: grid;
  gap: 0.38rem;
  width: min(27rem, 100%);
  margin: 1.35rem auto 0;
  padding: 0.85rem 1rem;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 74%);
  border-radius: 12px;
  background: color-mix(in srgb, var(--om-bg-elev), transparent 32%);
  color: var(--om-text-dim);
  font-family: system-ui, sans-serif;
  font-size: 0.92rem;
  line-height: 1.45;
}

.om-mode-intro strong {
  color: var(--om-accent);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.om-promise,
.om-pleasure {
  display: grid;
  gap: 0.65rem;
  width: min(30rem, 100%);
  margin: 1rem auto 0;
  padding: 0.85rem 1rem;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 76%);
  border-radius: 12px;
  background: color-mix(in srgb, var(--om-bg-elev), transparent 42%);
}

.om-promise p,
.om-pleasure p {
  margin: 0;
}

.om-promise-options,
.om-pleasure-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.om-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.om-actions button,
.om-dock button,
.om-promise button,
.om-pleasure button,
.om-panel button {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 55%);
  border-radius: 999px;
  background: var(--om-bg-elev);
  color: var(--om-text);
  cursor: pointer;
  font-family: system-ui, sans-serif;
  font-size: inherit;
}

.om-actions button:disabled,
.om-dock button:disabled,
.om-promise button:disabled,
.om-pleasure button:disabled,
.om-panel button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.om-reading {
  box-sizing: border-box;
  width: min(var(--om-measure), calc(100% - 2rem));
  max-height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding:
    6rem clamp(1rem, 4vw, 2rem)
    calc(8rem + env(safe-area-inset-bottom))
    clamp(1rem, 4vw, 2rem);
  font-family: Georgia, serif;
  font-size: var(--om-fs-body);
  line-height: var(--om-lh-body);
  outline: none;
}

.om-root[data-spacing-mode="on"] .om-reading {
  --om-lh-body: 1.95;
}

.om-reading h1 {
  margin: 0 0 1.5rem;
  font-size: clamp(2.4rem, 9vw, 5.4rem);
  font-weight: 500;
  line-height: 1;
}

.om-reading p,
.om-reading blockquote,
.om-reading aside {
  margin: 0 0 1.35em;
}

.om-root[data-spacing-mode="on"] .om-reading p,
.om-root[data-spacing-mode="on"] .om-reading blockquote,
.om-root[data-spacing-mode="on"] .om-reading aside {
  margin-bottom: 1.75em;
}

.om-root[data-focus-mode="spotlight"] .om-block.om-dim {
  opacity: var(--om-lantern-dim);
}

.om-root[data-focus-mode="spotlight"] .om-block.is-lit {
  background-color: var(--om-lantern-wash);
  box-shadow: 0 0 0 0.42rem var(--om-lantern-wash);
  opacity: 1;
}

.om-root[data-focus-mode="band"] .om-block.om-dim {
  opacity: 0.38;
}

.om-root[data-focus-mode="band"] .om-block.is-lit {
  background:
    linear-gradient(
      90deg,
      rgba(201, 162, 39, 0.04),
      rgba(201, 162, 39, 0.22) 16%,
      rgba(201, 162, 39, 0.28) 50%,
      rgba(201, 162, 39, 0.22) 84%,
      rgba(201, 162, 39, 0.04)
    );
  box-shadow:
    0 0 0 0.52rem rgba(201, 162, 39, 0.16),
    inset 0 0 0 1px rgba(201, 162, 39, 0.42);
  opacity: 1;
  padding-block: clamp(0.8rem, 2.1vw, 1.25rem);
  padding-inline: clamp(1.45rem, 4.6vw, 2.5rem);
}

.om-root[data-focus-mode="ruler"] .om-block.is-ruler {
  background: rgba(201, 162, 39, 0.11);
  box-shadow: inset 0 -0.18rem 0 rgba(201, 162, 39, 0.72);
  padding-inline: clamp(0.7rem, 2.8vw, 1rem);
}

.om-root[data-focus-mode="ruler"] .om-block.is-ruler::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: clamp(-0.72rem, -2vw, -0.46rem);
  width: 0.24rem;
  border-radius: 999px;
  background: rgba(201, 162, 39, 0.82);
  box-shadow: 0 0 16px rgba(201, 162, 39, 0.34);
  pointer-events: none;
}

.om-root[data-focus-mode="ruler"] .om-block.is-ruler::after {
  content: "";
  position: absolute;
  right: -0.65rem;
  bottom: -0.44rem;
  left: -0.65rem;
  height: 3px;
  border-radius: 999px;
  background: rgba(201, 162, 39, 0.9);
  box-shadow: 0 0 20px rgba(201, 162, 39, 0.42);
  pointer-events: none;
}

.om-block.is-narrating {
  background-color: color-mix(in srgb, var(--om-accent) 13%, transparent);
  box-shadow: 0 0 0 0.42rem color-mix(in srgb, var(--om-accent) 10%, transparent);
}

.om-s.is-spoken {
  background: var(--om-selection);
  border-radius: 3px;
  box-shadow: inset 0 -0.08em 0 var(--om-accent);
}

.om-block.is-lost-anchor {
  background-color: color-mix(in srgb, var(--om-accent), transparent 88%);
  box-shadow:
    0 0 0 0.48rem color-mix(in srgb, var(--om-accent), transparent 90%),
    inset 0 0 0 1px color-mix(in srgb, var(--om-accent), transparent 62%);
}

.om-dock {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  left: max(1rem, env(safe-area-inset-left));
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem;
  border-radius: 999px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--om-bg), transparent 4%), var(--om-bg));
  box-shadow: 0 -24px 46px color-mix(in srgb, var(--om-bg), transparent 14%);
}

.om-split-control {
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) 44px;
  min-height: 44px;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 55%);
  border-radius: 999px;
  overflow: hidden;
  background: var(--om-bg-elev);
}

.om-dock .om-split-control button {
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.om-lantern-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.68rem 0.78rem;
}

.om-lantern-toggle[aria-pressed="true"] {
  background:
    radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--om-accent), transparent 72%), transparent 70%),
    color-mix(in srgb, var(--om-accent), var(--om-bg-elev) 76%);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--om-accent), transparent 45%);
}

.om-lantern-icon,
.om-focus-more svg {
  width: 1.08rem;
  height: 1.08rem;
  flex: 0 0 auto;
}

.om-lantern-icon svg,
.om-focus-more svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.75;
}

.om-lantern-fill {
  fill: currentColor;
  opacity: 0;
  stroke: none;
  transition: opacity var(--om-lantern-fade) cubic-bezier(0.4, 0, 0.2, 1);
}

.om-lantern-toggle[aria-pressed="true"] .om-lantern-fill {
  opacity: 1;
}

.om-focus-more {
  display: grid;
  place-items: center;
  border-left: 1px solid color-mix(in srgb, var(--om-accent), transparent 65%) !important;
}

.om-focus-more[aria-expanded="true"] {
  background: color-mix(in srgb, var(--om-accent), var(--om-bg-elev) 86%);
}

.om-status {
  display: grid;
  gap: 0.12rem;
  min-height: 44px;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--om-bg-elev), transparent 10%);
  color: var(--om-text-dim);
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
}

.om-status [data-status-scene] {
  color: var(--om-text-dim);
}

.om-status [data-status-promise] {
  color: color-mix(in srgb, var(--om-accent), var(--om-text) 26%);
  font-size: 0.75rem;
}

.om-status [data-status-pleasure] {
  color: color-mix(in srgb, var(--om-text-dim), var(--om-accent) 36%);
  font-size: 0.72rem;
}

.om-panel {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: calc(max(1rem, env(safe-area-inset-bottom)) + 4.6rem);
  z-index: 3;
  width: min(25rem, calc(100vw - 2rem));
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 45%);
  border-radius: 14px;
  background: color-mix(in srgb, var(--om-bg-elev), var(--om-bg) 18%);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
}

.om-lost-card,
.om-resume-card,
.om-rest-card,
.om-echo-card,
.om-memory-card {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: calc(max(1rem, env(safe-area-inset-bottom)) + 4.6rem);
  z-index: 3;
  width: min(28rem, calc(100vw - 2rem));
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 38%);
  border-radius: 14px;
  background:
    radial-gradient(circle at 12% 0%, color-mix(in srgb, var(--om-accent), transparent 82%), transparent 9rem),
    color-mix(in srgb, var(--om-bg-elev), var(--om-bg) 12%);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
}

.om-panel-close {
  float: right;
}

.om-panel-kicker {
  margin: 0 0 0.4rem;
  color: var(--om-accent);
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.om-panel h2 {
  margin: 0 3.5rem 0.55rem 0;
  font-family: Georgia, serif;
  font-size: 1.55rem;
  font-weight: 500;
}

.om-lost-card h2,
.om-resume-card h2,
.om-rest-card h2,
.om-echo-card h2,
.om-memory-card h2 {
  margin: 0 3.5rem 0.55rem 0;
  font-family: Georgia, serif;
  font-size: 1.55rem;
  font-weight: 500;
}

.om-panel p {
  margin: 0 0 1rem;
  color: var(--om-text-dim);
  line-height: 1.55;
}

.om-lost-card p,
.om-resume-card p,
.om-rest-card p,
.om-echo-card p,
.om-memory-card p {
  margin: 0 0 1rem;
  color: var(--om-text-dim);
  line-height: 1.55;
}

.om-lost-card blockquote,
.om-resume-card blockquote,
.om-rest-card blockquote,
.om-echo-card blockquote,
.om-memory-card blockquote {
  margin: 0 0 1rem;
  padding: 0.75rem 0.86rem;
  border-left: 3px solid color-mix(in srgb, var(--om-accent), transparent 24%);
  border-radius: 8px;
  background: color-mix(in srgb, var(--om-accent), transparent 92%);
  color: var(--om-text);
  font-family: Georgia, serif;
  font-size: 1rem;
  line-height: 1.5;
}

.om-read-hidden {
  display: none !important;
}

.om-memory-list {
  display: grid;
  gap: 0.75rem;
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
}

.om-memory-list li {
  display: grid;
  gap: 0.2rem;
  padding: 0.72rem 0.82rem;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 78%);
  border-radius: 10px;
  background: color-mix(in srgb, var(--om-accent), transparent 94%);
}

.om-memory-list span {
  color: var(--om-text-dim);
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.4;
}

.om-panel-field-label {
  margin: 0 0 0.45rem;
  color: var(--om-accent);
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.om-panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.om-audio-track-options {
  margin-bottom: 0.75rem;
}

.om-pace-options {
  margin-bottom: 0.85rem;
}

.om-mobile-jolt {
  display: none;
}

.om-mobile-jolt p:last-child {
  margin-top: 0.55rem;
}

.om-panel-actions:has([data-audio-action]) {
  margin-bottom: 1rem;
}

.om-read-aloud-status {
  margin: 0;
  padding: 0.68rem 0.82rem;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 72%);
  border-radius: 10px;
  background: color-mix(in srgb, var(--om-accent), transparent 91%);
  color: color-mix(in srgb, var(--om-text), var(--om-text-dim) 32%);
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
  line-height: 1.45;
}

.om-panel-field {
  display: grid;
  gap: 0.45rem;
  margin-top: 0.85rem;
}

.om-panel-field > span {
  color: var(--om-text-dim);
  font-family: system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.om-stepper {
  display: inline-flex;
  gap: 0.5rem;
}

.om-stepper button {
  width: 2.75rem;
  min-width: 2.75rem;
  padding-right: 0.65rem;
  padding-left: 0.65rem;
}

.om-panel-actions button[role="radio"][aria-checked="true"],
.om-promise button[role="radio"][aria-checked="true"],
.om-pleasure button[role="radio"][aria-checked="true"],
.om-panel-actions button[data-spacing-toggle][aria-pressed="true"],
.om-panel-actions button[data-jolt-toggle][aria-pressed="true"],
.om-panel-actions button[data-audio-action][aria-pressed="true"] {
  border-color: color-mix(in srgb, var(--om-accent), transparent 22%);
  background: color-mix(in srgb, var(--om-accent), var(--om-bg-elev) 78%);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--om-accent), transparent 58%);
}

.om-panel-actions button[aria-disabled="true"] {
  opacity: 0.58;
}

.om-panel-actions button[aria-disabled="true"]:hover {
  border-color: color-mix(in srgb, var(--om-accent), transparent 45%);
}

.om-toast {
  position: fixed;
  left: 50%;
  bottom: calc(max(1rem, env(safe-area-inset-bottom)) + 5.25rem);
  z-index: 4;
  transform: translateX(-50%);
  padding: 0.75rem 1rem;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 45%);
  border-radius: 999px;
  background: var(--om-bg-elev);
  color: var(--om-text);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

.om-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 680px) {
  .om-root {
    --om-measure: 100%;
    --om-fs-body: clamp(1.1rem, 4.9vw, 1.3rem);
  }

  .om-threshold {
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    padding:
      calc(env(safe-area-inset-top) + 1.2rem)
      max(1rem, env(safe-area-inset-right))
      calc(env(safe-area-inset-bottom) + 1.2rem)
      max(1rem, env(safe-area-inset-left));
  }

  .om-plate {
    padding: 1.5rem 0;
  }

  .om-plate h2 {
    font-size: clamp(2.15rem, 11vw, 3.5rem);
    line-height: 0.98;
  }

  .om-actions {
    display: grid;
    max-width: 20rem;
    margin-right: auto;
    margin-left: auto;
  }

  .om-actions button {
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: 16px;
  }

  .om-witnessing {
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 0;
    overflow: hidden;
  }

  .om-reading {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    height: 100%;
    max-height: none;
    margin: 0;
    padding:
      calc(env(safe-area-inset-top) + 1.35rem)
      max(1.15rem, env(safe-area-inset-right))
      calc(10.6rem + env(safe-area-inset-bottom))
      max(1.15rem, env(safe-area-inset-left));
    line-height: 1.68;
  }

  .om-reading h1 {
    margin-bottom: 1.2rem;
    font-size: clamp(2.1rem, 10vw, 3.4rem);
    line-height: 1;
  }

  .om-reading p,
  .om-reading blockquote,
  .om-reading aside {
    margin-bottom: 1.18em;
  }

  .om-dock {
    right: auto;
    bottom: calc(0.7rem + env(safe-area-inset-bottom));
    left: 50%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    width: min(25.5rem, calc(100% - 1.2rem));
    gap: 0.48rem;
    padding: 0.62rem;
    border: 1px solid color-mix(in srgb, var(--om-accent), transparent 65%);
    border-radius: 22px;
    background:
      radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--om-accent), transparent 88%), transparent 6.5rem),
      linear-gradient(180deg, color-mix(in srgb, var(--om-bg-elev), transparent 1%), var(--om-bg));
    box-shadow:
      0 -22px 52px color-mix(in srgb, var(--om-bg), transparent 8%),
      inset 0 0 24px color-mix(in srgb, var(--om-text), transparent 97%);
    backdrop-filter: blur(22px);
    transform: translateX(-50%);
  }

  .om-status {
    order: -1;
    flex: 0 0 100%;
    min-height: 0;
    padding: 0.18rem 0.45rem 0.24rem;
    border-radius: 0;
    background: transparent;
    text-align: center;
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    line-height: 1.25;
    text-transform: uppercase;
  }

  .om-dock button {
    box-sizing: border-box;
    flex: 1 1 4.75rem;
    min-width: 0;
    height: 46px;
    min-height: 46px;
    padding: 0.56rem 0.5rem;
    border-radius: 14px;
    font-family: system-ui, sans-serif;
    font-size: clamp(0.7rem, 3vw, 0.78rem);
    line-height: 1.12;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .om-split-control {
    box-sizing: border-box;
    flex: 1 1 5.55rem;
    grid-template-columns: minmax(0, 1fr) 2.4rem;
    min-width: 5.55rem;
    height: 46px;
    min-height: 46px;
    border-radius: 14px;
  }

  .om-dock .om-split-control button {
    height: 100%;
    min-height: 0;
    padding: 0.56rem 0.25rem;
  }

  .om-lantern-toggle {
    gap: 0.22rem;
    min-width: 0;
    padding-right: 0.34rem;
    padding-left: 0.34rem;
  }

  .om-lantern-icon {
    display: none;
  }

  .om-lantern-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .om-dock button[data-action="exit"] {
    flex: 1 1 4.75rem;
    height: 46px;
    min-height: 46px;
    font-size: clamp(0.7rem, 3vw, 0.78rem);
  }

  .om-mobile-jolt {
    display: block;
    margin-top: 1rem;
    padding-top: 0.95rem;
    border-top: 1px solid color-mix(in srgb, var(--om-accent), transparent 76%);
  }

  .om-dock:has([data-action="images"]) > button,
  .om-dock:has([data-action="images"]) > .om-split-control {
    flex: 0 1 calc((100% - 0.96rem) / 3);
    max-width: calc((100% - 0.96rem) / 3);
  }

  .om-panel,
  .om-lost-card,
  .om-resume-card,
  .om-rest-card,
  .om-echo-card,
  .om-memory-card {
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: calc(10.05rem + env(safe-area-inset-bottom));
    left: max(0.75rem, env(safe-area-inset-left));
    width: auto;
    max-height: calc(100dvh - 11.4rem);
    overflow: auto;
    border-radius: 16px;
  }

  .om-toast {
    bottom: calc(10.45rem + env(safe-area-inset-bottom));
    width: min(24rem, calc(100vw - 2rem));
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .om-root {
    --om-lantern-fade: 0ms;
    transition: none;
  }

  .om-block,
  .om-lantern-fill {
    transition: none;
  }
}

@media (prefers-contrast: more) {
  .om-root {
    --om-lantern-dim: 0.5;
  }
}
`;
