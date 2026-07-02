"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stage = "cover" | "reading" | "choice" | "ending";
type Choice = "marok" | "kitsu" | "both";
type ReaderTheme = "day" | "night";

type Chapter = {
  number: string;
  label: string;
  title: string;
  readTime: string;
  question: string;
  hero: string;
  heroAlt: string;
  accent: "rose" | "green" | "gold";
  summary: string;
  hook: string;
  body: string[];
  scene?: {
    after: number;
    src: string;
    alt: string;
    caption: string;
    video?: boolean;
  };
};

const chapters: Chapter[] = [
  {
    number: "01",
    label: "Chapter One",
    title: "The Celestial Court",
    readTime: "~9 min",
    question: "What does Jem fear about being wanted?",
    hero: "/a-court-of-foxes/assets/ch1-beauty-throne.png",
    heroAlt: "Jem beside the God of Beauty in a rose and gold celestial court",
    accent: "rose",
    summary:
      "Jem is sent down to live one mortal hour, escorted by War and shadowed by Justice.",
    hook:
      "The crystal doors seal behind them. Below the court waits a stairway of black stone.",
    scene: {
      after: 4,
      src: "/a-court-of-foxes/assets/ch1-court-interior.png",
      alt: "The Celestial Court with stained glass, gold mirrors, and candlelight",
      caption: "The Celestial Court glittered like a cage pretending to be light.",
    },
    body: [
      "I counted seven exits before the first fox smiled at me.",
      "Not kindly. Not subtly. With teeth. Divine courts were full of teeth.",
      "My goddess always told me I was no ordinary vixen, that I should never settle. Standing in that glittering room, I wondered if she understood those were two different instructions.",
      "The Celestial Court glittered like gold. Pillars of multi-colored glass rose into a ceiling too high to trust. Pillar candles burned in floating rings above us, rose-bright at the center and honey-gold at the edges.",
      "Gods Watch. Mortals Pray. Spirits Remember.",
      "Every fox sat beside their patron deity with absolute reverence. One god. One fox. That was the law, and attendance was not optional.",
      "I stood at the right hand of the God of Beauty and pretended not to notice the weight of her gaze on the back of my bejeweled neck.",
      "Beauty lies even when the truth is told. We all want to see what we want to see.",
      "A mortal servant passed by with a tray of sugared figs. Beneath the nearest moonflower, one petal had browned at the edge. I saw it because my goddess had made me to see such things. The flaw under the ornament. The hunger under the smile.",
      "\"Jem,\" the God of Beauty said, each syllable drawn like pulled silk.",
      "\"You are counting exits again.\"",
      "\"Only admiring the architecture,\" I said.",
      "Then the western doors opened late. Marok, divine assistant to the God of War, entered as though applause had been promised and merely forgotten.",
      "The eastern doors opened next. Kitsu, divine assistant to the God of Justice, entered at the exact appointed moment, as if the court's clock had taken lessons from his spine.",
      "The God of Beauty rose from her throne. \"My assistant, Jem, will attend the mortal hour,\" she announced. \"War's assistant seems eager to escort her. Justice's fox seems eager to prevent catastrophe. How convenient. They may both go.\"",
      "I stopped at the threshold and counted the exits one last time. Seven behind me. One ahead. Marok came to my left, warm as trouble. Kitsu came to my right, quiet as a verdict.",
    ],
  },
  {
    number: "02",
    label: "Chapter Two",
    title: "The Mortal Hour",
    readTime: "~10 min",
    question: "What does Jem surrender when she lets herself be touched?",
    hero: "/a-court-of-foxes/assets/ch2-stairway.png",
    heroAlt: "Three fox spirits descending a black stairway veined with amber",
    accent: "gold",
    summary:
      "The three surrender their tails and step into borrowed mortal flesh.",
    hook:
      "Below waits the mortal city: music, smoke, and the first hour Jem has ever belonged to no one.",
    scene: {
      after: 7,
      src: "/a-court-of-foxes/assets/ch2-ritual.png",
      alt: "Three crescent basins where the foxes surrender their tails",
      caption: "Before the ninth bell, all borrowed things must be named.",
    },
    body: [
      "Icy air grasped my lungs as we exited the Celestial Court.",
      "I had expected gold. Everything above had been gold, or glass pretending to be gold, or beauty pretending not to be a cage.",
      "The stairway beneath the Celestial Court had been cut from black stone veined with amber light. It spiraled down through the body of the palace like a secret no one wished to claim.",
      "Marok took the stairs as if gravity had offended him personally. Kitsu descended as though every stair had filed a petition and he had approved each one in order.",
      "\"Still time to confess this was a joke,\" Kitsu said.",
      "\"The tragic thing about you, golden boy, is that you think jokes cannot also be destiny,\" Marok said.",
      "I should have remained silent. Silence was safer. Instead I said, \"If this is destiny, it has poor manners.\"",
      "The stairway ended at a door made of dark mirror-glass. No handle. No hinge. Only our reflections warped across its surface.",
      "Three crescent basins waited beyond the door. Each basin held water so still it looked like polished black stone. Above them, written in old script: The Mortal Hour.",
      "Tails surrendered before the ninth bell. Borrowed bodies returned before dawn.",
      "The water took my tail without pain. That was almost worse. A painless severing teaches you that a cage can be velvet-lined.",
      "When I looked up, my paws had become hands. My fur had become hair. Marok was laughing like a man who had just discovered knees. Kitsu looked personally offended by having shoulders.",
      "In the mirror behind us, a silver-tailed fox appeared for one heartbeat, pale as old moonlight.",
      "\"What did you see?\" Kitsu asked.",
      "I looked at the empty mirror, then at Marok's hand still wrapped around mine, then toward the mortal city, where music waited like a dare.",
    ],
  },
  {
    number: "03",
    label: "Chapter Three",
    title: "The Ninth Bell",
    readTime: "~12 min",
    question: "What does Jem forget when no one is holding her neck?",
    hero: "/a-court-of-foxes/assets/ch3-street.png",
    heroAlt: "Jem, Marok, and Kitsu outside a warm tavern on a rainy mortal street",
    accent: "green",
    summary:
      "The Scale of Judgment shatters at the Ninth Bell. Its halves vanish into the city.",
    hook:
      "Two halves. Two directions. Jem cannot carry both.",
    scene: {
      after: 9,
      src: "/a-court-of-foxes/assets/ch3-dance-video.mp4",
      alt: "Jem and Marok dancing in the Ninth Bell",
      caption: "Music had knees. It had hips. It made borrowed blood answer.",
      video: true,
    },
    body: [
      "I had assumed the mortal city would smell worse.",
      "It did, obviously. But not simply worse. It smelled impossibly alive.",
      "Smoke curled from iron chimneys and roasted-chestnut carts. Rainwater slicked the cobblestones in silver ribbons. Somewhere close, music pulsed against the night.",
      "\"Mortals live in this?\" I asked.",
      "\"Some of them even enjoy it,\" Marok said.",
      "The sign above the tavern door read The Ninth Bell. Music thudded behind it, not the clean harp-notes of the Celestial Court. This music had knees. It had hips.",
      "Inside, mortals laughed beneath amber lamps. A Scale of Judgment hung above the bar, ornamental and illegal and glowing with the wrong kind of light.",
      "Kitsu went very still. \"That should not be here.\"",
      "Marok grinned. \"That is what makes it interesting.\"",
      "Then Marok held out his hand, and because I was in a borrowed body and the music had already betrayed me, I took it.",
      "For one song, I forgot the God of Beauty's hand at the back of my neck. I forgot the rules. I forgot that wanting was a door someone else could lock behind you.",
      "Kitsu watched from the edge of the room like a verdict refusing to interrupt the crime.",
      "The Scale above the bar began to glow. Larimar first. Then magenta. Then a gold so sharp every glass in the room rang.",
      "Kitsu reached for it. Marok reached too. I shouted their names, but the Ninth Bell struck before either fox could listen.",
      "The Scale broke in their hands. One half vanished east. One half fell through the floor into the dark below.",
      "For once, Marok did not smile.",
    ],
  },
  {
    number: "04",
    label: "Chapter Four",
    title: "The Thread Cut",
    readTime: "~8 min",
    question: "What remains when a fox is severed from what named them?",
    hero: "/a-court-of-foxes/assets/ch4-hero.png",
    heroAlt: "Jem, Marok, and Kitsu on the tavern floor after the Scale breaks",
    accent: "green",
    summary:
      "All assistant tails across the heavens are severed. Marok knows a name he should not.",
    hook:
      "The Tail Market has entered the story, and the gods are no longer the only danger.",
    scene: {
      after: 8,
      src: "/a-court-of-foxes/assets/ch4-braid.png",
      alt: "Rose, green, and gold light braiding around Jem, Marok, and Kitsu",
      caption: "For one breath, rose, green, and gold remembered the same shape.",
    },
    body: [
      "The true Bell did not ring above us. It rang through us.",
      "Mortals screamed. Someone dropped a mug, and the sound of it breaking was so small beneath the Bell that it seemed almost shy.",
      "The Bell rang again. My borrowed ribs squeezed around the sound, and something behind my spine answered with a pain so sharp I forgot the tavern.",
      "My tail. Except my tail was gone.",
      "\"Jem,\" Kitsu said. His hands curled against the floor until his knuckles went white.",
      "Marok made no attempt to be dignified. \"What is that?\"",
      "\"A summons,\" Kitsu said.",
      "The floor remained committed to being a floor, but the pull of the Bell seized us by something deeper than flesh and yanked.",
      "We woke in the Mortal Hour chamber. The three basins stood empty. Across every wall, the same words multiplied in silver fire: Assistants Severed.",
      "The mirror showed the Celestial Court in panic. Gods rising. Fox assistants crouched low as if something had been ripped from their spines.",
      "Saroka flashed past the glass, scarlet ears flattened, no tail behind her.",
      "Marok stared at the message longer than fear required.",
      "\"Tail Market,\" he said.",
      "Kitsu turned slowly toward him. The chamber chilled.",
      "\"What is the Tail Market?\" I asked.",
      "Marok did not answer. That was how I knew the next problem had arrived.",
    ],
  },
  {
    number: "05",
    label: "Chapter Five",
    title: "No Foxes. No Judgment.",
    readTime: "~9 min",
    question: "Who benefits when every witness is removed?",
    hero: "/a-court-of-foxes/assets/ch5-court-mirror.png",
    heroAlt: "The Celestial Court reflected in a black mirror while fox spirits panic",
    accent: "gold",
    summary:
      "Marok knew. Before Attendance, before the night began. The warning was real.",
    hook:
      "Someone inside the court wanted no foxes present. The Tail Market waits.",
    scene: {
      after: 8,
      src: "/a-court-of-foxes/assets/ch5-vision.png",
      alt: "A vision of the Tail Market, an alley of cages and a silver fox",
      caption: "The Tail Market was no rumor. It was a mouth under the city.",
    },
    body: [
      "The chamber smelled like crushed flowers left too long in the rain.",
      "My goddess's magic always announced itself politely before it lied.",
      "Kitsu was staring at Marok. Marok was staring at the basin. I was staring at both of them and thinking that if the gods had wanted me obedient, they should not have made me this good at noticing rot.",
      "\"The Tail Market is a rumor,\" Kitsu said.",
      "Marok gave a very small laugh. It had no joy in it.",
      "\"You sound almost convinced.\"",
      "Kitsu's hand moved. Gold light circled his fingers, thin as wire. Not a spell, exactly. Worse. Law remembering it had teeth.",
      "\"Enough,\" I said. Both males looked at me. Good.",
      "\"If you are about to drag the truth out of him, ask the question that matters. Marok, who told you where trouble kept its address?\"",
      "Marok's grin flickered and went out.",
      "The basin filled with vision: an alley under the city, cages stacked like prayer shelves, silver fur moving behind bars.",
      "No foxes. No Judgment. The warning finally made sense.",
      "Someone inside the court had wanted every witness removed before the Scale broke.",
      "Kitsu passed Marok without touching him. \"We move.\"",
      "Marok followed. I took one step after them, then another.",
      "My borrowed feet ached. My spine felt unfinished. The night opened its teeth and waited.",
    ],
  },
];

const endingCopy = {
  marok: {
    title: "The Spark",
    body:
      "You chose the fox who treats rules like a dare. The half of the Scale you carried home is scorched at the edges, and so, a little, are you.",
    thread: "War's green thread burns bright beside Beauty's rose.",
  },
  kitsu: {
    title: "The Verdict",
    body:
      "You chose the fox who looks at the exits before the gods. The Scale came home level, and Kitsu never once let go of your right hand.",
    thread: "Justice's gold thread holds steady beside Beauty's rose.",
  },
  both: {
    title: "The Bond",
    body:
      "You chose the third way. Jem does not become a prize passed between War and Justice. She touches both first, and the bond answers because none of them are diminished.",
    thread: "Beauty's rose, War's green, and Justice's gold braid into one chosen witness.",
  },
};

function choiceLabel(choice: Choice | null) {
  if (choice === "marok") {
    return "Marok path selected";
  }

  if (choice === "kitsu") {
    return "Kitsu path selected";
  }

  if (choice === "both") {
    return "Both path selected";
  }

  return "No path selected";
}

function choiceConfirmation(choice: Choice) {
  if (choice === "marok") {
    return "You step toward Marok. The green thread winds tighter, and the night gets less careful.";
  }

  if (choice === "kitsu") {
    return "You step toward Kitsu. The gold thread winds tighter, and Justice crosses at your right.";
  }

  return "You refuse to make desire into a verdict. Rose, green, and gold braid together, and both foxes cross the dark with you.";
}

export function CourtOfFoxesExperience() {
  const [stage, setStage] = useState<Stage>("cover");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [theme, setTheme] = useState<ReaderTheme>("day");
  const [fontStep, setFontStep] = useState(1);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [beautySight, setBeautySight] = useState(false);
  const [joined, setJoined] = useState(false);
  const readerRef = useRef<HTMLDivElement | null>(null);

  const chapter = chapters[chapterIndex];
  const ending = endingCopy[choice ?? "kitsu"];
  const progress = stage === "cover" ? 0 : stage === "ending" ? 100 : Math.round(((chapterIndex + 1) / chapters.length) * 82);

  const fontClass = useMemo(() => `cof-font-${fontStep}`, [fontStep]);

  useEffect(() => {
    readerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterIndex, stage]);

  function begin() {
    setStage("reading");
    setChapterIndex(0);
  }

  function continueReading() {
    if (chapterIndex < chapters.length - 1) {
      setChapterIndex((current) => current + 1);
      return;
    }

    setStage("choice");
  }

  function replay() {
    setStage("cover");
    setChapterIndex(0);
    setChoice(null);
    setJoined(false);
  }

  return (
    <div className={`cof-experience cof-theme-${theme} ${fontClass}`}>
      <div className="cof-backdrop" aria-hidden="true">
        <img src={stage === "cover" ? "/a-court-of-foxes/assets/cover.png" : chapter.hero} alt="" />
      </div>

      <header className="cof-topbar">
        <a className="cof-home-link" href="/" aria-label="Return to Gaze Glass home">
          Gaze Glass
        </a>
        <div className="cof-topbar-title">
          <span>A Court of Foxes</span>
          <strong>{stage === "reading" ? chapter.label : stage === "choice" ? "The Fork" : stage === "ending" ? "The Ending" : "Chronicle"}</strong>
        </div>
        <div className="cof-topbar-actions" aria-label="Reader controls">
          <button type="button" onClick={() => setFontStep((value) => Math.max(0, value - 1))} aria-label="Decrease text size">
            A-
          </button>
          <button type="button" onClick={() => setFontStep((value) => Math.min(2, value + 1))} aria-label="Increase text size">
            A+
          </button>
          <button type="button" onClick={() => setTheme((value) => (value === "day" ? "night" : "day"))}>
            {theme === "day" ? "Night" : "Day"}
          </button>
        </div>
      </header>

      {stage === "cover" ? (
        <section className="cof-cover" aria-label="A Court of Foxes cover">
          <figure className="cof-cover-art">
            <img src="/a-court-of-foxes/assets/cover.png" alt="A Court of Foxes cover art with Jem, Marok, and Kitsu" />
          </figure>
          <div className="cof-cover-copy">
            <p className="cof-kicker">A Gaze Glass Chronicle</p>
            <h1>A Court of Foxes</h1>
            <p className="cof-tagline">Some tails are worth chasing.</p>
            <div className="cof-thread-ornament" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="cof-cover-text">
              Read inside a candlelit observatory where Beauty, War, and Justice braid into one dangerous night.
            </p>
            <div className="cof-cover-actions">
              <button className="cof-primary-action" type="button" onClick={begin}>
                Begin the chronicle
                <span aria-hidden="true">&rarr;</span>
              </button>
              <span>Gods Watch · Mortals Pray · Spirits Remember</span>
            </div>
          </div>
        </section>
      ) : null}

      {stage === "reading" ? (
        <section className="cof-reading-layout" aria-label={`${chapter.label}: ${chapter.title}`}>
          <aside className="cof-reading-rail" aria-label="Story progress">
            <figure
              className={`cof-rail-art ${beautySight ? "is-revealed" : ""}`}
              onPointerDown={() => chapterIndex === 0 && setBeautySight(true)}
              onPointerUp={() => setBeautySight(false)}
              onPointerLeave={() => setBeautySight(false)}
            >
              <img src={chapter.hero} alt={chapter.heroAlt} />
              {chapterIndex === 0 ? (
                <figcaption>
                  <span>Beauty-sight</span>
                  Hold the image to see beneath the glamour.
                </figcaption>
              ) : (
                <figcaption>{chapter.hook}</figcaption>
              )}
            </figure>
            <nav className="cof-chapter-list" aria-label="Reader chapters">
              {chapters.map((item, index) => (
                <button
                  className={index === chapterIndex ? "is-active" : ""}
                  key={item.number}
                  type="button"
                  onClick={() => setChapterIndex(index)}
                >
                  <span>{item.number}</span>
                  {item.title}
                </button>
              ))}
            </nav>
            <div className="cof-progress" aria-label={`Reader progress ${progress}%`}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="cof-choice-status">{choiceLabel(choice)}</p>
          </aside>

          <article className="cof-reader" ref={readerRef}>
            <div className="cof-reader-inner">
              <p className="cof-kicker">{chapter.number} / A Court of Foxes</p>
              <div className="cof-reader-heading">
                <h2>{chapter.title}</h2>
                <span>{chapter.readTime}</span>
              </div>
              <div className="cof-focus-prompt">
                <span>Hold this question</span>
                <p>{chapter.question}</p>
              </div>
              <div className="cof-prose">
                {chapter.body.map((paragraph, index) => (
                  <div key={`${chapter.number}-${paragraph.slice(0, 20)}-${index}`}>
                    <p className={paragraph.includes("Gods Watch") ? "cof-refrain" : ""}>{paragraph}</p>
                    {chapter.scene && chapter.scene.after === index ? (
                      <figure className="cof-inline-scene">
                        {chapter.scene.video ? (
                          <video muted autoPlay loop playsInline>
                            <source src={chapter.scene.src} type="video/mp4" />
                          </video>
                        ) : (
                          <img src={chapter.scene.src} alt={chapter.scene.alt} />
                        )}
                        <figcaption>{chapter.scene.caption}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                ))}
              </div>
              <footer className="cof-chapter-footer">
                <div>
                  <span>What changed</span>
                  <p>{chapter.summary}</p>
                </div>
                <p>{chapter.hook}</p>
                <button className="cof-primary-action" type="button" onClick={continueReading}>
                {chapterIndex < chapters.length - 1 ? `Continue to ${chapters[chapterIndex + 1].label}` : "Choose who crosses the dark"}
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </footer>
            </div>
          </article>
        </section>
      ) : null}

      {stage === "choice" ? (
        <section className="cof-choice-screen" aria-label="A Choice of Paths">
          <div className="cof-choice-copy">
            <p className="cof-kicker">The Fork / A Choice of Paths</p>
            <h2>The Scale has broken into two halves across the city.</h2>
            <p>
              You cannot carry both halves alone. One fox may cross the dark with you, or Jem may choose the dangerous third way.
            </p>
          </div>
          <figure className="cof-choice-art">
            <img src="/a-court-of-foxes/assets/trio.png" alt="Jem standing between Marok and Kitsu in a luminous celestial court" />
          </figure>
          <div className="cof-choice-options">
            <button className={choice === "marok" ? "is-selected" : ""} type="button" onClick={() => setChoice("marok")}>
              <span className="cof-dot cof-dot-green" />
              <strong>Go with Marok</strong>
              <em>War's fox. Spark, ruin, and dangerous sincerity.</em>
            </button>
            <button className={choice === "kitsu" ? "is-selected" : ""} type="button" onClick={() => setChoice("kitsu")}>
              <span className="cof-dot cof-dot-gold" />
              <strong>Go with Kitsu</strong>
              <em>Justice's fox. Restraint, truth, and a hand that stays.</em>
            </button>
            <button className={choice === "both" ? "is-selected" : ""} type="button" onClick={() => setChoice("both")}>
              <span className="cof-dot cof-dot-rose" />
              <strong>Choose both</strong>
              <em>The triune bond. No claiming. No hierarchy.</em>
            </button>
          </div>
          {choice ? (
            <div className="cof-choice-confirm">
              <p>{choiceConfirmation(choice)}</p>
              <button className="cof-primary-action" type="button" onClick={() => setStage("ending")}>
                Cross the dark
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {stage === "ending" ? (
        <section className="cof-ending-screen" aria-label="Ending reveal">
          <p className="cof-kicker">The Glass Remembers</p>
          <div className={`cof-ending-braid cof-ending-${choice ?? "kitsu"}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="cof-ending-label">The ending you wove</span>
          <h2>{ending.title}</h2>
          <p>{ending.body}</p>
          <strong>{ending.thread}</strong>
          <div className="cof-ending-actions">
            {joined ? (
              <p className="cof-joined">Your name is recorded. The glass keeps nothing it was not given.</p>
            ) : (
              <button type="button" onClick={() => setJoined(true)}>
                Record my name
              </button>
            )}
            <button type="button" onClick={replay}>
              Read again
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
