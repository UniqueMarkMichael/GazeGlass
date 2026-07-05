"use client";

import { useEffect, useMemo, useState } from "react";
import { GLASS_MEMORY_KEY, type GlassMemoryEntry } from "../components/GlassMemory";
import { playGlassSound } from "../components/glassSound";

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

type ScoreMap<T extends string> = Partial<Record<T, number>>;

type QuizOption = {
  id: string;
  label: string;
  text: string;
  godScores: ScoreMap<GodKey>;
  spiritScores: ScoreMap<SpiritKey>;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  hint: string;
  options: QuizOption[];
};

type ResultKeys = {
  godKey: GodKey;
  spiritKey: SpiritKey;
};

type ProfileLink = {
  href: string;
  label: string;
  text: string;
};

const NAMING_RESULT_KEY = "gaze-glass.naming-result.v1";

const godOrder: GodKey[] = [
  "justice",
  "wisdom",
  "beauty",
  "war",
  "love",
  "fortune",
  "mercy",
  "story",
  "death",
  "chaos",
];

const spiritOrder: SpiritKey[] = ["kitsu", "marok", "jem", "sindren", "saroka"];

const deityProfiles: Record<GodKey, {
  archiveHref: string;
  image: string;
  name: string;
  result: string;
  shortName: string;
  signal: string;
  summary: string;
  path: ProfileLink;
}> = {
  justice: {
    name: "The God of Justice",
    shortName: "Justice",
    image: "/gods/justice.webp",
    archiveHref: "/the-gods#the-god-of-justice",
    signal: "You are drawn to proof, accuracy, and the moment a hidden truth becomes impossible to ignore.",
    result:
      "Justice watches when you refuse to let a life be misfiled. You do not need spectacle. You need the record to hold.",
    summary: "Accuracy is your blessing.",
    path: {
      href: "/observations/marcella",
      label: "Witness Marcella",
      text: "A stolen idea returns to its true author.",
    },
  },
  wisdom: {
    name: "The God of Wisdom",
    shortName: "Wisdom",
    image: "/gods/wisdom.webp",
    archiveHref: "/the-gods#the-god-of-wisdom",
    signal: "You look for the pattern underneath the pattern, even when the answer dissolves the question.",
    result:
      "Wisdom watches because you keep asking what a life means after the old answers stop working.",
    summary: "Seeing is your blessing.",
    path: {
      href: "/observations/patricia",
      label: "Witness Patricia",
      text: "A mortal goes looking for meaning and finds there were never others.",
    },
  },
  beauty: {
    name: "The God of Beauty",
    shortName: "Beauty",
    image: "/gods/beauty.webp",
    archiveHref: "/the-gods#the-god-of-beauty",
    signal: "You know beauty is not decoration. It is pressure, survival, and the room's first language.",
    result:
      "Beauty watches when you understand that radiance can rescue, expose, and command without asking permission.",
    summary: "Radiance is your blessing.",
    path: {
      href: "/the-gods#the-god-of-beauty",
      label: "Meet Beauty",
      text: "Enter the divine record of the god who treats beauty as survival.",
    },
  },
  war: {
    name: "The God of War",
    shortName: "War",
    image: "/gods/war.webp",
    archiveHref: "/the-gods#the-god-of-war",
    signal: "You move toward conflict when it becomes the only honest shape left in the room.",
    result:
      "War watches because you understand trials. You may not want the fight, but you know what it reveals.",
    summary: "Trial is your blessing.",
    path: {
      href: "/observations/walter",
      label: "Witness Walter",
      text: "A mortal is tested by War and learns what remains under pressure.",
    },
  },
  love: {
    name: "The God of Love",
    shortName: "Love",
    image: "/gods/love.webp",
    archiveHref: "/the-gods#the-god-of-love",
    signal: "You reach for the bond before the verdict, because you know a heart can still be called back.",
    result:
      "Love watches when you protect what is tender without pretending tenderness is harmless.",
    summary: "Devotion is your blessing.",
    path: {
      href: "/observations/malika",
      label: "Witness Malika",
      text: "A mortal prayer turns love into a force with consequence.",
    },
  },
  fortune: {
    name: "The God of Fortune",
    shortName: "Fortune",
    image: "/gods/fortune.webp",
    archiveHref: "/the-gods#the-god-of-fortune",
    signal: "You notice doors before they look like doors, and you can feel timing become a blade.",
    result:
      "Fortune watches when you stop calling timing luck and start recognizing selection.",
    summary: "Timing is your blessing.",
    path: {
      href: "/observations/takeshi",
      label: "Witness Takeshi",
      text: "A mortal meets Fortune and learns that luck has a memory.",
    },
  },
  mercy: {
    name: "The God of Mercy",
    shortName: "Mercy",
    image: "/gods/mercy.webp",
    archiveHref: "/the-gods#the-god-of-mercy",
    signal: "You keep looking for what can still become whole after the verdict has been spoken.",
    result:
      "Mercy watches because you are not finished with anyone who still carries a shard of light.",
    summary: "Return is your blessing.",
    path: {
      href: "/celestial-codex#return",
      label: "Read the Law of Return",
      text: "Follow the sacred law behind rebirth, repair, and the light that comes back.",
    },
  },
  story: {
    name: "The God of Story",
    shortName: "Story",
    image: "/gods/story.webp",
    archiveHref: "/the-gods#the-god-of-story",
    signal: "You know the record decides what survives. A life untold can be wounded twice.",
    result:
      "Story watches when you gather fragments and insist they become memory instead of noise.",
    summary: "Memory is your blessing.",
    path: {
      href: "/celestial-codex#memory",
      label: "Read the Law of Memory",
      text: "Enter the law that keeps a witnessed life from vanishing.",
    },
  },
  death: {
    name: "The God of Death",
    shortName: "Death",
    image: "/gods/death.webp",
    archiveHref: "/the-gods#the-god-of-death",
    signal: "You are not afraid of endings when endings tell the truth about what a life carried.",
    result:
      "Death watches because you can stand at a threshold without looking away from what must pass through it.",
    summary: "Passage is your blessing.",
    path: {
      href: "/the-gods#the-god-of-death",
      label: "Meet Death",
      text: "Enter the divine record of the god who receives what every soul tried to bury.",
    },
  },
  chaos: {
    name: "The God of Chaos",
    shortName: "Chaos",
    image: "/gods/chaos.webp",
    archiveHref: "/the-gods#the-god-of-chaos",
    signal: "You feel the edge before others name it, and sometimes the unmade thing feels most honest.",
    result:
      "Chaos watches because you understand that creation sometimes arrives before permission.",
    summary: "The unknown is your blessing.",
    path: {
      href: "/the-gods#the-god-of-chaos",
      label: "Meet Chaos",
      text: "Enter the divine record of the primordial force waiting at the edge.",
    },
  },
};

const spiritProfiles: Record<SpiritKey, {
  archiveHref: string;
  image: string;
  name: string;
  role: string;
  signal: string;
  result: string;
}> = {
  kitsu: {
    name: "Kitsu",
    role: "Assistant to the God of Justice",
    image: "/spirits/kitsu.webp",
    archiveHref: "/the-spirits#kitsu",
    signal: "Kitsu notices what the room hopes no one can prove.",
    result:
      "Kitsu would sit beside your record because you need a witness who values truth more than volume.",
  },
  marok: {
    name: "Marok",
    role: "Assistant to the God of War",
    image: "/spirits/marok.webp",
    archiveHref: "/the-spirits#marok",
    signal: "Marok notices the trial before the trial admits its name.",
    result:
      "Marok would sit beside your record because you move through pressure with your teeth showing.",
  },
  jem: {
    name: "Jem",
    role: "Assistant to the God of Beauty",
    image: "/spirits/jem.webp",
    archiveHref: "/the-spirits#jem",
    signal: "Jem notices the ache under radiance and the radiance under ache.",
    result:
      "Jem would sit beside your record because you understand that beauty can be both wound and medicine.",
  },
  sindren: {
    name: "Sindren",
    role: "Assistant to the God of Love",
    image: "/spirits/sindren.webp",
    archiveHref: "/the-spirits#sindren",
    signal: "Sindren notices the bond everyone else underestimates.",
    result:
      "Sindren would sit beside your record because your gentleness is sharper than it looks.",
  },
  saroka: {
    name: "Saroka",
    role: "Assistant to the God of Fortune",
    image: "/spirits/saroka.png",
    archiveHref: "/the-spirits#saroka",
    signal: "Saroka notices the exit, the opening, and the lucky mistake.",
    result:
      "Saroka would sit beside your record because timing keeps bending around you on purpose.",
  },
};

const questions: QuizQuestion[] = [
  {
    id: "wronged",
    prompt: "When a room goes quiet around a wrong, what do you ask the Glass to show first?",
    hint: "Choose the answer that feels most instinctive, not most admirable.",
    options: [
      {
        id: "proof",
        label: "Proof",
        text: "The exact evidence that makes denial impossible.",
        godScores: { justice: 3, story: 1 },
        spiritScores: { kitsu: 3 },
      },
      {
        id: "leverage",
        label: "Leverage",
        text: "The pressure point that changes the balance of power.",
        godScores: { war: 3, fortune: 1 },
        spiritScores: { marok: 3 },
      },
      {
        id: "heart",
        label: "The heart",
        text: "The wound beneath the behavior, even if it complicates the verdict.",
        godScores: { love: 2, mercy: 2 },
        spiritScores: { sindren: 3 },
      },
      {
        id: "pattern",
        label: "The pattern",
        text: "The larger story that explains why this keeps happening.",
        godScores: { wisdom: 2, story: 2 },
        spiritScores: { kitsu: 1, jem: 1 },
      },
    ],
  },
  {
    id: "gift",
    prompt: "A deity offers you one gift for the next threshold. What do you take?",
    hint: "The gift says more about your hunger than your fear.",
    options: [
      {
        id: "voice",
        label: "A voice",
        text: "So the record can finally say your name correctly.",
        godScores: { story: 3, justice: 1 },
        spiritScores: { jem: 2, kitsu: 1 },
      },
      {
        id: "weapon",
        label: "A weapon",
        text: "So the trial knows you did not arrive unarmed.",
        godScores: { war: 3, chaos: 1 },
        spiritScores: { marok: 3 },
      },
      {
        id: "map",
        label: "A map",
        text: "So the hidden route becomes visible before anyone else moves.",
        godScores: { wisdom: 2, fortune: 2 },
        spiritScores: { saroka: 2, sindren: 1 },
      },
      {
        id: "second-chance",
        label: "A second chance",
        text: "So what was almost lost can return changed.",
        godScores: { mercy: 3, love: 1 },
        spiritScores: { sindren: 2, saroka: 1 },
      },
    ],
  },
  {
    id: "beauty",
    prompt: "What kind of beauty unsettles you most?",
    hint: "The Glass is listening for where you flinch.",
    options: [
      {
        id: "survival",
        label: "Beauty that survives",
        text: "The kind that remains radiant after it should have been ruined.",
        godScores: { beauty: 3, mercy: 1 },
        spiritScores: { jem: 3 },
      },
      {
        id: "order",
        label: "Beauty that orders",
        text: "The kind that makes every false thing look sloppy.",
        godScores: { justice: 2, beauty: 1 },
        spiritScores: { kitsu: 2, jem: 1 },
      },
      {
        id: "danger",
        label: "Beauty that threatens",
        text: "The kind that smiles before the room understands the cost.",
        godScores: { war: 1, chaos: 2, beauty: 1 },
        spiritScores: { marok: 2, jem: 1 },
      },
      {
        id: "vow",
        label: "Beauty that binds",
        text: "The kind that makes devotion feel like fate.",
        godScores: { love: 3, death: 1 },
        spiritScores: { sindren: 2, jem: 1 },
      },
    ],
  },
  {
    id: "fox",
    prompt: "Your fox spirit notices one thing before you do. What do you hope they catch?",
    hint: "This answer decides the shape of your witness.",
    options: [
      {
        id: "receipt",
        label: "The missing receipt",
        text: "A detail small enough to hide and sharp enough to change everything.",
        godScores: { justice: 2 },
        spiritScores: { kitsu: 4 },
      },
      {
        id: "challenge",
        label: "The real challenge",
        text: "The fight beneath the fight, where the outcome is actually decided.",
        godScores: { war: 2 },
        spiritScores: { marok: 4 },
      },
      {
        id: "glow",
        label: "The hidden glow",
        text: "The part of you that still shines even when you distrust it.",
        godScores: { beauty: 2 },
        spiritScores: { jem: 4 },
      },
      {
        id: "exit",
        label: "The lucky exit",
        text: "The opening no one planned for, waiting at the edge of the room.",
        godScores: { fortune: 2 },
        spiritScores: { saroka: 4 },
      },
      {
        id: "tremor",
        label: "The tremor",
        text: "The emotional truth moving under a calm face.",
        godScores: { love: 1, mercy: 1 },
        spiritScores: { sindren: 4 },
      },
    ],
  },
  {
    id: "protect",
    prompt: "What do you protect even when it costs you?",
    hint: "The answer may already know your deity.",
    options: [
      {
        id: "name",
        label: "A name",
        text: "Credit, authorship, and the right record.",
        godScores: { justice: 2, story: 2 },
        spiritScores: { kitsu: 2 },
      },
      {
        id: "beloved",
        label: "A beloved",
        text: "The person or bond everyone else calls too fragile.",
        godScores: { love: 3, mercy: 1 },
        spiritScores: { sindren: 3 },
      },
      {
        id: "future",
        label: "A future",
        text: "The chance that has not arrived yet, but keeps calling your name.",
        godScores: { fortune: 3, wisdom: 1 },
        spiritScores: { saroka: 3 },
      },
      {
        id: "edge",
        label: "An edge",
        text: "The wild place where new things can begin without permission.",
        godScores: { chaos: 3, death: 1 },
        spiritScores: { marok: 1, saroka: 1 },
      },
    ],
  },
  {
    id: "lost",
    prompt: "When you are lost, where do you go first?",
    hint: "The Glass cares about your first motion.",
    options: [
      {
        id: "archive",
        label: "The archive",
        text: "There is always a record, if you can learn how to read it.",
        godScores: { wisdom: 3, story: 2 },
        spiritScores: { kitsu: 1, sindren: 1 },
      },
      {
        id: "mirror",
        label: "The mirror",
        text: "The answer starts with the image you have avoided.",
        godScores: { beauty: 2, justice: 1 },
        spiritScores: { jem: 3 },
      },
      {
        id: "threshold",
        label: "The threshold",
        text: "The place between one life and the next.",
        godScores: { death: 3, mercy: 1 },
        spiritScores: { saroka: 1, sindren: 1 },
      },
      {
        id: "storm",
        label: "The storm",
        text: "Motion tells the truth faster than stillness does.",
        godScores: { war: 2, chaos: 2 },
        spiritScores: { marok: 3 },
      },
    ],
  },
  {
    id: "record",
    prompt: "What should the Glass record about you?",
    hint: "Final answer. Let it be honest.",
    options: [
      {
        id: "witnessed",
        label: "I asked to be witnessed.",
        text: "Not rescued, not excused, simply seen with accuracy.",
        godScores: { justice: 3, wisdom: 1 },
        spiritScores: { kitsu: 3 },
      },
      {
        id: "returned",
        label: "I returned changed.",
        text: "Something in me survived the crossing.",
        godScores: { mercy: 3, death: 1 },
        spiritScores: { sindren: 2, saroka: 1 },
      },
      {
        id: "chosen",
        label: "I chose the dangerous door.",
        text: "The old room was smaller than the risk.",
        godScores: { fortune: 2, chaos: 2 },
        spiritScores: { saroka: 3 },
      },
      {
        id: "shone",
        label: "I shone anyway.",
        text: "Even after the room tried to make me useful instead of radiant.",
        godScores: { beauty: 3, love: 1 },
        spiritScores: { jem: 3 },
      },
      {
        id: "fought",
        label: "I fought clean.",
        text: "The trial found me afraid, but not absent.",
        godScores: { war: 3, story: 1 },
        spiritScores: { marok: 3 },
      },
    ],
  },
];

function makeEmptyScores<T extends string>(keys: T[]) {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;
}

function isGodKey(value: string | null): value is GodKey {
  return Boolean(value && godOrder.includes(value as GodKey));
}

function isSpiritKey(value: string | null): value is SpiritKey {
  return Boolean(value && spiritOrder.includes(value as SpiritKey));
}

function highestScore<T extends string>(scores: Record<T, number>, order: T[]) {
  return order.reduce((winner, key) => (scores[key] > scores[winner] ? key : winner), order[0]);
}

function calculateResult(answers: Record<string, string>): ResultKeys {
  const godScores = makeEmptyScores(godOrder);
  const spiritScores = makeEmptyScores(spiritOrder);

  questions.forEach((question) => {
    const answerId = answers[question.id];
    const option = question.options.find((item) => item.id === answerId);

    if (!option) {
      return;
    }

    Object.entries(option.godScores).forEach(([key, value]) => {
      if (isGodKey(key)) {
        godScores[key] += value ?? 0;
      }
    });

    Object.entries(option.spiritScores).forEach(([key, value]) => {
      if (isSpiritKey(key)) {
        spiritScores[key] += value ?? 0;
      }
    });
  });

  return {
    godKey: highestScore(godScores, godOrder),
    spiritKey: highestScore(spiritScores, spiritOrder),
  };
}

function readStoredResult() {
  try {
    const raw = window.localStorage.getItem(NAMING_RESULT_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (isGodKey(parsed?.godKey ?? null) && isSpiritKey(parsed?.spiritKey ?? null)) {
      return parsed as ResultKeys;
    }
  } catch {
    return null;
  }

  return null;
}

function writeStoredResult(result: ResultKeys) {
  window.localStorage.setItem(NAMING_RESULT_KEY, JSON.stringify(result));
}

function updateResultUrl(result: ResultKeys | null) {
  const url = new URL(window.location.href);

  if (result) {
    url.searchParams.set("god", result.godKey);
    url.searchParams.set("spirit", result.spiritKey);
  } else {
    url.search = "";
  }

  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function readResultFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const godKey = params.get("god");
  const spiritKey = params.get("spirit");

  if (isGodKey(godKey) && isSpiritKey(spiritKey)) {
    return { godKey, spiritKey };
  }

  return null;
}

function rememberNamedResult(result: ResultKeys) {
  const deity = deityProfiles[result.godKey];
  const spirit = spiritProfiles[result.spiritKey];
  const now = Date.now();
  const href = `/the-glass-names-you?god=${result.godKey}&spirit=${result.spiritKey}`;

  try {
    const stored = window.localStorage.getItem(GLASS_MEMORY_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const entries = Array.isArray(parsed) ? (parsed as GlassMemoryEntry[]) : [];
    const id = `glass-naming-${result.godKey}-${result.spiritKey}`;
    const existing = entries.find((entry) => entry.id === id);
    const nextEntry: GlassMemoryEntry = {
      id,
      label: `${deity.shortName} / ${spirit.name}`,
      href,
      realm: "threshold",
      firstSeenAt: existing?.firstSeenAt ?? now,
      lastSeenAt: now,
    };
    const nextEntries = [nextEntry, ...entries.filter((entry) => entry.id !== id)]
      .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
      .slice(0, 18);

    window.localStorage.setItem(GLASS_MEMORY_KEY, JSON.stringify(nextEntries));
    window.dispatchEvent(new CustomEvent("gaze-glass:memory-update", { detail: nextEntries }));
  } catch {
    return;
  }
}

function buildResultLinks(result: ResultKeys) {
  const deity = deityProfiles[result.godKey];
  const spirit = spiritProfiles[result.spiritKey];

  return [
    {
      href: deity.archiveHref,
      label: `Meet ${deity.shortName}`,
      text: deity.signal,
    },
    {
      href: spirit.archiveHref,
      label: `Meet ${spirit.name}`,
      text: spirit.signal,
    },
    deity.path,
    {
      href: "/a-court-of-foxes",
      label: "Enter A Court of Foxes",
      text: "Continue into the chronicle where the fox spirits move from archive to story.",
    },
  ];
}

export function GlassNamingQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [result, setResult] = useState<ResultKeys | null>(null);
  const [copied, setCopied] = useState(false);
  const currentQuestion = questions[step];
  const selectedOptionId = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;
  const progress = result ? 100 : Math.round((answeredCount / questions.length) * 100);
  const resultLinks = useMemo(() => (result ? buildResultLinks(result) : []), [result]);

  useEffect(() => {
    const urlResult = readResultFromUrl();
    const storedResult = urlResult ?? readStoredResult();

    if (storedResult) {
      setResult(storedResult);
      setHasStarted(true);
      updateResultUrl(storedResult);
      rememberNamedResult(storedResult);
    }
  }, []);

  function selectOption(option: QuizOption) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }));
    playGlassSound("select");
  }

  function continueRite() {
    if (!selectedOptionId) {
      playGlassSound("error");
      return;
    }

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      playGlassSound("travel");
      return;
    }

    const nextResult = calculateResult(answers);
    setResult(nextResult);
    setHasStarted(true);
    writeStoredResult(nextResult);
    updateResultUrl(nextResult);
    rememberNamedResult(nextResult);
    playGlassSound("success");
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
    playGlassSound("close");
  }

  function beginRite() {
    setHasStarted(true);
    playGlassSound("open");
  }

  function retakeRite() {
    setAnswers({});
    setStep(0);
    setResult(null);
    setHasStarted(true);
    setCopied(false);
    window.localStorage.removeItem(NAMING_RESULT_KEY);
    updateResultUrl(null);
    playGlassSound("open");
  }

  async function copyResultLink() {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    playGlassSound("copy");
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (result) {
    const deity = deityProfiles[result.godKey];
    const spirit = spiritProfiles[result.spiritKey];

    return (
      <section className="naming-quiz naming-result-shell reveal" id="glass-naming-quiz" aria-label="Your Sorting Glass result">
        <div className="naming-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="naming-result-intro">
          <p className="eyebrow">The Sorting Glass Has Chosen</p>
          <h2>{deity.shortName} watches. {spirit.name} remembers.</h2>
          <p>{deity.summary} {spirit.result}</p>
        </div>

        <div className="naming-result-grid">
          <article className="naming-result-card">
            <figure>
              <img src={deity.image} alt={`${deity.name} portrait`} />
            </figure>
            <div>
              <p>Matched Deity</p>
              <h3>{deity.name}</h3>
              <span>{deity.result}</span>
            </div>
          </article>

          <article className="naming-result-card">
            <figure>
              <img src={spirit.image} alt={`${spirit.name}, ${spirit.role}`} />
            </figure>
            <div>
              <p>Fox Spirit Witness</p>
              <h3>{spirit.name}</h3>
              <span>{spirit.result}</span>
            </div>
          </article>
        </div>

        <div className="naming-result-paths" aria-label="Recommended paths">
          <p className="eyebrow">Where the Sorting Glass Sends You</p>
          {resultLinks.map((link, index) => (
            <a href={link.href} key={`${link.href}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{link.label}</strong>
              <em>{link.text}</em>
            </a>
          ))}
        </div>

        <div className="naming-actions">
          <button className="naming-primary-action" type="button" onClick={copyResultLink}>
            {copied ? "Result link copied" : "Copy result link"}
          </button>
          <button className="naming-secondary-action" type="button" onClick={retakeRite}>
            Retake the sorting
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="naming-quiz reveal" id="glass-naming-quiz" aria-label="Sorting Glass quiz">
      <div className="naming-progress" aria-label={`${progress}% complete`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      {!hasStarted ? (
        <div className="naming-intro-card">
          <p className="eyebrow">Seven Questions</p>
          <h2>The Sorting Glass reads by pressure, not personality.</h2>
          <p>
            There are no wrong answers. Each choice tilts the reading toward a deity,
            a fox spirit, and a path through the Gaze Glass archive.
          </p>
          <button className="naming-primary-action" type="button" onClick={beginRite}>
            Begin the sorting
          </button>
        </div>
      ) : (
        <div className="naming-question-card">
          <div className="naming-question-meta">
            <span>{String(step + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
            <p>{currentQuestion.hint}</p>
          </div>
          <h2>{currentQuestion.prompt}</h2>
          <div className="naming-options">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;

              return (
                <button
                  className={`naming-option ${isSelected ? "is-selected" : ""}`}
                  type="button"
                  aria-pressed={isSelected}
                  key={option.id}
                  onClick={() => selectOption(option)}
                >
                  <span>{option.label}</span>
                  <em>{option.text}</em>
                </button>
              );
            })}
          </div>
          <div className="naming-actions">
            <button className="naming-secondary-action" type="button" onClick={goBack} disabled={step === 0}>
              Previous
            </button>
            <button className="naming-primary-action" type="button" onClick={continueRite} disabled={!selectedOptionId}>
              {step === questions.length - 1 ? "Reveal my witness" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
