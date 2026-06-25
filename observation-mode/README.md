# Gaze Glass Observation Mode

Observation Mode is the progressive-enhancement reading layer for Gaze Glass.

The prose must always remain readable as normal HTML. The Web Component only adds the Threshold, Witnessing shell, controls, sentence IDs, and future reading support.

```html
<script src="/observation-mode/observation-mode.umd.cjs"></script>
<observation-mode manifest-src="/observations/obs-002.json">
  <article class="om-source">
    <h1>Marcella, Blessed by Justice</h1>
    <p>The full story remains here for search engines, screen readers, and no-JS readers.</p>
  </article>
</observation-mode>
```

Safe defaults currently assumed from the spec:

- Host stack: framework-agnostic Web Component, hydrate existing HTML first.
- Narration: no human audio required yet; later milestones add labelled TTS fallback.
- Analytics: no-op by default, opt-in only.
- Typeface: CSS tokens are prepared; bundled font files are not included yet.

Current milestone coverage:

- M0 scaffold and contracts.
- M1 progressive-enhancement shell, FSM, path A parsing, path B rendering, and sentence IDs.
