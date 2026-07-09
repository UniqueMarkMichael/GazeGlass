"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CopyLinkButton } from "../components/CopyLinkButton";
import { GLASS_MEMORY_KEY, type GlassMemoryEntry } from "../components/GlassMemory";
import { ObservationModeBoot } from "../components/ObservationModeBoot";
import { playGlassSound } from "../components/glassSound";
import { bigScaleChapters } from "./chapters";

const assetBase = "/big-scale-betrayal/assets";
const BSB_BOOKMARK_KEY = "gaze-glass.bsb-bookmark.v1";
const BSB_READER_STATE_KEY = "gaze-glass.bsb-reader-state.v3";

type ReaderTheme = "night" | "papyrus";
type FocusMode = "none" | "ruler" | "lantern";
type FontStyle = "literary" | "readable" | "dyslexia";
type VoiceFollowStatus = "idle" | "listening" | "unsupported" | "blocked";
type ObservationModeElementApi = HTMLElement & {
  open?: () => Promise<void>;
};
type ToolFeedback = {
  body: string;
  title: string;
};
type SpeechRecognitionAlternativeLike = {
  transcript: string;
};
type SpeechRecognitionResultLike = {
  [index: number]: SpeechRecognitionAlternativeLike | undefined;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};
type SpeechRecognitionErrorLike = {
  error?: string;
};
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type VoiceParagraph = {
  chapterNumber: number;
  key: string;
  normalized: string;
};

type ChapterMedia = {
  after: number;
  alt?: string;
  caption: string;
  chapterNumber: number;
  fit: "cover" | "contain";
  src: string;
  type: "image" | "video";
};

const chapterMedia: ChapterMedia[] = [
  {
    chapterNumber: 1,
    after: 2,
    type: "video",
    src: `${assetBase}/chapter1.mp4`,
    fit: "contain",
    caption: "The armored guardian of the royal library of Kemet, bells at its throat, incense at its brow.",
  },
  {
    chapterNumber: 1,
    after: 3,
    type: "image",
    src: `${assetBase}/heba-intro.png`,
    fit: "contain",
    alt: "Heba carrying cabbages down the temple steps of Kemet",
    caption: "Heba, daughter of a vegetable merchant, before the gods finished naming her fate.",
  },
  {
    chapterNumber: 1,
    after: 20,
    type: "image",
    src: `${assetBase}/market.png`,
    fit: "contain",
    alt: "Heba and a young thief near a cabbage stall in the market of Kemet",
    caption: "The market of Kemet, the hour before the chase.",
  },
  {
    chapterNumber: 1,
    after: 33,
    type: "video",
    src: `${assetBase}/feather.mp4`,
    fit: "contain",
    caption: "A feather for the oracle, a hand for the boy.",
  },
  {
    chapterNumber: 1,
    after: 44,
    type: "video",
    src: `${assetBase}/chapter1-end.mp4`,
    fit: "contain",
    caption: "Destined to sell cabbage, or so she believed.",
  },
  {
    chapterNumber: 2,
    after: 12,
    type: "image",
    src: `${assetBase}/chapter2-scale-presented.png`,
    fit: "cover",
    alt: "Amunet presents Heba's handmade scale at the cabbage stall in the market of Kemet",
    caption: "Amunet presents the scale, and Heba begins to understand what her hands have made.",
  },
  {
    chapterNumber: 2,
    after: 15,
    type: "image",
    src: `${assetBase}/chapter2-materials-vision.png`,
    fit: "cover",
    alt: "Heba sees raw market materials become rings, braids, and future offerings",
    caption: "Raw materials answer Heba's sight, becoming rings, braids, and market futures in the air.",
  },
  {
    chapterNumber: 2,
    after: 38,
    type: "image",
    src: `${assetBase}/chapter2-scale-awakens.png`,
    fit: "cover",
    alt: "Heba's scale wakes with a glowing feather and burning heart after the stolen kiss",
    caption: "The scale wakes in public, feather and heart burning before anyone can pretend not to see.",
  },
  {
    chapterNumber: 2,
    after: 40,
    type: "image",
    src: `${assetBase}/chapter2-crocodiles-answer.png`,
    fit: "cover",
    alt: "Two armored crocodile guardians answer Heba's scale in the crowded market",
    caption: "Matu and Nefer answer the scale, and the market learns the crocodiles are listening.",
  },
  {
    chapterNumber: 3,
    after: 2,
    type: "image",
    src: `${assetBase}/chapter3-image-1.png`,
    fit: "cover",
    alt: "Heba and Amunet watch Sate arrive in a sandstorm between two armored crocodiles in the Kemet market",
    caption: "Sate rises from the sand, and Matu and Nefer turn the market toward judgment.",
  },
  {
    chapterNumber: 3,
    after: 9,
    type: "image",
    src: `${assetBase}/chapter3-image-4.png`,
    fit: "cover",
    alt: "Heba studies her glowing scale with a white feather and living red heart in the quiet of the cabbage stall",
    caption: "Heba watches the heart beat and the feather burn, understanding that the scale is still speaking.",
  },
  {
    chapterNumber: 3,
    after: 41,
    type: "image",
    src: `${assetBase}/chapter3-image-2.png`,
    fit: "cover",
    alt: "Prince Ahmose rises from a wave of dark red wine while Sate lies defeated in the market",
    caption: "Ahmose steps out of the wine, and the marketplace learns another kind of power has arrived.",
  },
  {
    chapterNumber: 3,
    after: 78,
    type: "image",
    src: `${assetBase}/chapter3-image-3.png`,
    fit: "cover",
    alt: "A translucent ice hawk spreads its wings before Heba, Amunet, and the crocodile guardians in the Kemet market",
    caption: "Water becomes a hawk of ice, and Heba sees Heka answer in public.",
  },
];

const chapterQuestions = [
  "What does Heba believe she owes before fate interrupts?",
  "When does a gift become evidence?",
  "Who benefits when judgment arrives before understanding?",
  "What does the palace offer before it asks for the truth?",
  "How does power rename protection?",
  "Which promise sounds generous until it closes?",
  "Where does Heba's fear sharpen into sight?",
  "What does the royal family need her to miss?",
  "Which heart refuses to sit on the scale?",
  "What is the difference between truth and usefulness?",
  "Who is safest when Heba doubts herself?",
  "What does Order demand when love is in the room?",
  "Which lie has been dressed as destiny?",
  "What would Heba choose if no one were watching?",
  "When does betrayal become a map?",
  "What does the Glass remember that the palace cannot bury?",
];

const fieldNotes = [
  "The first wound is not the chase. It is the expectation that Heba should want less.",
  "A scale is only simple before someone places a heart on it.",
  "The crocodiles obey power, but Heba watches what power tries to explain away.",
  "Splendor is the palace's first disguise. Hospitality is the second.",
  "A royal invitation can sound like rescue while behaving like a lock.",
  "The gift keeps proving useful to everyone except the girl carrying it.",
  "Every corridor in Kemet has a witness. Not every witness is human.",
  "The palace prefers truth when it can be aimed at someone else.",
  "A heart outside the scale is not innocent. It is protected.",
  "The cleanest verdict can still be used by dirty hands.",
  "Heba's mercy is becoming harder for the court to manage.",
  "Order does not always arrive as peace. Sometimes it arrives as pressure.",
  "The palace is most dangerous when it sounds reasonable.",
  "A choice made under watch is still a choice, but it leaves bruises.",
  "Betrayal starts looking like architecture once enough doors close.",
  "The final record belongs to the girl who kept seeing.",
];

const fontStyleOrder: FontStyle[] = ["literary", "readable", "dyslexia"];

const fontStyleLabels: Record<FontStyle, string> = {
  literary: "Literary",
  readable: "Readable Sans",
  dyslexia: "Dyslexia Support",
};

const fontStyleDescriptions: Record<FontStyle, string> = {
  literary: "Keeps the original storybook serif voice.",
  readable: "Uses a cleaner sans serif with generous line spacing for focus.",
  dyslexia: "Uses a wider, steadier font stack with more breathing room between words.",
};

const readerToolCopy = {
  allTools: {
    title: "All story controls",
    body: "Opens the full story controls with focus, sound, text, echo, memory, and reading support.",
  },
  copy: {
    title: "Copy link",
    body: "Copies this page address so you can return to the same story from another window or device.",
  },
  copyDone: {
    title: "Link copied",
    body: "The page link is ready to paste wherever you need it.",
  },
  fieldNotes: {
    title: "Field Notes",
    body: "Shows or hides the short chapter note that helps you hold the emotional thread.",
  },
  fontDown: {
    title: "Text size",
    body: "Makes the story text smaller while keeping the chapter layout intact.",
  },
  fontStyle: {
    title: "Font style",
    body: "Cycles between the literary serif, a readable sans serif, and a dyslexia-supportive font stack.",
  },
  fontUp: {
    title: "Text size",
    body: "Makes the story text larger for easier reading.",
  },
  images: {
    title: "Story images",
    body: "Shows or hides the images and motion moments so the page can feel calmer when needed.",
  },
  lantern: {
    title: "Lantern",
    body: "Softens surrounding paragraphs so the line under your attention feels easier to stay with.",
  },
  ruler: {
    title: "Reading ruler",
    body: "Adds a fine golden guide beneath each paragraph to help your eyes keep their place.",
  },
  theme: {
    title: "Day and night",
    body: "Switches between the dark glass reader and a warmer papyrus reading surface.",
  },
  voice: {
    title: "Follow Voice",
    body: "Listens through your browser and lights up the paragraph it recognizes while you read aloud.",
  },
  voiceBlocked: {
    title: "Microphone blocked",
    body: "Your browser needs microphone permission before Follow Voice can listen and highlight text.",
  },
  voiceListening: {
    title: "Follow Voice is listening",
    body: "Read naturally. When the browser recognizes the words, the matching paragraph will glow.",
  },
  voiceStopped: {
    title: "Follow Voice stopped",
    body: "The microphone is off. Your highlighted place will remain until another paragraph is found.",
  },
  voiceUnsupported: {
    title: "Follow Voice unavailable",
    body: "This browser does not support live speech recognition here. The other reading tools still work.",
  },
} satisfies Record<string, ToolFeedback>;

function getReadingMinutes() {
  const words = bigScaleChapters
    .flatMap((chapter) => chapter.paragraphs)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 220));
}

function getNextFontStyle(value: FontStyle) {
  const currentIndex = fontStyleOrder.indexOf(value);
  return fontStyleOrder[(currentIndex + 1) % fontStyleOrder.length] ?? "literary";
}

function normalizeSpeech(value: string) {
  return value
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null;
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function ChapterMediaBlock({
  after,
  chapterNumber,
  showImages,
}: {
  after: number;
  chapterNumber: number;
  showImages: boolean;
}) {
  if (!showImages) return null;

  const item = chapterMedia.find((entry) => entry.chapterNumber === chapterNumber && entry.after === after);
  if (!item) return null;

  return (
    <figure className="bsb-story-figure">
      <div className={`bsb-media-frame${item.fit === "contain" ? " is-contained" : ""}`}>
        {item.type === "video" ? (
          <video src={item.src} autoPlay muted loop playsInline preload="metadata" />
        ) : (
          <img src={item.src} alt={item.alt ?? ""} loading="lazy" />
        )}
        <span>Witnessed</span>
      </div>
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}

function writeMemoryEntry(chapterNumber: number) {
  const now = Date.now();
  const href = `/big-scale-betrayal#chapter-${chapterNumber}`;
  const nextEntry: GlassMemoryEntry = {
    id: `big-scale-betrayal-${chapterNumber}`,
    label: `Big Scale Betrayal: Chapter ${chapterNumber}`,
    href,
    realm: "mortal",
    firstSeenAt: now,
    lastSeenAt: now,
  };

  try {
    const stored = window.localStorage.getItem(GLASS_MEMORY_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const entries = Array.isArray(parsed) ? (parsed as GlassMemoryEntry[]) : [];
    const existing = entries.find((entry) => entry.id === nextEntry.id);
    const rememberedEntry = {
      ...nextEntry,
      firstSeenAt: existing?.firstSeenAt ?? now,
    };
    const nextEntries = [rememberedEntry, ...entries.filter((entry) => entry.id !== nextEntry.id)]
      .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
      .slice(0, 18);

    window.localStorage.setItem(GLASS_MEMORY_KEY, JSON.stringify(nextEntries));
    window.dispatchEvent(new CustomEvent("gaze-glass:memory-update", { detail: nextEntries }));
  } catch {}
}

export function BigScaleBetrayalReader() {
  const readingMinutes = useMemo(() => getReadingMinutes(), []);
  const voiceParagraphs = useMemo<VoiceParagraph[]>(
    () =>
      bigScaleChapters.flatMap((chapter) =>
        chapter.paragraphs.map((paragraph, paragraphIndex) => ({
          chapterNumber: chapter.number,
          key: `${chapter.number}-${paragraphIndex}`,
          normalized: normalizeSpeech(paragraph),
        })),
      ),
    [],
  );
  const [activeChapter, setActiveChapter] = useState(1);
  const [theme, setTheme] = useState<ReaderTheme>("night");
  const [focusMode, setFocusMode] = useState<FocusMode>("ruler");
  const [fontStyle, setFontStyle] = useState<FontStyle>("literary");
  const [showImages, setShowImages] = useState(true);
  const [showWhispers, setShowWhispers] = useState(true);
  const [fontStep, setFontStep] = useState(1);
  const [toolFeedback, setToolFeedback] = useState<ToolFeedback>({
    title: "Reader tools",
    body: "Tap or press any tool to see what it does before the story changes.",
  });
  const [voiceFollowOn, setVoiceFollowOn] = useState(false);
  const [, setVoiceFollowStatus] = useState<VoiceFollowStatus>("idle");
  const [litParagraphKey, setLitParagraphKey] = useState<string | null>(null);
  const chapterRailRef = useRef<HTMLElement | null>(null);
  const observationModeRef = useRef<ObservationModeElementApi | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceFollowWantedRef = useRef(false);

  useEffect(() => {
    try {
      const rawState = window.localStorage.getItem(BSB_READER_STATE_KEY);
      const parsed = rawState ? JSON.parse(rawState) : null;
      if (parsed?.theme === "papyrus" || parsed?.theme === "night") setTheme(parsed.theme);
      if (parsed?.focusMode === "none" || parsed?.focusMode === "ruler" || parsed?.focusMode === "lantern") {
        setFocusMode(parsed.focusMode);
      }
      if (parsed?.fontStyle === "literary" || parsed?.fontStyle === "readable" || parsed?.fontStyle === "dyslexia") {
        setFontStyle(parsed.fontStyle);
      }
      if (typeof parsed?.showImages === "boolean") setShowImages(parsed.showImages);
      if (typeof parsed?.showWhispers === "boolean") setShowWhispers(parsed.showWhispers);
      if (Number.isFinite(parsed?.fontStep)) setFontStep(Math.max(0, Math.min(2, parsed.fontStep)));

      const bookmark = Number(window.localStorage.getItem(BSB_BOOKMARK_KEY) || 0);
      if (bookmark >= 1 && bookmark <= bigScaleChapters.length) setActiveChapter(bookmark);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        BSB_READER_STATE_KEY,
        JSON.stringify({ theme, focusMode, fontStyle, showImages, showWhispers, fontStep }),
      );
    } catch {}
  }, [theme, focusMode, fontStyle, showImages, showWhispers, fontStep]);

  useEffect(() => {
    try {
      window.localStorage.setItem(BSB_BOOKMARK_KEY, String(activeChapter));
    } catch {}

    writeMemoryEntry(activeChapter);
  }, [activeChapter]);

  useEffect(() => {
    const activeButton = chapterRailRef.current?.querySelector<HTMLElement>(
      `[data-reader-chapter="${activeChapter}"]`,
    );
    activeButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeChapter]);

  function jumpToChapter(chapterNumber: number) {
    playGlassSound("select");
    setActiveChapter(chapterNumber);
    setLitParagraphKey(null);
    window.setTimeout(() => {
      document.getElementById(`chapter-${chapterNumber}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function resumeChapter() {
    jumpToChapter(activeChapter);
  }

  function goToNextChapter() {
    const nextChapterNumber = activeChapter + 1;
    if (nextChapterNumber > bigScaleChapters.length) return;

    jumpToChapter(nextChapterNumber);
  }

  async function openObservationMode() {
    playGlassSound("open");
    setToolFeedback(readerToolCopy.allTools);
    await observationModeRef.current?.open?.();
  }

  const findVoiceParagraph = useCallback(
    (transcript: string) => {
      const normalized = normalizeSpeech(transcript);
      const words = normalized.split(" ").filter((word) => word.length > 2);
      if (words.length < 3) return null;

      const tailWords = words.slice(-14);
      const tailPhrase = tailWords.join(" ");
      const directMatch = voiceParagraphs.find(
        (paragraph) => tailPhrase.length > 14 && paragraph.normalized.includes(tailPhrase),
      );
      if (directMatch) return directMatch;

      const uniqueTailWords = Array.from(new Set(tailWords));
      let bestMatch: VoiceParagraph | null = null;
      let bestScore = 0;

      voiceParagraphs.forEach((paragraph) => {
        const score = uniqueTailWords.reduce((total, word) => {
          if (word.length < 4) return total;
          return paragraph.normalized.includes(word) ? total + 1 : total;
        }, 0);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = paragraph;
        }
      });

      return bestScore >= Math.min(5, uniqueTailWords.length) ? bestMatch : null;
    },
    [voiceParagraphs],
  );

  function stopVoiceFollow(feedback: ToolFeedback = readerToolCopy.voiceStopped) {
    voiceFollowWantedRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setVoiceFollowOn(false);
    setVoiceFollowStatus("idle");
    setToolFeedback(feedback);
    playGlassSound("close");
  }

  function startVoiceFollow() {
    const Recognition = getSpeechRecognitionConstructor();

    if (!window.isSecureContext || !Recognition) {
      setVoiceFollowOn(false);
      setVoiceFollowStatus("unsupported");
      setToolFeedback(readerToolCopy.voiceUnsupported);
      playGlassSound("error");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || navigator.language || "en-US";
    recognition.onresult = (event) => {
      let transcript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += ` ${event.results[index]?.[0]?.transcript ?? ""}`;
      }

      const match = findVoiceParagraph(transcript);
      if (!match) return;

      setLitParagraphKey(match.key);
      setActiveChapter(match.chapterNumber);
      window.setTimeout(() => {
        document.getElementById(`voice-paragraph-${match.key}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
    };
    recognition.onerror = (event) => {
      voiceFollowWantedRef.current = false;
      recognitionRef.current = null;
      setVoiceFollowOn(false);
      setVoiceFollowStatus(event.error === "not-allowed" || event.error === "service-not-allowed" ? "blocked" : "unsupported");
      setToolFeedback(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? readerToolCopy.voiceBlocked
          : readerToolCopy.voiceUnsupported,
      );
      playGlassSound("error");
    };
    recognition.onend = () => {
      if (!voiceFollowWantedRef.current) return;

      try {
        recognition.start();
      } catch {
        voiceFollowWantedRef.current = false;
        recognitionRef.current = null;
        setVoiceFollowOn(false);
        setVoiceFollowStatus("unsupported");
        setToolFeedback(readerToolCopy.voiceUnsupported);
      }
    };

    recognitionRef.current = recognition;
    voiceFollowWantedRef.current = true;
    setVoiceFollowOn(true);
    setVoiceFollowStatus("listening");
    setToolFeedback(readerToolCopy.voiceListening);

    try {
      recognition.start();
      playGlassSound("reveal");
    } catch {
      voiceFollowWantedRef.current = false;
      recognitionRef.current = null;
      setVoiceFollowOn(false);
      setVoiceFollowStatus("unsupported");
      setToolFeedback(readerToolCopy.voiceUnsupported);
      playGlassSound("error");
    }
  }

  function toggleVoiceFollow() {
    if (voiceFollowOn) {
      stopVoiceFollow();
      return;
    }

    startVoiceFollow();
  }

  useEffect(() => {
    return () => {
      voiceFollowWantedRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  function toolPreview(copy: ToolFeedback) {
    return {
      "aria-describedby": "bsb-tool-explainer",
      onFocus: () => setToolFeedback(copy),
      onPointerDown: () => setToolFeedback(copy),
    };
  }

  const activeChapterData = bigScaleChapters[activeChapter - 1] ?? bigScaleChapters[0];
  const activeChapterIndex = bigScaleChapters.findIndex((chapter) => chapter.number === activeChapter);
  const activeIndex = activeChapterIndex >= 0 ? activeChapterIndex : 0;
  const progress = Math.round(((activeIndex + 1) / bigScaleChapters.length) * 100);
  const nextChapter = bigScaleChapters[activeIndex + 1] ?? null;
  const readerControls = (
    <div className="bsb-reader-tool-panel">
      <div className="bsb-reader-control-group">
        <span>Text</span>
        <div className="bsb-reader-toolbox">
          <button
            type="button"
            onClick={() => {
              setFontStep((value) => Math.max(0, value - 1));
              setToolFeedback(readerToolCopy.fontDown);
            }}
            aria-label="Decrease text size"
            {...toolPreview(readerToolCopy.fontDown)}
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => {
              setFontStep((value) => Math.min(2, value + 1));
              setToolFeedback(readerToolCopy.fontUp);
            }}
            aria-label="Increase text size"
            {...toolPreview(readerToolCopy.fontUp)}
          >
            A+
          </button>
          <button
            className="is-wide"
            type="button"
            aria-label={`Change font style. Current font style is ${fontStyleLabels[fontStyle]}`}
            {...toolPreview(readerToolCopy.fontStyle)}
            onClick={() => {
              const nextFontStyle = getNextFontStyle(fontStyle);
              setFontStyle(nextFontStyle);
              setToolFeedback({
                title: "Font style",
                body: `Now using ${fontStyleLabels[nextFontStyle]}. ${fontStyleDescriptions[nextFontStyle]}`,
              });
              playGlassSound("select");
            }}
          >
            Font: {fontStyleLabels[fontStyle]}
          </button>
        </div>
      </div>
      <div className="bsb-reader-control-group">
        <span>Focus</span>
        <div className="bsb-reader-toolbox">
          <button
            type="button"
            aria-pressed={theme === "papyrus"}
            {...toolPreview(readerToolCopy.theme)}
            onClick={() => {
              setTheme((value) => (value === "night" ? "papyrus" : "night"));
              setToolFeedback(readerToolCopy.theme);
              playGlassSound("select");
            }}
          >
            {theme === "night" ? "Day" : "Night"}
          </button>
          <button
            type="button"
            aria-pressed={focusMode === "ruler"}
            {...toolPreview(readerToolCopy.ruler)}
            onClick={() => {
              setFocusMode((value) => (value === "ruler" ? "none" : "ruler"));
              setToolFeedback(readerToolCopy.ruler);
              playGlassSound("select");
            }}
          >
            Ruler
          </button>
          <button
            type="button"
            aria-pressed={focusMode === "lantern"}
            {...toolPreview(readerToolCopy.lantern)}
            onClick={() => {
              setFocusMode((value) => (value === "lantern" ? "none" : "lantern"));
              setToolFeedback(readerToolCopy.lantern);
              playGlassSound("select");
            }}
          >
            Lantern
          </button>
        </div>
      </div>
      <div className="bsb-reader-control-group">
        <span>Glass</span>
        <div className="bsb-reader-toolbox">
          <button
            type="button"
            aria-pressed={voiceFollowOn}
            {...toolPreview(readerToolCopy.voice)}
            onClick={toggleVoiceFollow}
          >
            {voiceFollowOn ? "Stop Voice" : "Follow Voice"}
          </button>
          <button
            type="button"
            aria-pressed={!showImages}
            {...toolPreview(readerToolCopy.images)}
            onClick={() => {
              setShowImages((value) => !value);
              setToolFeedback(readerToolCopy.images);
              playGlassSound(showImages ? "close" : "reveal");
            }}
          >
            {showImages ? "Hide Images" : "Show Images"}
          </button>
          <button
            type="button"
            aria-pressed={showWhispers}
            {...toolPreview(readerToolCopy.fieldNotes)}
            onClick={() => {
              setShowWhispers((value) => !value);
              setToolFeedback(readerToolCopy.fieldNotes);
              playGlassSound("select");
            }}
          >
            Field Notes
          </button>
        </div>
      </div>
      <div className="bsb-reader-control-group is-return">
        <span>Return</span>
        <div className="bsb-reader-toolbox">
          <CopyLinkButton
            onCopied={() => setToolFeedback(readerToolCopy.copyDone)}
            onPressStart={() => setToolFeedback(readerToolCopy.copy)}
          />
          <button className="bsb-open-glass" type="button" onClick={openObservationMode} {...toolPreview(readerToolCopy.allTools)}>
            All Story Controls
          </button>
        </div>
      </div>
      <div className="bsb-tool-explainer" id="bsb-tool-explainer" role="status" aria-live="polite">
        <span>{toolFeedback.title}</span>
        <p>{toolFeedback.body}</p>
      </div>
    </div>
  );

  return (
    <section
      className="bsb-immersive-reader"
      data-focus={focusMode}
      data-font-style={fontStyle}
      data-font-step={fontStep}
      data-theme={theme}
      aria-label="Immersive Big Scale Betrayal reader"
    >
      <ObservationModeBoot />
      <div className="bsb-scale-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="bsb-reader-command" aria-label="Big Scale Betrayal reader status">
        <div>
          <p className="eyebrow">Reader Instrument</p>
          <h2>The Scale Is Awake.</h2>
          <span>
            Chapter {activeChapter} / {bigScaleChapters.length} · {readingMinutes} min total
          </span>
        </div>
      </header>

      <div className="bsb-reader-stage">
        <aside className="bsb-chapter-rail" aria-label="Big Scale Betrayal chapters" ref={chapterRailRef}>
          <button className="bsb-resume-mark" type="button" onClick={resumeChapter}>
            <span>The Glass kept your place</span>
            <strong>Return to Chapter {activeChapter}</strong>
          </button>
          <nav>
            {bigScaleChapters.map((chapter) => (
              <button
                aria-current={chapter.number === activeChapter ? "page" : undefined}
                className={chapter.number === activeChapter ? "is-active" : ""}
                data-reader-chapter={chapter.number}
                key={chapter.number}
                type="button"
                onClick={() => jumpToChapter(chapter.number)}
              >
                <span>{String(chapter.number).padStart(2, "0")}</span>
                <strong>{chapter.label}</strong>
              </button>
            ))}
          </nav>
        </aside>

        <div className="bsb-reader-scroll">
          <observation-mode
            ref={observationModeRef}
            manifest-src="/big-scale-betrayal/manifest.json"
            reading-time-min={readingMinutes}
            data-flag-second-gaze="on"
            data-flag-change-lens="off"
            hide-entry="true"
          >
            <article className="bsb-immersive-scroll om-source">
              <section
                className="bsb-immersive-chapter"
                data-chapter-number={activeChapterData.number}
                id={`chapter-${activeChapterData.number}`}
                key={activeChapterData.number}
              >
                <div className="bsb-chapter-record-head">
                  <span>{String(activeChapterData.number).padStart(2, "0")}</span>
                  <div>
                    <p className="eyebrow">Scale Record</p>
                    <h2>{activeChapterData.title}</h2>
                  </div>
                </div>
                <p className="bsb-chapter-deck">{activeChapterData.deck}</p>
                <div className="bsb-hold-question">
                  <span>Hold this question</span>
                  <p>{chapterQuestions[activeIndex] ?? activeChapterData.deck}</p>
                </div>
                {showWhispers ? (
                  <div className="bsb-palace-whisper" role="note" aria-label={`Chapter ${activeChapterData.number} field note`}>
                    <span>Field Note</span>
                    <p>{fieldNotes[activeIndex] ?? "The record is listening for what power tries to rename."}</p>
                  </div>
                ) : null}
                <div className="bsb-prose">
                  {activeChapterData.paragraphs.map((paragraph, paragraphIndex) => (
                    <div
                      className={`bsb-prose-block${litParagraphKey === `${activeChapterData.number}-${paragraphIndex}` ? " is-voice-lit" : ""}`}
                      key={`${activeChapterData.number}-${paragraphIndex}-${paragraph.slice(0, 20)}`}
                    >
                      <p className={paragraphIndex === 0 ? "bsb-drop" : undefined} id={`voice-paragraph-${activeChapterData.number}-${paragraphIndex}`}>
                        {paragraph}
                      </p>
                      <ChapterMediaBlock
                        after={paragraphIndex + 1}
                        chapterNumber={activeChapterData.number}
                        showImages={showImages}
                      />
                    </div>
                  ))}
                </div>
                <div className="bsb-chapter-turn" aria-label="Chapter navigation">
                  {nextChapter ? (
                    <button type="button" onClick={goToNextChapter}>
                      Continue to {nextChapter.label}
                      <span aria-hidden="true">→</span>
                    </button>
                  ) : (
                    <a href="#big-scale-betrayal" onClick={() => playGlassSound("travel")}>
                      Return to the steps
                    </a>
                  )}
                </div>
              </section>
            </article>
          </observation-mode>
        </div>

        <aside className="bsb-reader-controls" aria-label="Big Scale Betrayal reader controls">
          <div className="bsb-reader-controls-head">
            <p className="eyebrow">Reader Controls</p>
            <h3>The Glass in Hand</h3>
          </div>
          {readerControls}
        </aside>
      </div>

      {!nextChapter ? (
        <section className="bsb-threshold" aria-label="End of chapter sixteen">
          <p className="eyebrow">End of Chapter Sixteen</p>
          <h2>They are almost sure no one will find it.</h2>
          <p>The record is complete. The Glass remembers what the world misnames.</p>
          <a href="#big-scale-betrayal" onClick={() => playGlassSound("travel")}>
            Return to the steps
          </a>
        </section>
      ) : null}
    </section>
  );
}
