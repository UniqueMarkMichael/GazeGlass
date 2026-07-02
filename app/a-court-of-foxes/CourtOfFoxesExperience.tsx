"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stage = "cover" | "reading" | "choice" | "ending";
type Choice = "marok" | "kitsu" | "both";
type ReaderTheme = "day" | "night";
type FocusMode = "off" | "spotlight" | "band" | "ruler";
type ReadingPace = "drift" | "focus" | "sprint" | "rest";

type ResumeBookmark = {
  chapterIndex: number;
  paragraphIndex: number;
  updatedAt: number;
};

type ChapterScene = {
  after: number;
  src: string;
  alt: string;
  caption: string;
  video?: boolean;
};

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
  scene?: ChapterScene;
  scenes?: ChapterScene[];
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
  {
    number: "06",
    label: "Chapter Six",
    title: "Fortune Bleeds",
    readTime: "~12 min",
    question: "What does Justice become when control cracks?",
    hero: "/a-court-of-foxes/assets/ch6-tail-market-entrance.png",
    heroAlt: "Jem, Kitsu, and Marok at the hand-and-eye arch leading into the Tail Market",
    accent: "rose",
    summary:
      "Saroka's scarlet tail is recovered, restored through all three powers, and Fortune names the true trap.",
    hook:
      "Beauty. War. Justice. Not all foxes. Them.",
    scenes: [
      {
        after: 11,
        src: "/a-court-of-foxes/assets/ch6-tail-market.png",
        alt: "Jem, Marok, and Kitsu walking through the Tail Market among cages, masked vendors, and tail-shaped lanterns",
        caption: "The Tail Market was exactly as ugly as its perfume.",
      },
      {
        after: 12,
        src: "/a-court-of-foxes/assets/ch6-saroka-tail-cage.png",
        alt: "Jem held back by Marok and Kitsu before Saroka's scarlet tail burning in a glass cage guarded by a dice-masked vendor",
        caption: "Scarlet light. Ember edges. A curl like laughter with a knife behind it.",
      },
      {
        after: 16,
        src: "/a-court-of-foxes/assets/ch6-fortune-vision-strike.png",
        alt: "Jem struck by Saroka's scarlet tail as Fortune visions show Kitsu, Marok, and Jem in possible futures",
        caption: "Fortune split into every path at once and made each one bleed.",
      },
      {
        after: 18,
        src: "/a-court-of-foxes/assets/ch6-kitsu-law-whip.png",
        alt: "Kitsu casting gold law like a whip at the dice-masked vendor while Jem watches and Marok holds Saroka's scarlet tail",
        caption: "Gold law snapped across the alley like a whip made of verdicts.",
      },
      {
        after: 22,
        src: "/a-court-of-foxes/assets/ch6-restoration-ritual.png",
        alt: "Jem, Kitsu, and Marok performing the restoration ritual around Saroka's scarlet tail and a rainwater basin where Saroka's face appears",
        caption: "Fortune smelled like clove, copper, and the first breath before dice hit a table.",
      },
      {
        after: 31,
        src: "/a-court-of-foxes/assets/ch6-kitsu-first-kiss.png",
        alt: "Kitsu kissing Jem inside a gold ritual circle while Marok turns away with green fire at the shrine",
        caption: "Kitsu kissed me like a law breaking itself on purpose.",
      },
      {
        after: 37,
        src: "/a-court-of-foxes/assets/ch6-saroka-prophecy.png",
        alt: "Jem, Kitsu, and Marok beneath braided rose, green, and gold fox tails as Saroka's prophecy reveals Beauty, War, and Justice",
        caption: "Beauty. War. Justice.",
      },
    ],
    body: [
      "The mortal city had teeth, and Marok knew which alley taught them to bite.",
      "That should not have reassured me. It did not.",
      "We descended from the Mortal Hour chamber through the old stairway, past black stone veined with amber light and shadows that smelled faintly of cinnamon gone wrong.",
      "The Bell had stopped ringing, which felt less like mercy and more like a god taking a breath before saying something worse.",
      "My spine ached where my tail should have been. Humans were a draft species.",
      "Marok walked ahead, not with his usual swagger. There was a carefulness at the edges now, a glance into every mirror, every dark pane of glass.",
      "Kitsu walked behind me, close enough that I knew exactly where he was without looking. That also should not have reassured me. It did not. Mostly.",
      "The lower door opened without touch, and the city swallowed us a second time. Rain had begun, a cold mist that turned every lantern into a blurred little wound.",
      "An arch rose between two leaning buildings, hands painted across its stones, not fox paws, not mortal hands. Too many fingers. Each palm bore a small black eye.",
      "Beneath it hung a strip of red cloth, soaked dark by rain. I touched the red cloth. It was warm, and the rain slid off it as though the fabric remembered fire more clearly than weather.",
      "Something pulsed under my fingers, and a flicker of rose answered inside me, weak and wrong without my tail. The cloth parted.",
      "The Tail Market was exactly as ugly as its perfume. Lanterns swung overhead, each flame curled into the shape of a tiny tail, and iron cages lined both walls, stacked into shadow.",
      "Ahead, beneath a lantern shaped like a bleeding coin, Saroka's tail burned inside a narrow glass cage. Scarlet light. Ember edges. A curl like laughter with a knife behind it.",
      "The vendor guarding it was thin as a bad promise, in a mask made from cracked dice. Each die showed the same number on every side. One. One. One. No chance at all.",
      "The cage opened. Not by key. Not by mercy. It unfolded like a flower made of knives, and Saroka's tail shot out, straight into my chest.",
      "Pain bloomed scarlet. Not mine. Hers. Beauty pulled from the root; Fortune split into every path at once and made each one bleed.",
      "In one future, Kitsu died with gold fire in his mouth. In one, Marok burned green enough to light a city and did not survive the dawn. In one, I stood crowned in magenta flame while the Celestial Court burned behind me.",
      "Kitsu caught me before my skull met stone. Marok caught the scarlet tail with both hands. The market screamed, not the vendors, the market itself.",
      "Kitsu lifted one hand, and gold law snapped across the alley like a whip made of verdicts. The scent of cold parchment and struck bells shattered the violet stink.",
      "At an abandoned shrine between two warehouses, Marok set Saroka's tail on the altar as gently as if returning a sleeping child.",
      "Kitsu knelt by a cracked basin filled with rainwater. Gold light spread across it, turning every drop into a tiny bell.",
      "Saroka's face appeared in the water, awful and furious and alive. \"You look terrible,\" I said. \"Romantic of you,\" she whispered.",
      "Gold light rose around us in a thin, exact circle. Fortune smelled like clove, copper, and the first breath before dice hit a table.",
      "My sight opened. Under Saroka's scarlet tail, silver wire wound tight. There. Rot beneath the ornament.",
      "Green fire answered. Not the tavern flame that had grabbed the Scale to make me look. Narrower. Hotter. Honest enough to frighten him.",
      "The wire shrieked. Saroka screamed. I screamed too. Kitsu's hands closed over mine in the water, gold law pulled, and the braided thread snapped into being between my ribs: rose, green, gold.",
      "\"Jem,\" Kitsu said, voice low and rough. \"Look at me.\"",
      "There were a dozen ways to pretend I did not understand. Unfortunately, Beauty had made me excellent at seeing what hid beneath pretty things, and there was nothing hidden here.",
      "\"Then ask,\" I said.",
      "Kitsu's voice was barely sound. \"May I kiss you?\"",
      "It was a terrible moment for a first kiss. Naturally, it was ours.",
      "Kitsu kissed me like a law breaking itself on purpose. Soft first. Careful. Then not. Gold light surged through the shrine, clean and terrible.",
      "The silver wire snapped. In the basin, Saroka arched back with a scream that shook the shrine stones, and her tail tore itself back into being behind her like a banner dragged through war.",
      "For one breath, Saroka's eyes went black. Then red. Then full of stars.",
      "\"Three tails braided,\" she said, in a voice like coins falling into a well with no bottom. \"Rose. Green. Gold. Not bound by gods. Bound by witness.\"",
      "\"The trap is not for all foxes. All foxes are the curtain.\"",
      "\"Then who is it for?\" Kitsu asked.",
      "Her stare moved from him to Marok, then back to me. \"Beauty. War. Justice.\"",
      "Above us, the Judgment Bell rang once. Softly this time. Almost thoughtfully.",
      "Somewhere in that dark, my tail hung in a cage. Somewhere else, a Scale half sang from its grave.",
    ],
  },
  {
    number: "07",
    label: "Chapter Seven",
    title: "The Silvertail Story",
    readTime: "~13 min",
    question: "What does desire reveal when the gods refuse to witness themselves?",
    hero: "/a-court-of-foxes/assets/ch7-rain-city-walk.png",
    heroAlt: "Jem walking through the rain-slick mortal city between Kitsu and Marok under the distant Judgment Bell",
    accent: "gold",
    summary:
      "Veyr's history is named, the Menagerie is revealed, and the braid between Beauty, War, and Justice answers again.",
    hook:
      "The Scale sings where want is bought.",
    scenes: [
      {
        after: 30,
        src: "/a-court-of-foxes/assets/ch7-marok-coat-kitsu-warmth.png",
        alt: "Marok's dark green coat around Jem while Kitsu warms it with gold magic and rose, green, and gold light answer between them",
        caption: "Rose light answered in my chest. Green flickered from the coat. Gold settled over both.",
      },
    ],
    body: [
      "Rain made the city honest. Not clean. Never that.",
      "The mortal streets glistened under the storm, every cobblestone shining as if it had been polished by grief and poor decisions.",
      "Smoke sagged from chimneys. Gutters carried wilted flowers, spilled ale, and a thin ribbon of scarlet light that vanished when I looked directly at it.",
      "Saroka's restored thread, already gone from the shrine water. Or my imagination developing theatrical tendencies. Both seemed plausible.",
      "We left the abandoned shrine behind us, though its silver-painted fox stayed in my mind with its mouth sealed over the saint's lips.",
      "Rain slid cold beneath the collar of my gown. My feet ached. My ribs hurt. My mouth still remembered Kitsu's. Traitorous mouth.",
      "I touched my lower lip before I could stop myself. Kitsu noticed. Naturally. Marok noticed him noticing, more naturally.",
      "No one said anything, which was the worst possible choice, because silence had begun breeding in the space between us.",
      "The Judgment Bell hung somewhere above the clouds, quiet for now. That quiet did not comfort me. Quiet, in my experience, was what catastrophe did while choosing jewelry.",
      "Marok walked to my left, carrying guilt like it had weight. Kitsu walked to my right, carrying law like it had teeth.",
      "I walked between them because apparently the universe enjoyed arranging symbolism where my patience used to be.",
      "\"You are shaking,\" Kitsu said.",
      "\"I am expressing disapproval through temperature.\"",
      "\"You are cold.\"",
      "\"I dislike that word. It makes me sound manageable.\"",
      "Marok shrugged out of his coat before either of us could object. The motion was too quick, too practiced, too unlike a joke.",
      "\"No,\" I said.",
      "He held the coat out anyway. It was dark green, rain-soaked at the shoulders, warm from him underneath.",
      "War smelled like rain striking hot stone, smoke, and the sort of courage that was mostly panic with better posture.",
      "\"No debt,\" he said.",
      "Kitsu's gaze flicked to him. Marok's mouth tightened. \"No performance either.\"",
      "I took the coat. My fingers brushed his. Green light sparked once between our hands, faint and almost shy.",
      "Kitsu lifted one hand. \"May I?\"",
      "Gold light gathered there, thin and precise, smelling faintly of cold parchment and struck bells.",
      "\"For warmth?\" I asked.",
      "\"For stabilization.\"",
      "\"Charming.\"",
      "\"For warmth also,\" he admitted.",
      "Kitsu touched two fingers to the edge of Marok's coat where it rested near my throat. Not my skin. The coat. A choice I could step away from.",
      "Gold warmth spread through the wet fabric, subtle and careful. It did not burn. It held.",
      "Rose light answered in my chest. Green flickered from the coat. Gold settled over both. The braided thread appeared for one breath, too fine to touch and too real to dismiss.",
      "I looked straight ahead. \"If either of you makes that meaningful, I will walk into the river.\"",
      "We followed the wet street toward the old district, where the city seemed less built than accumulated.",
      "Houses leaned over the lanes, their upper stories nearly touching. Glass windows watched us with dark faces.",
      "\"There,\" Kitsu said.",
      "Ahead, at the end of a crooked lane, stood another shrine. Not the abandoned saint from before. This one had been made for the gods. Poor thing.",
      "Three steps led to a glass alcove where miniature thrones had once been arranged for travelers to leave offerings.",
      "Gods Watch. Mortals Pray. Spirits Remember.",
      "Someone had ruined it. Not with carelessness. With devotion.",
      "The glass over the shrine had been cracked from the inside. Each miniature throne had been overturned.",
      "Offerings lay smashed across the steps: coins split in half, wilted flowers, little carved foxes with their tails snapped off.",
      "On the back wall, painted in silver across every god's face, were words that made the rain go quiet in my ears.",
      "LET THE GODS WITNESS THEMSELVES.",
      "Marok exhaled through his teeth. \"Veyr.\"",
      "Kitsu's face changed. Not surprise. Recognition. Fear, perhaps, if Justice permitted it to enter by the servants' door.",
      "The name slid through me cold. \"The Silvertail.\"",
      "\"You know the story?\" Marok asked.",
      "\"I know a court story. Those are usually warnings wearing perfume.\"",
      "\"This one earned it,\" Kitsu said.",
      "I stepped under the shrine roof to escape the rain and immediately regretted touching dry ground.",
      "The air inside smelled of extinguished candles, old blood, and the sweet powder mortals use to hide decay from guests. Veyr's scent.",
      "Marok stayed at the threshold. \"Veyr was assistant to the God of Mercy.\"",
      "\"All gods had one once,\" Kitsu said. \"Before some domains were absorbed. Before Judgment became centralized.\"",
      "\"And then?\" I asked.",
      "Marok's voice lost its shine. \"Then came the Glasswater Judgment.\"",
      "A mortal city had petitioned the heavens to delay their verdict: plague, famine, civil war, witnesses contradicting one another until mercy itself begged for time.",
      "The Scale required a fox witness. Veyr pledged that the God of Mercy would hold the verdict long enough for the city to heal.",
      "\"What happened?\" I asked, although I could feel the shape of the answer in the air.",
      "Kitsu looked at the cracked glass. \"The pledge failed.\"",
      "Marok rubbed one hand over his face. \"The city drowned in its own river during commencement. The God of Mercy screamed herself voiceless. Veyr's tail turned silver overnight. Then he vanished.\"",
      "\"Vanished,\" I repeated.",
      "\"Exiled,\" Kitsu said. \"Unofficially.\"",
      "Ah. One of those words the divine loved so much. Unofficial. Regrettable. Necessary. Translation: someone suffered and no one wanted fingerprints.",
      "\"And now he steals fox tails and breaks the Scale,\" I said.",
      "\"He believes no foxes means no Judgment,\" Kitsu said.",
      "Marok stared at the silver sentence. \"He believes if the gods have no witnesses, they will finally have to watch themselves.\"",
      "Villain, then. Warning, also. How inconvenient. I hated when monsters had reasons. It made the knife messy.",
      "A shard of mirror lay among the broken offerings. In it, my face appeared pale and rain-damp. Marok's coat around my shoulders. Kitsu's gold warmth at my throat.",
      "Behind me, Veyr appeared. Not fully. Never fully. Silver tail. Pale eyes. A smile like a door opening under water.",
      "I did not turn. Finally, I was learning.",
      "\"What do you want?\" I asked the mirror.",
      "Silver light crawled across the mirror's surface, writing itself one letter at a time.",
      "THE SCALE SINGS WHERE WANT IS BOUGHT.",
      "The mirror cracked exactly down the center, splitting my reflection into two almost-Jems who both looked unimpressed and terrified.",
      "\"Where want is bought,\" Marok said.",
      "Kitsu stood. \"A pleasure house.\"",
      "\"The Velvet Menagerie,\" Marok said, voice tight.",
      "\"You know it,\" Kitsu said.",
      "\"I know of it.\"",
      "\"That distinction is becoming very tiresome.\"",
      "Marok's jaw moved once. \"It is not a brothel. Not only. It's a house of reflected desire. Mortals go there to see what they want. Spirits go there to sell the admission back.\"",
      "\"That sounds horrifying,\" I said.",
      "Marok looked at me. \"It is popular.\"",
      "\"Those are rarely opposites.\"",
      "Kitsu's gaze cut to the broken shrine. \"If a Scale half is there, Veyr placed it deliberately.\"",
      "\"To tempt us?\" Marok asked.",
      "\"To measure us.\"",
      "I laughed once. It was not pretty. \"Excellent. I was hoping the night would develop opinions about my private humiliations.\"",
      "Kitsu looked at me. \"You are exhausted.\"",
      "\"I am radiant.\"",
      "\"You are bleeding again.\"",
      "I touched my lip. Red. Again. Truly, this body was committed to drama.",
      "Kitsu stepped in front of me. Slowly. A choice I could refuse by moving away. He lifted a hand, stopped halfway, and waited.",
      "Consent had become the strangest ritual of the night. More sacred than the court. More honest than the gods.",
      "\"Yes,\" I said, annoyed by how softly the word came.",
      "Kitsu touched his thumb beneath my lower lip. A brief touch. Barely there. Gold warmth closed over the split skin.",
      "His eyes flicked to my mouth. Then away. Too quickly. Of course.",
      "\"There,\" he said.",
      "\"Fixed?\"",
      "\"Closed.\"",
      "\"That is not the same.\"",
      "\"No,\" he said. \"It is not.\"",
      "Marok looked at the ruined thrones as if giving us privacy by choosing the ugliest possible object to admire. \"Veyr wants us emotionally compromised before the Menagerie.\"",
      "\"Late,\" I said.",
      "Marok's gaze returned. His smile was small, tired, and too sincere for my comfort. \"Yes.\"",
      "The Judgment Bell rang once above the city. Soft. Almost amused.",
      "Silver paint slid down the shrine wall in thin threads, pooling around the broken wooden foxes.",
      "Beneath the offerings waited a strip of black velvet tied around a tiny gold key.",
      "The key was warm, and the velvet smelled of honey, smoke, and regret beneath the violets. Etched along its side was a fox tail curled into a question mark.",
      "\"The Velvet Menagerie,\" Marok said.",
      "Kitsu's face hardened. \"We cannot avoid it.\"",
      "\"No,\" I said, wrapping the key in the velvet and slipping it into Marok's coat pocket because apparently I owned the pocket now. \"But we can avoid being stupid about it.\"",
      "I stood too fast. The shrine tilted. My knees filed a brief objection.",
      "Marok caught my elbow. Kitsu caught the coat on my back. Both at once. Neither tightened. Neither claimed.",
      "Rose light sparked under my skin. Green answered from Marok's hand. Gold from Kitsu's. For one breath, the braid wound through us, fragile and stubborn as a thread pulled through a needle in the dark.",
      "Rain hammered the roof. The silver words watched us. Somewhere in the city, a pleasure house waited to show us the shape of wanting.",
      "I had spent eternity being arranged by Beauty. I had spent one night learning that desire could open like a trap.",
      "Now I stood between War and Justice, wearing War's coat warmed by Justice's hand, and tried very hard not to think about how safe that felt.",
      "\"Lead,\" Kitsu said to Marok.",
      "Marok looked at me first. Not for permission, exactly. For witness. That was worse. Better. Both. I nodded once.",
      "Marok stepped back into the rain. \"The Menagerie is three streets west and one bad decision down.\"",
      "\"Only one?\" I asked.",
      "He glanced over his shoulder. \"I am trying to be optimistic.\"",
      "Kitsu passed beneath the ruined refrain without looking up.",
      "Gods Watch. Mortals Pray. Spirits Remember.",
      "Behind us, the defaced shrine dripped silver into the gutter. Ahead, the city opened its wet mouth and waited.",
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

const readerPrefsKey = "cof-reader-prefs-v2";
const readerBookmarkKey = "cof-reader-bookmark-v2";

const pacePresets: Record<ReadingPace, { focusMode: FocusMode; fontStep: number }> = {
  drift: { focusMode: "off", fontStep: 1 },
  focus: { focusMode: "ruler", fontStep: 1 },
  sprint: { focusMode: "band", fontStep: 0 },
  rest: { focusMode: "spotlight", fontStep: 2 },
};

function focusLabel(mode: FocusMode) {
  if (mode === "spotlight") return "Lantern";
  if (mode === "band") return "Band";
  if (mode === "ruler") return "Ruler";
  return "Focus";
}

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
  const [pace, setPaceState] = useState<ReadingPace>("focus");
  const [focusMode, setFocusMode] = useState<FocusMode>("ruler");
  const [showImages, setShowImages] = useState(true);
  const [readWithMe, setReadWithMe] = useState(false);
  const [readWithMeIndex, setReadWithMeIndex] = useState(0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(0);
  const [resumeBookmark, setResumeBookmark] = useState<ResumeBookmark | null>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [beautySight, setBeautySight] = useState(false);
  const [joined, setJoined] = useState(false);
  const readerRef = useRef<HTMLDivElement | null>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const pendingResumeRef = useRef<ResumeBookmark | null>(null);

  const chapter = chapters[chapterIndex];
  const ending = endingCopy[choice ?? "kitsu"];
  const progress = stage === "cover" ? 0 : stage === "ending" ? 100 : Math.round(((chapterIndex + 1) / chapters.length) * 82);

  const fontClass = useMemo(() => `cof-font-${fontStep}`, [fontStep]);
  const supportStatus = `${focusLabel(focusMode)} ${Math.min(activeParagraphIndex + 1, chapter.body.length)}/${chapter.body.length}`;

  useEffect(() => {
    const pending = pendingResumeRef.current;
    if (pending && pending.chapterIndex === chapterIndex && stage === "reading") {
      pendingResumeRef.current = null;
      window.setTimeout(() => scrollParagraphIntoView(pending.paragraphIndex, "auto"), 40);
      return;
    }

    readerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setActiveParagraphIndex(0);
    setReadWithMeIndex(0);
  }, [chapterIndex, stage]);

  useEffect(() => {
    try {
      const rawPrefs = window.localStorage.getItem(readerPrefsKey);
      if (rawPrefs) {
        const prefs = JSON.parse(rawPrefs) as Partial<{
          theme: ReaderTheme;
          fontStep: number;
          pace: ReadingPace;
          focusMode: FocusMode;
          showImages: boolean;
        }>;
        if (prefs.theme === "day" || prefs.theme === "night") setTheme(prefs.theme);
        if (Number.isFinite(prefs.fontStep)) setFontStep(Math.max(0, Math.min(2, Number(prefs.fontStep))));
        if (prefs.pace && prefs.pace in pacePresets) setPaceState(prefs.pace);
        if (prefs.focusMode && ["off", "spotlight", "band", "ruler"].includes(prefs.focusMode)) {
          setFocusMode(prefs.focusMode);
        }
        if (typeof prefs.showImages === "boolean") setShowImages(prefs.showImages);
      }

      const rawBookmark = window.localStorage.getItem(readerBookmarkKey);
      if (rawBookmark) {
        const bookmark = JSON.parse(rawBookmark) as Partial<ResumeBookmark>;
        if (
          Number.isFinite(bookmark.chapterIndex) &&
          Number.isFinite(bookmark.paragraphIndex) &&
          Number(bookmark.chapterIndex) >= 0 &&
          Number(bookmark.chapterIndex) < chapters.length
        ) {
          setResumeBookmark({
            chapterIndex: Number(bookmark.chapterIndex),
            paragraphIndex: Math.max(0, Number(bookmark.paragraphIndex)),
            updatedAt: Number(bookmark.updatedAt) || Date.now(),
          });
        }
      }
    } catch {
      // Reader support is additive; storage failures should never block the story.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        readerPrefsKey,
        JSON.stringify({ theme, fontStep, pace, focusMode, showImages }),
      );
    } catch {}
  }, [theme, fontStep, pace, focusMode, showImages]);

  useEffect(() => {
    if (stage !== "reading") return;
    const bookmark: ResumeBookmark = {
      chapterIndex,
      paragraphIndex: activeParagraphIndex,
      updatedAt: Date.now(),
    };
    setResumeBookmark(bookmark);
    try {
      window.localStorage.setItem(readerBookmarkKey, JSON.stringify(bookmark));
    } catch {}
  }, [activeParagraphIndex, chapterIndex, stage]);

  function begin() {
    setStage("reading");
    setChapterIndex(0);
    setActiveParagraphIndex(0);
    setReadWithMeIndex(0);
  }

  function resumeReading() {
    if (!resumeBookmark) {
      begin();
      return;
    }

    pendingResumeRef.current = resumeBookmark;
    setReadWithMe(false);
    setChapterIndex(resumeBookmark.chapterIndex);
    setActiveParagraphIndex(resumeBookmark.paragraphIndex);
    setReadWithMeIndex(resumeBookmark.paragraphIndex);
    setStage("reading");
  }

  function continueReading() {
    if (chapterIndex < chapters.length - 1) {
      setChapterIndex((current) => current + 1);
      setActiveParagraphIndex(0);
      setReadWithMeIndex(0);
      return;
    }

    setStage("choice");
  }

  function setPace(value: ReadingPace) {
    const preset = pacePresets[value];
    setPaceState(value);
    setFocusMode(preset.focusMode);
    setFontStep(preset.fontStep);
  }

  function toggleFocus(value: FocusMode) {
    setFocusMode((current) => (current === value ? "off" : value));
  }

  function toggleReadWithMe() {
    setReadWithMe((current) => {
      const next = !current;
      if (next) {
        setReadWithMeIndex(activeParagraphIndex);
        window.setTimeout(() => scrollParagraphIntoView(activeParagraphIndex), 20);
      }
      return next;
    });
  }

  function readNext() {
    const nextIndex = Math.min(chapter.body.length - 1, readWithMeIndex + 1);
    setReadWithMeIndex(nextIndex);
    setActiveParagraphIndex(nextIndex);
    window.setTimeout(() => scrollParagraphIntoView(nextIndex), 20);
  }

  function scrollParagraphIntoView(index: number, behavior: ScrollBehavior = "smooth") {
    const paragraph = paragraphRefs.current[Math.max(0, Math.min(index, chapter.body.length - 1))];
    paragraph?.scrollIntoView({ block: "center", behavior });
    paragraph?.focus({ preventScroll: true });
  }

  function findPlace() {
    scrollParagraphIntoView(activeParagraphIndex);
  }

  function updateActiveParagraph() {
    const reader = readerRef.current;
    if (!reader) return;
    const readerRect = reader.getBoundingClientRect();
    const anchorY = readerRect.top + Math.min(readerRect.height * 0.42, 280);
    let nearest = activeParagraphIndex;
    let nearestDistance = Number.POSITIVE_INFINITY;

    paragraphRefs.current.forEach((paragraph, index) => {
      if (!paragraph || (readWithMe && index > readWithMeIndex)) return;
      const rect = paragraph.getBoundingClientRect();
      if (rect.bottom < readerRect.top + 20 || rect.top > readerRect.bottom - 20) return;
      const paragraphAnchor = rect.top + Math.min(rect.height * 0.35, 72);
      const distance = Math.abs(paragraphAnchor - anchorY);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });

    if (nearest !== activeParagraphIndex) setActiveParagraphIndex(nearest);
  }

  function replay() {
    setStage("cover");
    setChapterIndex(0);
    setChoice(null);
    setJoined(false);
    setReadWithMe(false);
    setActiveParagraphIndex(0);
    setReadWithMeIndex(0);
  }

  return (
    <div className={`cof-experience cof-theme-${theme} ${fontClass}`} data-pace={pace}>
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
              {resumeBookmark ? (
                <button className="cof-secondary-action" type="button" onClick={resumeReading}>
                  Return to {chapters[resumeBookmark.chapterIndex]?.label ?? "your mark"}
                </button>
              ) : null}
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

          <article
            className="cof-reader"
            data-focus-mode={focusMode}
            data-images={showImages ? "shown" : "hidden"}
            data-read-with-me={readWithMe ? "on" : "off"}
            onScroll={updateActiveParagraph}
            ref={readerRef}
          >
            <div className="cof-reader-inner">
              <div className="cof-support-dock" aria-label="ADHD reader supports">
                <div className="cof-pace-strip" role="radiogroup" aria-label="Story pace mode">
                  {(["drift", "focus", "sprint", "rest"] as ReadingPace[]).map((item) => (
                    <button
                      aria-checked={pace === item}
                      className="cof-pace-button"
                      data-active={pace === item}
                      key={item}
                      onClick={() => setPace(item)}
                      role="radio"
                      type="button"
                    >
                      {item === "focus" ? "Focus" : item}
                    </button>
                  ))}
                </div>
                <div className="cof-support-row">
                  <button
                    aria-label="Lantern paragraph focus"
                    aria-pressed={focusMode === "spotlight"}
                    className="cof-support-button"
                    data-active={focusMode === "spotlight"}
                    onClick={() => toggleFocus("spotlight")}
                    title="Lantern"
                    type="button"
                  >
                    ◐
                  </button>
                  <button
                    aria-label="Reading band focus"
                    aria-pressed={focusMode === "band"}
                    className="cof-support-button"
                    data-active={focusMode === "band"}
                    onClick={() => toggleFocus("band")}
                    title="Band"
                    type="button"
                  >
                    ≋
                  </button>
                  <button
                    aria-label="Reading ruler focus"
                    aria-pressed={focusMode === "ruler"}
                    className="cof-support-button"
                    data-active={focusMode === "ruler"}
                    onClick={() => toggleFocus("ruler")}
                    title="Ruler"
                    type="button"
                  >
                    ▔
                  </button>
                  <button
                    aria-label="Read With Me"
                    aria-pressed={readWithMe}
                    className="cof-support-button"
                    data-active={readWithMe}
                    onClick={toggleReadWithMe}
                    title="Read With Me"
                    type="button"
                  >
                    ¶
                  </button>
                  <button
                    aria-label="Show or hide story images"
                    aria-pressed={!showImages}
                    className="cof-support-button"
                    data-active={!showImages}
                    onClick={() => setShowImages((value) => !value)}
                    title="Images"
                    type="button"
                  >
                    ▧
                  </button>
                  <button className="cof-support-button" type="button" onClick={findPlace} aria-label="Find my place" title="Lost">
                    ⌖
                  </button>
                  {readWithMe ? (
                    <button className="cof-next-button" type="button" onClick={readNext} aria-label="Show the next paragraph">
                      Next
                    </button>
                  ) : null}
                  <span className="cof-support-status">{supportStatus}</span>
                </div>
              </div>
              <p className="cof-title-block">
                A COURT OF FOXES <span aria-hidden="true">→</span> {chapter.label}: {chapter.title}
              </p>
              <div className="cof-reader-heading">
                <h2>{chapter.title}</h2>
                <span>{chapter.readTime}</span>
              </div>
              <div className="cof-focus-prompt">
                <span>Hold this question</span>
                <p>{chapter.question}</p>
              </div>
              <div className="cof-prose">
                {chapter.body.map((paragraph, index) => {
                  const hidden = readWithMe && index > readWithMeIndex;
                  const active = index === activeParagraphIndex && !hidden;
                  const blockClassName = [
                    "cof-prose-block",
                    hidden ? "cof-read-hidden" : "",
                    active && focusMode === "ruler" ? "cof-is-ruler" : "",
                    active && focusMode !== "off" && focusMode !== "ruler" ? "cof-is-lit" : "",
                    !active && !hidden && (focusMode === "spotlight" || focusMode === "band") ? "cof-is-dim" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const scenes = [...(chapter.scene ? [chapter.scene] : []), ...(chapter.scenes ?? [])].filter(
                    (scene) => scene.after === index,
                  );

                  return (
                    <div
                      aria-hidden={hidden}
                      className={blockClassName}
                      key={`${chapter.number}-${paragraph.slice(0, 20)}-${index}`}
                    >
                      <p
                        className={paragraph.includes("Gods Watch") ? "cof-refrain" : ""}
                        ref={(node) => {
                          paragraphRefs.current[index] = node;
                        }}
                        tabIndex={-1}
                      >
                        {paragraph}
                      </p>
                      {showImages
                        ? scenes.map((scene) => (
                            <figure className="cof-inline-scene" key={scene.src}>
                              {scene.video ? (
                                <video muted autoPlay loop playsInline>
                                  <source src={scene.src} type="video/mp4" />
                                </video>
                              ) : (
                                <img src={scene.src} alt={scene.alt} />
                              )}
                              <figcaption>{scene.caption}</figcaption>
                            </figure>
                          ))
                        : null}
                    </div>
                  );
                })}
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
