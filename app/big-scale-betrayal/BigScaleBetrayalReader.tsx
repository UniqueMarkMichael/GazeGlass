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
    type: "image",
    src: `${assetBase}/chapter1-royal-guardian.png`,
    fit: "contain",
    alt: "The armored crocodile guardian watches the royal library steps of Kemet",
    caption: "The armored guardian of the royal library of Kemet, bells at its throat, incense at its brow.",
  },
  {
    chapterNumber: 1,
    after: 3,
    type: "image",
    src: `${assetBase}/chapter1-heba-amunet.png`,
    fit: "contain",
    alt: "Heba holds a cabbage beside Amunet at their crowded market stall",
    caption: "Amunet weighs love against debt while Heba keeps her hands on the cabbages.",
  },
  {
    chapterNumber: 1,
    after: 14,
    type: "image",
    src: `${assetBase}/chapter1-namoot-crystal.png`,
    fit: "contain",
    alt: "Namoot offers a glowing amethyst crystal to Heba at the cabbage stall while Amunet watches",
    caption: "Namoot brings the amethyst close, and the spirits enter the stall before Heba can name them.",
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
    after: 37,
    type: "image",
    src: `${assetBase}/chapter1-feather-sun.png`,
    fit: "contain",
    alt: "Namoot throws Amunet's white feather into the blazing red sun above the market",
    caption: "Namoot throws the feather, and the sun counts five circles before returning it.",
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
  {
    chapterNumber: 4,
    after: 1,
    type: "image",
    src: `${assetBase}/chapter4-heba-wakes-palace.png`,
    fit: "cover",
    alt: "Heba wakes on an ornate palace bed beneath gold chandeliers and murals of the gods",
    caption: "Heba wakes beneath gold and god-murals, far from the cabbage stall.",
  },
  {
    chapterNumber: 4,
    after: 10,
    type: "image",
    src: `${assetBase}/chapter4-queen-of-kemet.png`,
    fit: "contain",
    alt: "The Queen of Kemet extends her hand in a golden palace chamber",
    caption: "The great royal wife offers her hand, and the palace names her queen.",
  },
  {
    chapterNumber: 4,
    after: 59,
    type: "image",
    src: `${assetBase}/chapter4-tawet-seket-rift.png`,
    fit: "cover",
    alt: "Tawet conjures a cloud while Seket steps through a golden rift beside Heba in the palace",
    caption: "Tawet shows off, Seket tears through the air, and Heba lands on a cloud.",
  },
  {
    chapterNumber: 4,
    after: 71,
    type: "image",
    src: `${assetBase}/chapter4-pharaoh-of-kemet.png`,
    fit: "cover",
    alt: "The Pharaoh of Kemet appears in gold light while attendants bow in the palace",
    caption: "The Pharaoh gathers himself from black sand, and the room remembers how to kneel.",
  },
  {
    chapterNumber: 5,
    after: 4,
    type: "image",
    src: `${assetBase}/chapter5-pharaoh-conjures-cat.png`,
    fit: "cover",
    alt: "The Pharaoh conjures a smoky rainbow cat onto Heba's shoulder in the palace",
    caption: "The Pharaoh gives smoke weight, and Heba learns the palace can make wonder feel like command.",
  },
  {
    chapterNumber: 5,
    after: 24,
    type: "image",
    src: `${assetBase}/chapter5-heba-meets-aken.png`,
    fit: "cover",
    alt: "Heba faces Prince Aken as shadowy Heka gathers behind him in the palace",
    caption: "Aken arrives with a darker silence, and Heba feels another royal heart enter the room.",
  },
  {
    chapterNumber: 5,
    after: 41,
    type: "image",
    src: `${assetBase}/chapter5-heba-dreams-unity.png`,
    fit: "cover",
    alt: "Heba stands between the royal family as golden light connects them in the palace",
    caption: "The royal family closes around Heba, beautiful as a promise and dangerous as a lock.",
  },
  {
    chapterNumber: 5,
    after: 68,
    type: "image",
    src: `${assetBase}/chapter5-ahmose-ice-flower.png`,
    fit: "cover",
    alt: "Ahmose conjures a delicate ice flower between himself and Heba in the palace",
    caption: "Ahmose turns tears into ice, and the flower between them says what neither can afford to name.",
  },
  {
    chapterNumber: 6,
    after: 23,
    type: "image",
    src: `${assetBase}/chapter6-mata-first-lesson.png`,
    fit: "cover",
    alt: "Mata sits with Heba and a black jackal beside an old linen strip painted with a scale",
    caption: "Mata sets the first lesson between them, old linen holding a truth Heba has already seen.",
  },
  {
    chapterNumber: 6,
    after: 81,
    type: "image",
    src: `${assetBase}/chapter6-black-sand-trace.png`,
    fit: "cover",
    alt: "Mata, Heba, and a black jackal find glittering black sand before the royal throne",
    caption: "The jackal finds black sand before the throne, and the palace loses another layer of gold.",
  },
  {
    chapterNumber: 6,
    after: 160,
    type: "image",
    src: `${assetBase}/chapter6-ahmose-doorway.png`,
    fit: "cover",
    alt: "Ahmose raises his hands in the palace doorway while Heba, Mata, and the jackal watch him",
    caption: "Ahmose enters with empty hands, inked nails, and a silence Heba cannot weigh.",
  },
  {
    chapterNumber: 6,
    after: 294,
    type: "image",
    src: `${assetBase}/chapter6-scale-heart-beats.png`,
    fit: "cover",
    alt: "Heba holds the old linen scale as the painted heart glows red in her hands",
    caption: "The lesson warms in Heba's hands, and the painted heart begins to beat.",
  },
  {
    chapterNumber: 7,
    after: 12,
    type: "image",
    src: `${assetBase}/chapter7-copper-corridor.png`,
    fit: "cover",
    alt: "Heba, Mata, Ahmose, the jackal, and crocodile guardians move through a copper-lined palace corridor",
    caption: "The corridor narrows, the pots watch, and even the crocodiles know where not to follow.",
  },
  {
    chapterNumber: 7,
    after: 32,
    type: "image",
    src: `${assetBase}/chapter7-duna-kitchen-ghost.png`,
    fit: "cover",
    alt: "The golden spirit of Duna kneads bread before Heba, Mata, and the jackal in the palace kitchen",
    caption: "Duna sings without a heartbeat, and the kitchen remembers a man the palace forgot to ask about.",
  },
  {
    chapterNumber: 7,
    after: 53,
    type: "image",
    src: `${assetBase}/chapter7-mata-golden-word.png`,
    fit: "cover",
    alt: "Mata raises one hand as golden Heka spirals over a honey-cake trace in the palace kitchen",
    caption: "Mata spends one word, the loaves sink, and the trap leaves a honey-cake shape behind.",
  },
  {
    chapterNumber: 7,
    after: 93,
    type: "image",
    src: `${assetBase}/chapter7-threshold-scale.png`,
    fit: "cover",
    alt: "Heba kneels with a lamp before a black-sand scale drawn across a palace threshold",
    caption: "At the threshold, black sand writes Heba's name and draws the shape that has been following her.",
  },
  {
    chapterNumber: 8,
    after: 15,
    type: "image",
    src: `${assetBase}/chapter8-userhat-trainees.png`,
    fit: "cover",
    alt: "Userhat stands before a line of temple trainees while Heba watches in the hall of trials",
    caption: "Userhat walks the line of trainees, and Heba learns the hall of trials has already begun weighing her.",
  },
  {
    chapterNumber: 8,
    after: 20,
    type: "image",
    src: `${assetBase}/chapter8-chamber-revealed.png`,
    fit: "cover",
    alt: "Heba and the trainees stand before the vast golden chamber of judgment beneath the western temple",
    caption: "The far wall opens, and the chamber of judgment reveals a floor that is already paying attention.",
  },
  {
    chapterNumber: 8,
    after: 34,
    type: "image",
    src: `${assetBase}/chapter8-heba-crosses-sand.png`,
    fit: "cover",
    alt: "Heba walks alone across the glowing sand floor of the chamber of judgment",
    caption: "Heba steps onto the sand alone, and the floor begins to ask what she is made of.",
  },
  {
    chapterNumber: 9,
    after: 4,
    type: "image",
    src: `${assetBase}/chapter9-cat-no-shadow.png`,
    fit: "cover",
    alt: "Heba writes notes in a palace doorway while a gray cat with no shadow watches from the sunlit ledge",
    caption: "Heba keeps a ledger of small lies, and the cat with no shadow makes the page heavier.",
  },
  {
    chapterNumber: 9,
    after: 12,
    type: "image",
    src: `${assetBase}/chapter9-blue-flames-corridor.png`,
    fit: "cover",
    alt: "Userhat presents a corridor lit by blue flames to Heba, Pharaoh, and the remaining trainees",
    caption: "Userhat names the second trial, and the corridor answers in blue fire.",
  },
  {
    chapterNumber: 9,
    after: 24,
    type: "image",
    src: `${assetBase}/chapter9-hall-borrowed-voices.png`,
    fit: "contain",
    alt: "Heba walks through the dark Hall of Borrowed Voices as golden and silver smoke takes shape around her",
    caption: "Inside the sealed dark, borrowed voices gather close enough to touch.",
  },
  {
    chapterNumber: 9,
    after: 53,
    type: "image",
    src: `${assetBase}/chapter9-emergence-far-door.png`,
    fit: "cover",
    alt: "Heba emerges from the far door of the Hall of Borrowed Voices while Userhat and attendants look up in shock",
    caption: "Heba reaches the far door with her own feet, and the watching hall has to record it.",
  },
  {
    chapterNumber: 10,
    after: 25,
    type: "image",
    src: `${assetBase}/chapter10-rooftop-evening.png`,
    fit: "cover",
    alt: "Heba and Ahmose sit on a palace rooftop above the moonlit Nile with market food between them",
    caption: "One evening, the rooftop lets them be seventeen before the palace remembers its teeth.",
  },
  {
    chapterNumber: 10,
    after: 39,
    type: "image",
    src: `${assetBase}/chapter10-house-of-learning-stars.png`,
    fit: "cover",
    alt: "Ahmose points to a star-drawn house of learning above Kemet as Heba watches beside him",
    caption: "Ahmose sketches a house with no locks, and the stars hold the shape for one breath.",
  },
  {
    chapterNumber: 10,
    after: 65,
    type: "image",
    src: `${assetBase}/chapter10-mirror-warning.png`,
    fit: "cover",
    alt: "Heba faces a bronze mirror where Ahmose's reflection raises a finger to its lips while the real prince walks away",
    caption: "The bronze keeps smiling after the boy has gone.",
  },
  {
    chapterNumber: 11,
    after: 2,
    type: "image",
    src: `${assetBase}/chapter11-mata-blue-mortar.png`,
    fit: "cover",
    alt: "Heba watches Mata grind blue powder in her workroom while the black jackal rests in the doorway",
    caption: "Mata grinds the blue warning, and the third trial waits until the honest hour.",
  },
  {
    chapterNumber: 11,
    after: 9,
    type: "image",
    src: `${assetBase}/chapter11-heart-trial-dream.png`,
    fit: "cover",
    alt: "Heba sleeps as golden dream light opens from the palace room toward Kemet at dawn",
    caption: "The trial comes for Heba in sleep, wearing the life she wants most.",
  },
  {
    chapterNumber: 11,
    after: 17,
    type: "image",
    src: `${assetBase}/chapter11-perfect-market.png`,
    fit: "cover",
    alt: "Heba stands before a radiant dream-market cabbage stall where her family laughs in golden light",
    caption: "The market offers Heba a paid debt, a whole family, and a price hidden under honey light.",
  },
  {
    chapterNumber: 11,
    after: 42,
    type: "image",
    src: `${assetBase}/chapter11-cosmic-scale.png`,
    fit: "contain",
    alt: "Heba stands before a vast cosmic scale holding a white feather and a glowing heart among the stars",
    caption: "The true scale fills the dark, and Heba learns the palace has only ever held a shadow of it.",
  },
  {
    chapterNumber: 12,
    after: 4,
    type: "image",
    src: `${assetBase}/chapter12-festival-road.png`,
    fit: "cover",
    alt: "Heba stands at the flood festival beside a stall selling braided hair extensions, gold rings, and river offerings",
    caption: "At the flood festival, Heba finds her own designs laid out in someone else's rows.",
  },
  {
    chapterNumber: 12,
    after: 16,
    type: "image",
    src: `${assetBase}/chapter12-match-day-courtyard.png`,
    fit: "cover",
    alt: "Heba stands alone in the raked sand of the Match Day courtyard before the royal family and crocodile guardians",
    caption: "Match Day gathers the royal family, the crocodiles, and every eye that wants Heba named.",
  },
  {
    chapterNumber: 12,
    after: 36,
    type: "image",
    src: `${assetBase}/chapter12-sand-scale-overhead.png`,
    fit: "cover",
    alt: "An overhead view of the Match Day courtyard as the raked sand forms a vast sacred scale around Heba",
    caption: "The sand answers Userhat and draws the scale large enough for all of Kemet to see.",
  },
  {
    chapterNumber: 12,
    after: 84,
    type: "image",
    src: `${assetBase}/chapter12-book-of-the-broken.png`,
    fit: "cover",
    alt: "The Book of the Broken lies hidden inside a bronze tray as a hand reaches toward it in a torchlit palace corridor",
    caption: "The tray opens, the flames pull back, and the planted book finally shows its teeth.",
  },
  {
    chapterNumber: 13,
    after: 2,
    type: "image",
    src: `${assetBase}/chapter13-descent-to-cells.png`,
    fit: "contain",
    alt: "Heba descends wet stone stairs toward the cells carrying Nahara's faceless doll",
    caption: "Heba carries the doll below the festival noise, toward the door Sate thought would stop her.",
  },
  {
    chapterNumber: 13,
    after: 8,
    type: "image",
    src: `${assetBase}/chapter13-iron-door-guards.png`,
    fit: "contain",
    alt: "Heba faces two guards before a massive iron cell door in a torchlit prison corridor",
    caption: "Two guards learn the Fifth Judgment is not a title they want tested.",
  },
  {
    chapterNumber: 13,
    after: 13,
    type: "image",
    src: `${assetBase}/chapter13-straight-cell.png`,
    fit: "contain",
    alt: "Nahara's empty cell with squared straw, aligned sandals, and torchlight falling through the bars",
    caption: "Even in a cell, Nahara has squared the straw and lined up what little the palace left her.",
  },
  {
    chapterNumber: 13,
    after: 80,
    type: "image",
    src: `${assetBase}/chapter13-two-taps-iron.png`,
    fit: "contain",
    alt: "Heba presses her hand to the iron cell door while holding Nahara's faceless doll",
    caption: "Two taps on iron say what neither girl can afford to say aloud.",
  },
  {
    chapterNumber: 14,
    after: 20,
    type: "image",
    src: `${assetBase}/chapter14-queen-magic-berserk.png`,
    fit: "contain",
    alt: "The Queen of Kemet stands in the throne room as thorned vines overrun the walls and columns",
    caption: "The queen's magic shows what her perfect stillness has been holding back.",
  },
  {
    chapterNumber: 14,
    after: 57,
    type: "image",
    src: `${assetBase}/chapter14-ahmose-winter-table.png`,
    fit: "cover",
    alt: "Ahmose freezes the feast table and the people around him in the palace",
    caption: "Winter leaves Ahmose's hands and makes statues of everyone close enough to obey.",
  },
  {
    chapterNumber: 14,
    after: 83,
    type: "image",
    src: `${assetBase}/chapter14-golden-judgment-doors.png`,
    fit: "contain",
    alt: "Ancient golden judgment doors open against a star-filled dark",
    caption: "The door behind the family is not open yet, but the Glass has begun to show its shape.",
  },
  {
    chapterNumber: 14,
    after: 94,
    type: "image",
    src: `${assetBase}/chapter14-black-sand-names.png`,
    fit: "contain",
    alt: "Heba kneels with a lamp before six names written in black sand across her threshold",
    caption: "At Heba's door, black sand writes the ledger the palace buried.",
  },
  {
    chapterNumber: 15,
    after: 3,
    type: "image",
    src: `${assetBase}/chapter15-jackals-at-sunrise.png`,
    fit: "cover",
    alt: "Jackals watch the sunrise over Kemet and the flooded fields before the weighing",
    caption: "The sun rises early, and even the jackals go quiet before the weighing.",
  },
  {
    chapterNumber: 15,
    after: 25,
    type: "image",
    src: `${assetBase}/chapter15-great-scale-stands.png`,
    fit: "contain",
    alt: "The great scale fills the throne room as Heba stands before Ahmose and the royal family",
    caption: "The painted scale leaves the linen and becomes large enough to hold a dynasty.",
  },
  {
    chapterNumber: 15,
    after: 56,
    type: "image",
    src: `${assetBase}/chapter15-ahmose-weigh-me.png`,
    fit: "cover",
    alt: "Ahmose kneels before Heba beneath the suspended feather and heart plates",
    caption: "Ahmose asks for honest weight, with no thumb on the plate.",
  },
  {
    chapterNumber: 15,
    after: 74,
    type: "image",
    src: `${assetBase}/chapter15-door-of-scales.png`,
    fit: "cover",
    alt: "Heba stands before a vast radiant doorway filled with thousands of hanging scales",
    caption: "The wall opens, and the room where all ledgers are kept looks back.",
  },
  {
    chapterNumber: 16,
    after: 10,
    type: "image",
    src: `${assetBase}/chapter16-duna-farewell.png`,
    fit: "cover",
    alt: "Duna appears in golden spirit light before Ahmose as the dead pass through the doors",
    caption: "Duna gives the last line of the lullaby and walks into the light.",
  },
  {
    chapterNumber: 16,
    after: 65,
    type: "image",
    src: `${assetBase}/chapter16-black-sarcophagus.png`,
    fit: "cover",
    alt: "Heba lays her hand on a black sarcophagus carved with a scale while Mata and the jackal watch",
    caption: "Two taps return from the dark, small as rain.",
  },
  {
    chapterNumber: 16,
    after: 80,
    type: "image",
    src: `${assetBase}/chapter16-heba-own-judgment.png`,
    fit: "contain",
    alt: "Heba stands on the glowing plate of the great scale while the court kneels below",
    caption: "The bearer steps onto her own judgment at honest weight.",
  },
  {
    chapterNumber: 16,
    after: 105,
    type: "image",
    src: `${assetBase}/chapter16-second-kiss.png`,
    fit: "contain",
    alt: "Heba and Ahmose share their chosen second kiss before the opened doors",
    caption: "Her second kiss is chosen in the open, at honest weight.",
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
        JSON.stringify({ focusMode, fontStyle, showImages, showWhispers, fontStep }),
      );
    } catch {}
  }, [focusMode, fontStyle, showImages, showWhispers, fontStep]);

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
      data-theme="night"
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
