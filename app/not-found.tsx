import { GlassMenu } from "./components/GlassMenu";

export default function NotFound() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-lockup-spectrum-gold.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="not-found">
        <div className="stars" aria-hidden="true" />
        <div className="not-found-lens" aria-hidden="true" />
        <p className="eyebrow">Wrong Turn</p>
        <h1>This lens has not been ground yet.</h1>
        <p>
          You reached for a glass that does not exist, or not yet. The Seer keeps
          only what has passed through the instrument, and this has not.
        </p>
        <a className="text-link" href="/#home">
          Return to the first glass
        </a>
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
