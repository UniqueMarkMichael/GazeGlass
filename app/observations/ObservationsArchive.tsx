"use client";

import { useMemo, useState } from "react";
import { magnitudeMeta, observations, regionMeta, type ObservationMagnitude, type ObservationRegion } from "./data";

type RegionFilter = "all" | ObservationRegion;
type MagnitudeFilter = "all" | ObservationMagnitude;
type SortKey = "newest" | "oldest" | "readTime" | "magnitude";

const regionFilters: Array<{ label: string; value: RegionFilter }> = [
  { label: "All", value: "all" },
  { label: "Gods", value: "gods" },
  { label: "Spirits", value: "spirits" },
  { label: "Mortals", value: "mortals" },
];

const magnitudeFilters: Array<{ label: string; value: MagnitudeFilter }> = [
  { label: "All Scales", value: "all" },
  { label: "Observations", value: "observation" },
  { label: "Stories", value: "story" },
  { label: "Novellas", value: "novella" },
  { label: "Novels", value: "novel" },
];

function readMinutes(readTime: string) {
  return Number.parseInt(readTime, 10) || 0;
}

export function ObservationsArchive() {
  const [region, setRegion] = useState<RegionFilter>("all");
  const [magnitude, setMagnitude] = useState<MagnitudeFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    return [...observations]
      .filter((observation) => region === "all" || observation.region === region)
      .filter((observation) => magnitude === "all" || observation.magnitude === magnitude)
      .sort((a, b) => {
        if (sort === "oldest") {
          return a.dateObserved.localeCompare(b.dateObserved);
        }

        if (sort === "readTime") {
          return readMinutes(a.readTime) - readMinutes(b.readTime);
        }

        if (sort === "magnitude") {
          return magnitudeMeta[b.magnitude].weight - magnitudeMeta[a.magnitude].weight;
        }

        return b.dateObserved.localeCompare(a.dateObserved);
      });
  }, [magnitude, region, sort]);

  return (
    <section className="observation-archive reveal" aria-label="Observation archive">
      <div className="archive-toolbar">
        <div>
          <p className="eyebrow">The Archive</p>
          <h2>Recorded Lights</h2>
        </div>
        <label>
          Sort
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="readTime">Reading time</option>
            <option value="magnitude">Magnitude</option>
          </select>
        </label>
      </div>

      <div className="archive-filters" aria-label="Filter observations by region">
        {regionFilters.map((filter) => (
          <button
            className={region === filter.value ? "is-active" : ""}
            key={filter.value}
            type="button"
            onClick={() => setRegion(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="archive-filters magnitude-filters" aria-label="Filter observations by magnitude">
        {magnitudeFilters.map((filter) => (
          <button
            className={magnitude === filter.value ? "is-active" : ""}
            key={filter.value}
            type="button"
            onClick={() => setMagnitude(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="observation-list" aria-live="polite">
        {filtered.map((observation) => (
          <a className="observation-row" href={`/observations/${observation.slug}`} key={observation.slug}>
            <span className={`magnitude-mark magnitude-${observation.magnitude}`} aria-hidden="true" />
            <span className="observation-row-number">{observation.number}</span>
            <span>
              <strong>{observation.title}</strong>
              <em>
                {observation.association} / {regionMeta[observation.region].title}
              </em>
            </span>
            <span>{observation.readTime}</span>
            <span>{observation.magnitudeLabel}</span>
            <span aria-hidden="true">View</span>
          </a>
        ))}
      </div>
    </section>
  );
}
