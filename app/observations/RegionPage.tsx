import type { CSSProperties } from "react";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import {
  formatObservationReadTime,
  getObservationHref,
  getRegionObservations,
  magnitudeMeta,
  regionMeta,
  type ObservationRegion,
} from "./data";

type RegionPageProps = {
  region: ObservationRegion;
};

const regionRecordLabels: Record<ObservationRegion, {
  singular: string;
  plural: string;
  note: string;
}> = {
  gods: {
    singular: "pressure recorded",
    plural: "pressures recorded",
    note: "The Glass is still recording. New divine pressure opens here as it is witnessed.",
  },
  spirits: {
    singular: "memory kept",
    plural: "memories kept",
    note: "The Glass is still recording. New spirit memory opens here as it is witnessed.",
  },
  mortals: {
    singular: "life witnessed",
    plural: "lives witnessed",
    note: "The Glass is still recording. New mortal lives open here as they are witnessed.",
  },
};

export function RegionPage({ region }: RegionPageProps) {
  const meta = regionMeta[region];
  const records = getRegionObservations(region);
  const recordLabel = regionRecordLabels[region];
  const regionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://www.gazeglass.com/observations/${region}/#webpage`,
    url: `https://www.gazeglass.com/observations/${region}`,
    name: `${meta.title} Observations`,
    description: meta.description,
    isPartOf: {
      "@id": "https://www.gazeglass.com/observations/#webpage",
    },
  };

  return (
    <main>
      <JsonLd data={regionData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className={`region-hero region-${region}`} aria-label={`${meta.title} observations`}>
        <div className="stars" aria-hidden="true" />
        <a className="back-link" href="/observations">
          Back to the Observatory
        </a>
        <p className="eyebrow">{meta.instrument}</p>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </section>

      <section className="region-constellation reveal" aria-label={`${meta.title} record cluster`}>
        <div className="constellation-map" aria-hidden="true">
          {records.map((record, index) => (
            <span className={`magnitude-${record.magnitude}`} key={record.slug} style={{ "--i": index } as CSSProperties} />
          ))}
        </div>
        <div>
          <p className="eyebrow">Witnessed in this region</p>
          <h2>
            {records.length} {records.length === 1 ? recordLabel.singular : recordLabel.plural}.
          </h2>
          <p>{meta.subtitle} {recordLabel.note}</p>
        </div>
      </section>

      <section className="region-records reveal" aria-label={`${meta.title} observation records`}>
        {records.map((record) => (
          <a className="region-record" href={getObservationHref(record)} key={record.slug}>
            <span className={`magnitude-mark magnitude-${record.magnitude}`} aria-hidden="true" />
            <span>{record.number}</span>
            <strong>{record.title}</strong>
            <em>{record.association}</em>
            <small>
              {formatObservationReadTime(record)} / {magnitudeMeta[record.magnitude].label}
            </small>
          </a>
        ))}
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
