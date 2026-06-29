"use client";

import { useMemo, useState } from "react";
import { playGlassSound } from "../components/glassSound";
import {
  formatObservationReadTime,
  getObservationHref,
  godFilterLabels,
  observations,
  regionMeta,
  spiritFilterLabels,
  type GodId,
  type SpiritId,
} from "./data";

type GodFilter = "all" | GodId;
type SpiritFilter = "all" | SpiritId;
type ThemeFilter = "all" | string;
type SortKey = "order" | "newest";

function formatThemeLabel(tag: string) {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const godFilters: Array<{ label: string; value: GodFilter }> = [
  { label: "All Gods", value: "all" },
  ...Object.entries(godFilterLabels).map(([value, label]) => ({ label, value: value as GodId })),
];

const spiritFilters: Array<{ label: string; value: SpiritFilter }> = [
  { label: "All Foxes", value: "all" },
  ...Object.entries(spiritFilterLabels).map(([value, label]) => ({ label, value: value as SpiritId })),
];

const themeFilters: Array<{ label: string; value: ThemeFilter }> = [
  { label: "All Themes", value: "all" },
  ...Array.from(new Set(observations.flatMap((observation) => observation.themeTags))).map((tag) => ({
    label: formatThemeLabel(tag),
    value: tag,
  })),
];

export function ObservationsArchive() {
  const [god, setGod] = useState<GodFilter>("all");
  const [spirit, setSpirit] = useState<SpiritFilter>("all");
  const [theme, setTheme] = useState<ThemeFilter>("all");
  const [sort, setSort] = useState<SortKey>("order");

  const filtered = useMemo(() => {
    return [...observations]
      .filter((observation) => god === "all" || observation.godId === god)
      .filter((observation) => spirit === "all" || observation.spiritWitnessIds.includes(spirit))
      .filter((observation) => theme === "all" || observation.themeTags.includes(theme))
      .sort((a, b) => {
        if (sort === "newest") {
          return b.dateObserved.localeCompare(a.dateObserved);
        }

        return a.number.localeCompare(b.number);
      });
  }, [god, spirit, theme, sort]);

  const activeFilters = [
    god !== "all" ? godFilterLabels[god] : null,
    spirit !== "all" ? spiritFilterLabels[spirit] : null,
    theme !== "all" ? formatThemeLabel(theme) : null,
  ].filter(Boolean);
  const hasActiveFilters = activeFilters.length > 0;
  const resultLabel = filtered.length === 1 ? "vision" : "visions";

  function clearFilters() {
    setGod("all");
    setSpirit("all");
    setTheme("all");
    playGlassSound("select");
  }

  return (
    <section className="observation-archive reveal" aria-label="Observation archive">
      <div className="archive-toolbar">
        <div>
          <p className="eyebrow">The Archive</p>
          <h2>Visions Captured</h2>
        </div>
        <label>
          Sort
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as SortKey);
              playGlassSound("select");
            }}
          >
            <option value="order">Reading order</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>

      <div className="archive-filters" aria-label="Filter observations by god">
        {godFilters.map((filter) => (
          <button
            className={god === filter.value ? "is-active" : ""}
            key={filter.value}
            type="button"
            aria-pressed={god === filter.value}
            onClick={() => {
              setGod(filter.value);
              playGlassSound("select");
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="archive-filters magnitude-filters" aria-label="Filter observations by fox spirit">
        {spiritFilters.map((filter) => (
          <button
            className={spirit === filter.value ? "is-active" : ""}
            key={filter.value}
            type="button"
            aria-pressed={spirit === filter.value}
            onClick={() => {
              setSpirit(filter.value);
              playGlassSound("select");
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="archive-filters magnitude-filters" aria-label="Filter observations by theme">
        {themeFilters.map((filter) => (
          <button
            className={theme === filter.value ? "is-active" : ""}
            key={filter.value}
            type="button"
            aria-pressed={theme === filter.value}
            onClick={() => {
              setTheme(filter.value);
              playGlassSound("select");
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="archive-state" aria-live="polite">
        <div>
          <span>Current gaze</span>
          <strong>{hasActiveFilters ? activeFilters.join(" · ") : "All visions"}</strong>
        </div>
        <p>
          {filtered.length} of {observations.length} {resultLabel} revealed
        </p>
        {hasActiveFilters ? (
          <button className="archive-clear" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="observation-list" aria-live="polite">
        {filtered.length ? (
          filtered.map((observation) => (
            <a className="observation-row" href={getObservationHref(observation)} key={observation.slug}>
              <span className={`magnitude-mark magnitude-${observation.magnitude}`} aria-hidden="true" />
              <span className="observation-row-number">{observation.number}</span>
              <span>
                <strong>{observation.title}</strong>
                <em>
                  {observation.association} / {regionMeta[observation.region].title}
                </em>
              </span>
              <span>{formatObservationReadTime(observation)}</span>
              <span>{observation.themeTags.slice(0, 2).join(" · ")}</span>
              <span aria-hidden="true">View</span>
            </a>
          ))
        ) : (
          <div className="observation-empty" role="status">
            <strong>No vision matches this gaze.</strong>
            <span>Clear one filter and look again.</span>
            {hasActiveFilters ? (
              <button className="archive-clear" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
