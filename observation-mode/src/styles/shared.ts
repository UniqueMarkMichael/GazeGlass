export const COMPONENT_STYLES = `
:host {
  display: block;
}

.om-entry {
  display: inline-flex;
  flex-direction: column;
  gap: 0.2rem;
  min-height: 44px;
  margin: 1rem 0;
  padding: 0.72rem 1rem;
  border: 1px solid #c9a227;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.om-entry span {
  font-size: 0.78rem;
  opacity: 0.72;
}

.om-source {
  display: block;
}

.om-block {
  scroll-margin-block: 24vh;
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
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
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

.om-root.is-open {
  opacity: 1;
  pointer-events: auto;
}

.om-threshold,
.om-witnessing {
  display: grid;
  place-items: center;
  min-height: 100%;
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

.om-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.om-actions button,
.om-dock button,
.om-panel button {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid color-mix(in srgb, var(--om-accent), transparent 55%);
  border-radius: 999px;
  background: var(--om-bg-elev);
  color: var(--om-text);
  cursor: pointer;
  font: inherit;
}

.om-actions button:disabled,
.om-dock button:disabled,
.om-panel button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.om-reading {
  width: min(var(--om-measure), 100%);
  max-height: 100%;
  overflow: auto;
  padding: 6rem 0;
  font-family: Georgia, serif;
  font-size: var(--om-fs-body);
  line-height: var(--om-lh-body);
}

.om-root[data-focus-mode="spacing"] .om-reading {
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

.om-root[data-focus-mode="spacing"] .om-reading p,
.om-root[data-focus-mode="spacing"] .om-reading blockquote,
.om-root[data-focus-mode="spacing"] .om-reading aside {
  margin-bottom: 1.75em;
}

.om-s.is-spoken {
  background: var(--om-selection);
  border-radius: 3px;
  box-shadow: inset 0 -0.08em 0 var(--om-accent);
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
}

.om-status {
  min-height: 44px;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--om-bg-elev), transparent 10%);
  color: var(--om-text-dim);
  font-family: system-ui, sans-serif;
  font-size: 0.82rem;
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

.om-panel p {
  margin: 0 0 1rem;
  color: var(--om-text-dim);
  line-height: 1.55;
}

.om-panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
  .om-dock {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .om-panel {
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: calc(max(0.75rem, env(safe-area-inset-bottom)) + 5.8rem);
    left: max(0.75rem, env(safe-area-inset-left));
    width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .om-root {
    transition: none;
  }
}
`;
