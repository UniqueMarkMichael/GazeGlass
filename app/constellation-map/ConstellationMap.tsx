"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { GLASS_MEMORY_KEY, type GlassMemoryEntry } from "../components/GlassMemory";
import { playGlassSound } from "../components/glassSound";

type NodeKind = "you" | "god" | "spirit" | "observation" | "law" | "chronicle";
type FilterKey = "all" | NodeKind | "yours";
type GodKey =
  | "love"
  | "fortune"
  | "beauty"
  | "war"
  | "justice"
  | "story"
  | "death"
  | "wisdom"
  | "mercy"
  | "chaos";
type SpiritKey = "kitsu" | "marok" | "jem" | "sindren" | "saroka";

type NamingResult = {
  godKey: GodKey;
  spiritKey: SpiritKey;
};

type MapNode = {
  id: string;
  kind: NodeKind;
  label: string;
  title: string;
  description: string;
  href: string;
  x: number;
  y: number;
  image?: string;
  primary?: boolean;
};

type MapEdge = {
  from: string;
  to: string;
  label: string;
};

const NAMING_RESULT_KEY = "gaze-glass.naming-result.v1";

const kindLabels: Record<NodeKind, string> = {
  you: "Yours",
  god: "God",
  spirit: "Spirit",
  observation: "Observation",
  law: "Law",
  chronicle: "Chronicle",
};

const filterLabels: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "god", label: "Gods" },
  { key: "spirit", label: "Spirits" },
  { key: "observation", label: "Observations" },
  { key: "law", label: "Laws" },
  { key: "chronicle", label: "Chronicles" },
  { key: "yours", label: "Yours" },
];

const nodes: MapNode[] = [
  {
    id: "you",
    kind: "you",
    label: "You",
    title: "Your Naming",
    description:
      "The visitor's path through the Glass: a personal point where deity, spirit, law, and first story can begin to arrange themselves.",
    href: "/the-glass-names-you",
    x: 50,
    y: 48,
    primary: true,
  },
  {
    id: "god-justice",
    kind: "god",
    label: "Justice",
    title: "The God of Justice",
    description: "The divine force that makes a hidden truth impossible to misfile once the Glass has seen it.",
    href: "/the-gods#the-god-of-justice",
    image: "/gods/justice.webp",
    x: 17,
    y: 22,
    primary: true,
  },
  {
    id: "god-wisdom",
    kind: "god",
    label: "Wisdom",
    title: "The God of Wisdom",
    description: "The cosmic mind that dissolves false separations and turns meaning into a witnessed awakening.",
    href: "/the-gods#the-god-of-wisdom",
    image: "/gods/wisdom.webp",
    x: 33,
    y: 13,
    primary: true,
  },
  {
    id: "god-love",
    kind: "god",
    label: "Love",
    title: "The God of Love",
    description: "The power that returns a soul to itself before it asks the world to love it correctly.",
    href: "/the-gods#the-god-of-love",
    image: "/gods/love.webp",
    x: 50,
    y: 15,
    primary: true,
  },
  {
    id: "god-fortune",
    kind: "god",
    label: "Fortune",
    title: "The God of Fortune",
    description: "The force that opens the door a mortal's unseen labor has already built.",
    href: "/the-gods#the-god-of-fortune",
    image: "/gods/fortune.webp",
    x: 67,
    y: 22,
    primary: true,
  },
  {
    id: "god-war",
    kind: "god",
    label: "War",
    title: "The God of War",
    description: "The force that teaches strategy, terrain, and where a mortal must stand when something sacred is threatened.",
    href: "/the-gods#the-god-of-war",
    image: "/gods/war.webp",
    x: 84,
    y: 20,
    primary: true,
  },
  {
    id: "god-beauty",
    kind: "god",
    label: "Beauty",
    title: "The God of Beauty",
    description: "Beauty as pressure, survival, and the force that receives a room before language can defend itself.",
    href: "/the-gods#the-god-of-beauty",
    image: "/gods/beauty.webp",
    x: 91,
    y: 47,
    primary: true,
  },
  {
    id: "god-story",
    kind: "god",
    label: "Story",
    title: "The God of Story",
    description: "The keeper of what survives: record, myth, and the shape a life takes once it is remembered.",
    href: "/the-gods#the-god-of-story",
    image: "/gods/story.webp",
    x: 28,
    y: 55,
    primary: false,
  },
  {
    id: "god-mercy",
    kind: "god",
    label: "Mercy",
    title: "The God of Mercy",
    description: "The divine possibility that what was wounded can still return changed.",
    href: "/the-gods#the-god-of-mercy",
    image: "/gods/mercy.webp",
    x: 22,
    y: 68,
    primary: false,
  },
  {
    id: "god-death",
    kind: "god",
    label: "Death",
    title: "The God of Death",
    description: "The threshold power that receives endings without pretending they are empty.",
    href: "/the-gods#the-god-of-death",
    image: "/gods/death.webp",
    x: 43,
    y: 73,
    primary: false,
  },
  {
    id: "god-chaos",
    kind: "god",
    label: "Chaos",
    title: "The God of Chaos",
    description: "The unmade edge where creation arrives before permission.",
    href: "/the-gods#the-god-of-chaos",
    image: "/gods/chaos.webp",
    x: 13,
    y: 38,
    primary: false,
  },
  {
    id: "spirit-kitsu",
    kind: "spirit",
    label: "Kitsu",
    title: "Kitsu",
    description: "Assistant to Justice, keeper of proof, and the quiet witness a room should fear.",
    href: "/the-spirits#kitsu",
    image: "/spirits/kitsu.webp",
    x: 27,
    y: 39,
    primary: true,
  },
  {
    id: "spirit-marok",
    kind: "spirit",
    label: "Marok",
    title: "Marok",
    description: "Assistant to War, designer of trials, and the fox who studies the weak point until it shows itself.",
    href: "/the-spirits#marok",
    image: "/spirits/marok.webp",
    x: 73,
    y: 43,
    primary: true,
  },
  {
    id: "spirit-jem",
    kind: "spirit",
    label: "Jem",
    title: "Jem",
    description: "Assistant to Beauty, reading the ache under radiance and the radiance under ache.",
    href: "/the-spirits#jem",
    image: "/spirits/jem.webp",
    x: 64,
    y: 58,
    primary: true,
  },
  {
    id: "spirit-sindren",
    kind: "spirit",
    label: "Sindren",
    title: "Sindren",
    description: "Assistant to Love, calm enough to notice the bond everyone else underestimates.",
    href: "/the-spirits#sindren",
    image: "/spirits/sindren.webp",
    x: 48,
    y: 32,
    primary: true,
  },
  {
    id: "spirit-saroka",
    kind: "spirit",
    label: "Saroka",
    title: "Saroka",
    description: "Assistant to Fortune, keeper of the lucky opening and the smile that knows timing has teeth.",
    href: "/the-spirits#saroka",
    image: "/spirits/saroka.png",
    x: 70,
    y: 69,
    primary: true,
  },
  {
    id: "observation-marcella",
    kind: "observation",
    label: "Marcella",
    title: "Marcella, Blessed by Justice",
    description: "A creative worker asks to be witnessed after her labor is stolen and renamed.",
    href: "/observations/marcella",
    image: "/mortals/marcella/portrait.webp",
    x: 35,
    y: 78,
    primary: true,
  },
  {
    id: "observation-patricia",
    kind: "observation",
    label: "Patricia",
    title: "Patricia, Awakened by Wisdom",
    description: "A former financier abandons wealth to seek meaning and finds there were never others.",
    href: "/observations/patricia",
    image: "/mortals/patricia/wisdom-appears.png",
    x: 17,
    y: 66,
    primary: true,
  },
  {
    id: "observation-malika",
    kind: "observation",
    label: "Malika",
    title: "Malika, Blessed by Love",
    description: "A mortal prayer turns love away from possession and back toward self-return.",
    href: "/observations/malika",
    image: "/mortals/malika/portrait.png",
    x: 53,
    y: 84,
    primary: true,
  },
  {
    id: "observation-takeshi",
    kind: "observation",
    label: "Takeshi",
    title: "Takeshi, Blessed by Fortune",
    description: "A solo game developer asks for one chance, and Fortune opens the door his labor built.",
    href: "/observations/takeshi",
    image: "/mortals/takeshi/portrait.png",
    x: 72,
    y: 82,
    primary: true,
  },
  {
    id: "observation-walter",
    kind: "observation",
    label: "Walter",
    title: "Walter, Blessed by War",
    description: "An old soldier asks for glory, and strategy becomes the blessing that keeps his home standing.",
    href: "/observations/walter",
    image: "/mortals/walter/portrait.png",
    x: 88,
    y: 68,
    primary: true,
  },
  {
    id: "law-witness",
    kind: "law",
    label: "Witness",
    title: "The Law of Witness",
    description: "What is fully seen can no longer remain unchanged.",
    href: "/celestial-codex#witness",
    image: "/codex/sigil-law-witness.webp",
    x: 38,
    y: 60,
    primary: true,
  },
  {
    id: "law-memory",
    kind: "law",
    label: "Memory",
    title: "The Law of Memory",
    description: "A witnessed life survives because the truest thing it carried has been kept.",
    href: "/celestial-codex#memory",
    image: "/codex/sigil-law-memory.webp",
    x: 34,
    y: 40,
    primary: false,
  },
  {
    id: "law-return",
    kind: "law",
    label: "Return",
    title: "The Law of Return",
    description: "What comes back is not what left. It is what survived the crossing.",
    href: "/celestial-codex#return",
    image: "/codex/sigil-law-return.webp",
    x: 51,
    y: 65,
    primary: false,
  },
  {
    id: "law-devotion",
    kind: "law",
    label: "Devotion",
    title: "The Law of Devotion",
    description: "A vow gains force when it continues after reward, certainty, or witness has vanished.",
    href: "/celestial-codex#devotion",
    image: "/codex/sigil-law-devotion.webp",
    x: 57,
    y: 43,
    primary: false,
  },
  {
    id: "law-consequence",
    kind: "law",
    label: "Consequence",
    title: "The Law of Consequence",
    description: "Every blessing enters a life as a force that must keep moving.",
    href: "/celestial-codex#consequence",
    image: "/codex/sigil-law-consequence.webp",
    x: 62,
    y: 62,
    primary: false,
  },
  {
    id: "law-surrender",
    kind: "law",
    label: "Surrender",
    title: "The Law of Surrender",
    description: "The door that will not open by force opens when the soul stops striking it.",
    href: "/celestial-codex#surrender",
    image: "/codex/sigil-law-surrender.webp",
    x: 78,
    y: 56,
    primary: false,
  },
  {
    id: "law-pressure",
    kind: "law",
    label: "Pressure",
    title: "The Law of Pressure",
    description: "Power reveals a life by pressing on the exact place that can no longer remain hidden.",
    href: "/celestial-codex#pressure",
    image: "/codex/sigil-law-pressure.webp",
    x: 61,
    y: 27,
    primary: false,
  },
  {
    id: "chronicle-court-of-foxes",
    kind: "chronicle",
    label: "Court of Foxes",
    title: "A Court of Foxes",
    description: "The chronicle where Beauty, War, and Justice braid into one dangerous night beside Kitsu, Marok, and Jem.",
    href: "/a-court-of-foxes",
    image: "/a-court-of-foxes/assets/cover.png",
    x: 50,
    y: 91,
    primary: true,
  },
];

const edges: MapEdge[] = [
  { from: "you", to: "law-witness", label: "begins with" },
  { from: "you", to: "observation-marcella", label: "first witness" },
  { from: "god-justice", to: "spirit-kitsu", label: "keeps counsel with" },
  { from: "god-justice", to: "observation-marcella", label: "blesses" },
  { from: "spirit-kitsu", to: "observation-marcella", label: "witnesses" },
  { from: "law-witness", to: "observation-marcella", label: "governs" },
  { from: "god-wisdom", to: "observation-patricia", label: "awakens" },
  { from: "god-wisdom", to: "law-memory", label: "opens" },
  { from: "law-memory", to: "observation-patricia", label: "keeps" },
  { from: "god-love", to: "spirit-sindren", label: "keeps counsel with" },
  { from: "god-love", to: "observation-malika", label: "returns" },
  { from: "spirit-sindren", to: "law-devotion", label: "guards" },
  { from: "law-return", to: "observation-malika", label: "restores" },
  { from: "god-fortune", to: "spirit-saroka", label: "keeps counsel with" },
  { from: "god-fortune", to: "observation-takeshi", label: "opens" },
  { from: "spirit-saroka", to: "observation-takeshi", label: "carries" },
  { from: "law-consequence", to: "observation-takeshi", label: "follows" },
  { from: "god-war", to: "spirit-marok", label: "keeps counsel with" },
  { from: "god-war", to: "observation-walter", label: "arms" },
  { from: "spirit-marok", to: "observation-walter", label: "tests" },
  { from: "law-surrender", to: "observation-walter", label: "reveals" },
  { from: "god-beauty", to: "spirit-jem", label: "keeps counsel with" },
  { from: "god-beauty", to: "law-pressure", label: "exerts" },
  { from: "spirit-jem", to: "law-pressure", label: "reads" },
  { from: "god-story", to: "law-memory", label: "records" },
  { from: "god-story", to: "chronicle-court-of-foxes", label: "holds" },
  { from: "chronicle-court-of-foxes", to: "god-beauty", label: "summons" },
  { from: "chronicle-court-of-foxes", to: "god-war", label: "summons" },
  { from: "chronicle-court-of-foxes", to: "god-justice", label: "summons" },
  { from: "chronicle-court-of-foxes", to: "spirit-kitsu", label: "follows" },
  { from: "chronicle-court-of-foxes", to: "spirit-marok", label: "follows" },
  { from: "chronicle-court-of-foxes", to: "spirit-jem", label: "follows" },
  { from: "god-mercy", to: "law-return", label: "returns" },
  { from: "god-death", to: "law-surrender", label: "opens" },
  { from: "god-chaos", to: "law-pressure", label: "presses" },
];

const nodeById = new Map(nodes.map((node) => [node.id, node]));

function isGodKey(value: unknown): value is GodKey {
  return (
    value === "love" ||
    value === "fortune" ||
    value === "beauty" ||
    value === "war" ||
    value === "justice" ||
    value === "story" ||
    value === "death" ||
    value === "wisdom" ||
    value === "mercy" ||
    value === "chaos"
  );
}

function isSpiritKey(value: unknown): value is SpiritKey {
  return value === "kitsu" || value === "marok" || value === "jem" || value === "sindren" || value === "saroka";
}

function readNamingResult() {
  try {
    const raw = window.localStorage.getItem(NAMING_RESULT_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (isGodKey(parsed?.godKey) && isSpiritKey(parsed?.spiritKey)) {
      return parsed as NamingResult;
    }
  } catch {
    return null;
  }

  return null;
}

function readMemoryEntries() {
  try {
    const raw = window.localStorage.getItem(GLASS_MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as GlassMemoryEntry[]) : [];
  } catch {
    return [];
  }
}

function normalizeHref(href: string) {
  return href.split("?")[0];
}

function nodeWasWitnessed(node: MapNode, entries: GlassMemoryEntry[]) {
  const nodeHref = normalizeHref(node.href);

  return entries.some((entry) => {
    const entryHref = normalizeHref(entry.href);
    return entryHref === nodeHref || entryHref.startsWith(`${nodeHref}#`);
  });
}

function getConnections(nodeId: string) {
  return edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
}

function getConnectedIds(nodeId: string) {
  return new Set(getConnections(nodeId).flatMap((edge) => [edge.from, edge.to]));
}

function makePersonalizedEdges(result: NamingResult | null): MapEdge[] {
  if (!result) {
    return [];
  }

  return [
    { from: "you", to: `god-${result.godKey}`, label: "watched by" },
    { from: "you", to: `spirit-${result.spiritKey}`, label: "remembered by" },
  ];
}

function getPrimaryPath(result: NamingResult | null) {
  if (!result) {
    return {
      title: "Begin with Marcella",
      href: "/observations/marcella",
      description: "Justice, Kitsu, and the Law of Witness make the cleanest first constellation.",
    };
  }

  const deity = nodeById.get(`god-${result.godKey}`);
  const spirit = nodeById.get(`spirit-${result.spiritKey}`);

  return {
    title: `${deity?.label ?? "Your deity"} and ${spirit?.label ?? "your fox spirit"}`,
    href: "/the-glass-names-you",
    description: "Your naming result is now part of the map. Follow the lit path outward.",
  };
}

export function ConstellationMap() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState("observation-marcella");
  const [namingResult, setNamingResult] = useState<NamingResult | null>(null);
  const [memoryEntries, setMemoryEntries] = useState<GlassMemoryEntry[]>([]);

  useEffect(() => {
    const result = readNamingResult();
    setNamingResult(result);
    setMemoryEntries(readMemoryEntries());

    if (result) {
      setSelectedId("you");
      setActiveFilter("yours");
    }

    function refreshMemory(event?: Event) {
      const detail = event instanceof CustomEvent ? event.detail : null;
      setMemoryEntries(Array.isArray(detail) ? detail : readMemoryEntries());
    }

    window.addEventListener("gaze-glass:memory-update", refreshMemory);
    return () => window.removeEventListener("gaze-glass:memory-update", refreshMemory);
  }, []);

  const personalizedEdges = useMemo(() => makePersonalizedEdges(namingResult), [namingResult]);
  const allEdges = useMemo(() => [...edges, ...personalizedEdges], [personalizedEdges]);
  const personalizedNodeIds = useMemo(() => {
    if (!namingResult) {
      return new Set(["you", "observation-marcella", "law-witness", "spirit-kitsu", "god-justice"]);
    }

    return new Set(["you", `god-${namingResult.godKey}`, `spirit-${namingResult.spiritKey}`]);
  }, [namingResult]);

  const visibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (activeFilter === "all") {
        return node.primary !== false || personalizedNodeIds.has(node.id);
      }

      if (activeFilter === "yours") {
        return personalizedNodeIds.has(node.id);
      }

      return node.kind === activeFilter;
    });
  }, [activeFilter, personalizedNodeIds]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const selectedNode = nodeById.get(selectedId) ?? nodes[0];
  const connectedIds = useMemo(() => getConnectedIds(selectedNode.id), [selectedNode.id]);
  const visibleEdges = useMemo(
    () => allEdges.filter((edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)),
    [allEdges, visibleNodeIds],
  );
  const selectedConnections = useMemo(() => getConnections(selectedNode.id), [selectedNode.id]);
  const primaryPath = getPrimaryPath(namingResult);

  return (
    <section className="glass-constellation-shell reveal" aria-labelledby="constellation-map-title">
      <div className="glass-constellation-intro">
        <p className="eyebrow">Living Map</p>
        <h2 id="constellation-map-title">The world becomes easier to enter when its hidden lines glow.</h2>
        <p>
          The Glass gathers the reader's path, the mortal archive, the fox spirits, the gods, and the seven laws into
          one navigable sky.
        </p>
      </div>

      <div className="glass-constellation-summary" aria-label="Current constellation signal">
        <article>
          <span>Current Signal</span>
          <strong>{primaryPath.title}</strong>
          <p>{primaryPath.description}</p>
          <a className="text-link" href={primaryPath.href}>
            Open the signal
          </a>
        </article>
        <article>
          <span>Remembered Path</span>
          <strong>{memoryEntries.length ? `${memoryEntries.length} visions witnessed` : "The Glass is listening"}</strong>
          <p>
            Records already opened in this browser glow inside the constellation, creating a private trail through the
            story world.
          </p>
        </article>
      </div>

      <div className="glass-constellation-filters" aria-label="Constellation filters">
        {filterLabels.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={activeFilter === filter.key ? "is-active" : ""}
            aria-pressed={activeFilter === filter.key}
            onClick={() => {
              setActiveFilter(filter.key);
              playGlassSound("select");
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="glass-constellation-layout">
        <div className="glass-constellation-stage" aria-label="Gaze Glass constellation">
          <img
            className="glass-constellation-stage-art"
            src="/brand/ritual-map-background.jpg"
            alt=""
            aria-hidden="true"
          />
          <svg className="glass-constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {visibleEdges.map((edge) => {
              const fromNode = nodeById.get(edge.from);
              const toNode = nodeById.get(edge.to);

              if (!fromNode || !toNode) {
                return null;
              }

              const isActive = edge.from === selectedNode.id || edge.to === selectedNode.id;

              return (
                <line
                  key={`${edge.from}-${edge.to}-${edge.label}`}
                  className={isActive ? "is-active" : ""}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                />
              );
            })}
          </svg>

          <div className="glass-constellation-sky">
            {visibleNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isConnected = connectedIds.has(node.id);
              const isPersonalized = personalizedNodeIds.has(node.id);
              const wasWitnessed = nodeWasWitnessed(node, memoryEntries);
              const nodeStyle = {
                "--node-x": `${node.x}%`,
                "--node-y": `${node.y}%`,
              } as CSSProperties;

              return (
                <button
                  key={node.id}
                  type="button"
                  style={nodeStyle}
                  className={[
                    "glass-constellation-node",
                    `is-${node.kind}`,
                    isSelected ? "is-selected" : "",
                    isConnected ? "is-connected" : "",
                    isPersonalized ? "is-personal" : "",
                    wasWitnessed ? "is-witnessed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedId(node.id);
                    playGlassSound("select");
                  }}
                >
                  <span className="glass-constellation-node-orb" aria-hidden="true">
                    {node.image ? <img src={node.image} alt="" /> : null}
                  </span>
                  <span className="glass-constellation-node-copy">
                    <em>{kindLabels[node.kind]}</em>
                    <strong>{node.label}</strong>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="glass-constellation-panel" aria-label={`${selectedNode.title} details`}>
          <div className="glass-constellation-panel-media">
            {selectedNode.image ? <img src={selectedNode.image} alt="" /> : <img src="/brand/sacred-mirror.webp" alt="" />}
          </div>
          <span>{kindLabels[selectedNode.kind]}</span>
          <h3>{selectedNode.title}</h3>
          <p>{selectedNode.description}</p>
          <a className="text-link" href={selectedNode.href}>
            Open this record
          </a>

          <div className="glass-constellation-connections">
            <small>Connected Records</small>
            {selectedConnections.length ? (
              selectedConnections.slice(0, 5).map((connection) => {
                const otherId = connection.from === selectedNode.id ? connection.to : connection.from;
                const otherNode = nodeById.get(otherId);

                if (!otherNode) {
                  return null;
                }

                return (
                  <button
                    key={`${connection.from}-${connection.to}-${connection.label}`}
                    type="button"
                    onClick={() => {
                      setSelectedId(otherNode.id);
                      setActiveFilter((current) => (visibleNodeIds.has(otherNode.id) ? current : otherNode.kind));
                      playGlassSound("select");
                    }}
                  >
                    <span>{connection.label}</span>
                    <strong>{otherNode.title}</strong>
                  </button>
                );
              })
            ) : (
              <p>No visible lines yet. The Glass may need another witnessed path.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
