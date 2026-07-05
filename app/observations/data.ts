export type ObservationRegion = "gods" | "spirits" | "mortals";
export type ObservationMagnitude = "observation" | "story" | "novella" | "novel";
export type GodId = "wisdom" | "justice" | "love" | "fortune" | "war";
export type SpiritId = "kitsu" | "saroka" | "marok";

export type DiscoveryThreadItem = {
  kind: "observation" | "god" | "spirit" | "law";
  label: string;
  title: string;
  href: string;
  description: string;
};

export type DiscoveryThread = {
  promise: string;
  items: DiscoveryThreadItem[];
};

export type ObservationStoryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  afterParagraph: number;
  wide?: boolean;
};

export type Observation = {
  number: string;
  title: string;
  slug: string;
  canonicalPath?: string;
  godId: GodId;
  spiritWitnessIds: SpiritId[];
  themeTags: string[];
  startHere?: boolean;
  description: string;
  region: ObservationRegion;
  regionLabel: string;
  association: string;
  magnitude: ObservationMagnitude;
  magnitudeLabel: string;
  readingTimeMin: number;
  dateObserved: string;
  image?: string;
  imageAlt?: string;
  storyImages?: ObservationStoryImage[];
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  story: string[];
  related: string[];
};

export const regionMeta: Record<ObservationRegion, {
  title: string;
  instrument: string;
  subtitle: string;
  description: string;
}> = {
  gods: {
    title: "Gods",
    instrument: "The Orb",
    subtitle: "The scale of the divine.",
    description:
      "Stories connected to prophecy, judgment, cosmic pressure, and the forces that move before mortals know they have been moved.",
  },
  spirits: {
    title: "Spirits",
    instrument: "The Stained Glass",
    subtitle: "Memory turned into light.",
    description:
      "Stories of fox spirits, sacred companions, devotion, guardianship, and the presences that stand near power without becoming power.",
  },
  mortals: {
    title: "The Mortals",
    instrument: "The Mirror",
    subtitle: "Choice made visible.",
    description:
      "Stories of prayer, identity, longing, fear, courage, and the exact human moment when a life turns toward consequence.",
  },
};

export const magnitudeMeta: Record<ObservationMagnitude, {
  label: string;
  symbol: string;
  description: string;
  weight: number;
}> = {
  observation: {
    label: "Observation",
    symbol: "Small star",
    description: "A brief flash of fate.",
    weight: 1,
  },
  story: {
    label: "Character Story",
    symbol: "Bright star",
    description: "A focused account of a god, spirit, or mortal.",
    weight: 2,
  },
  novella: {
    label: "Novella",
    symbol: "Record cluster",
    description: "A connected cluster of records.",
    weight: 3,
  },
  novel: {
    label: "Novel",
    symbol: "Celestial body",
    description: "A major body in the sky.",
    weight: 4,
  },
};

export const observations: Observation[] = [
  {
    number: "001",
    title: "Patricia, Awakened by Wisdom",
    slug: "patricia",
    godId: "wisdom",
    spiritWitnessIds: [],
    themeTags: ["meaning", "awakening", "identity", "judgment"],
    description:
      "A former financier abandons wealth to seek enlightenment on a city street and learns there was never a wall between herself and the world.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of Wisdom",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readingTimeMin: 7,
    dateObserved: "2026-06-13",
    image: "/mortals/patricia/wisdom-appears.png",
    imageAlt:
      "Patricia seated on a city street as the indigo God of Wisdom appears above her in gold celestial light",
    storyImages: [
      {
        id: "office-writing",
        src: "/mortals/patricia/office-writing.png",
        alt: "Patricia writing at a desk in a high office overlooking the city at night",
        caption: "Before the street, Patricia had a corner office and a question wealth could not answer.",
        afterParagraph: 3,
      },
      {
        id: "wisdom-city",
        src: "/mortals/patricia/wisdom-city.png",
        alt: "Patricia in a dark office holding a crystal before the city skyline",
        caption: "The towers kept their glitter, but the meaning underneath them had gone quiet.",
        afterParagraph: 4,
        wide: true,
      },
      {
        id: "office-crystal",
        src: "/mortals/patricia/office-crystal.png",
        alt: "Patricia meditating on a city sidewalk while commuters pass by",
        caption: "She sat beneath the same towers, waiting for the wall inside her to open.",
        afterParagraph: 6,
      },
      {
        id: "judgment-vision",
        src: "/mortals/patricia/judgment-vision.png",
        alt: "The indigo God of Wisdom towering above Patricia in a city street",
        caption: "Wisdom arrived not to answer the question, but to dissolve it.",
        afterParagraph: 8,
      },
      {
        id: "street-meditation",
        src: "/mortals/patricia/street-meditation.png",
        alt: "Patricia meditating beneath a cosmic vision of Wisdom weighing humanity",
        caption: "For one breath, the world was no longer outside her.",
        afterParagraph: 15,
      },
      {
        id: "patricia-walking",
        src: "/mortals/patricia/patricia-walking.png",
        alt: "Patricia surrounded by golden star patterns as Wisdom watches over the city",
        caption: "The going was already folded into the seeing.",
        afterParagraph: 19,
      },
      {
        id: "wisdom-appears",
        src: "/mortals/patricia/wisdom-appears.png",
        alt: "Patricia walking through a luminous city after Wisdom's appearance",
        caption: "She rose with nothing left between herself and everything.",
        afterParagraph: 22,
      },
    ],
    seoTitle: "Patricia, Awakened by Wisdom",
    seoDescription:
      "Patricia, Awakened by Wisdom is a Gaze Glass Observation about a former financier, the God of Wisdom, enlightenment, and the coming Judgment tied to Rashid Shah.",
    excerpt:
      "A former financier abandons wealth to seek enlightenment on a city street. When the God of Wisdom arrives, Patricia learns that meaning is not found by escaping life, but by seeing there was never a wall between herself and the world.",
    story: [
      "On a street where business tycoons came to be seen, a woman with skin as brown as maple bark sat so still she almost felt free. The city had stopped seeing her. She had been there since before dawn, cross-legged on a flattened square of cardboard, palms loose in her lap, a paper cup beside her knee that she had never once held up. Commuters dropped coins into it on their way to the towers.",
      "She did not thank them and she did not refuse them; she let the coins fall the way rain falls into a cup that hadn’t asked for a fortune. Executives thought she was homeless. They were wrong, but she would not correct them. She had owned a home once, and a name on a glass door, and she had given both away on purpose.",
      "Her name was Patricia, and not long ago she had counted other people’s fortunes for a living. She had been good at it, frighteningly good, the kind of good that buys a corner office before forty and a view of the same towers she now sat beneath.",
      "For years she had moved money the way the tide moves seaweed in and out from the shore. Patricia told herself the numbers meant something. Then, one ordinary Tuesday she looked at a column of awards on the wall and understood that she could not say what any of it was for.",
      "The question opened under her like a trapdoor. It did not close again. So, she sold the apartment. She sold the watch, the car, the suits, and the art she had bought to prove she was a person who bought art. She gave the money to people who needed it more than her questions did, and when there was nothing left to sell she sat down on the street to learn what was underneath a life once you had taken the life away.",
      "That had been many months ago. She was not unwell, and she was not broken, not drowning, not seeking the end of anything. She hungered in the one place food cannot reach. Patricia placed her palm over her heart and exhaled, shivering. She had read the oldest books on meditation, renunciation, and enlightenment. The ascetic mortal folded her legs and watched her breath go out and come back ten thousand times, waiting for enlightenment. It had not. Some mornings she felt close, the way you feel a word on the tip of your tongue. But the word never came, and lately a colder thought had begun to sit beside her on the cardboard: that perhaps there was no enlightenment. That meaning was a story the comfortable told themselves, and she had simply stopped being comfortable enough to believe it.",
      "It was in the middle of that thought, on the eighth morning of her doubting, that the street went quiet. Not the ordinary quiet of an early hour. The traffic did not stop so much as recede; the way sound recedes when you slip under water. And when Patricia opened her eyes, the towers were still there, and the cup was still there, and standing between them was something the eye refused to hold.",
      "It was vast and it was near, both at once. Its skin was the indigo of the sky an hour after the last light, and across it turned slow rivers of stars, as though the night had been poured into the shape of a person and had not yet finished settling. Its skull was long, drawn upward like a held note. Where its eyes should have been there wheeled two galaxies, patient, unhurried, and they were looking at her, not down at her, the way the coin-droppers looked, but endlessly into her, the way you look into a window you had mistaken for a wall. But she was not afraid. That surprised her later, when there was a later. In the presence of the cosmic being, fear seemed like one more possession she had once owned and given away.",
      "“You have been asking the wrong question,” a voice boomed. The cosmic being’s voice was not loud. It arrived already inside her, the way her own thoughts did. “You ask what your life is for as though it were a tool set down by someone who left the room.”",
      "“Isn’t it?” she asked. Her own voice sounded small, and very far off.",
      "“No. I would know,” the voice said. “For I am the God of Wisdom. Watch, mortal.”",
      "And the god did not explain. It did the older, harder thing: It took away the wall.",
      "Patricia felt the edge of herself, the invisible line that had always run between Patricia and everything else, thin like ice in a thaw, and then give. She remained on the cardboard, but she was also the man who had stepped over her at sunrise, hurrying, his chest tight with a fear he had not named. Then, she was the child three blocks east, asleep, dreaming of a dog she did not have.",
      "The God of Wisdom’s laughter echoed off her mind’s walls as she saw the world through the green eyes of the woman in the highest office of the tallest tower, signing the figures Patricia had once signed, asking the same trapdoor question and not yet falling.",
      "A strong breeze smothered her face until she was the pigeon soaring above, on the hunt. There was no seam anywhere. There had never been a seam from what she could remember. The suffering she had fled in the towers and the suffering she had found on the street were not two things. They were one weather, moving through one body, and the body was hers, and it was everyone’s, and it was no one’s at all. This was the thing the books had pointed at and could not say, not that her life had a purpose, but that she had never been separate from it. Purpose was not a possession you went out and found. It was a fabric you discovered you had been woven into the whole time, while you searched the floor for a single thread.",
      "She wept, and the weeping was the towers and the child and the ocean weeping, which is to say it was the most ordinary thing in the world. And because she was, in that moment, the whole, she saw what the whole was carrying.",
      "Far up, past the wheeling galaxies of the god’s regard, something was gathering, a weighing, vast and near like the god itself, leaning toward her world the way a wave leans before it crashes and becomes frothy sea foam. She understood, without being told, that a Judgment upon humanity was on the horizon and that it had been decided by a soul who loved humanity too much to let it go, that mortals must take a stand.",
      "She felt him. The one soul among the billions who had been handed a part to play in the ending and had said, simply, no, who stood against the whole machinery of it, not out of pride, but out of some stubborn, unbearable love. She did not know his face. She knew his name the way she now knew her own, which is to say, the way she knew everyone else’s. Rashid Shah. It was not a command. The God of Wisdom did not tell her to go to him. The going was already there, folded into the seeing. She belonged to the whole now, and the whole was bending toward that single refusing point, and so was she. The galaxies dimmed. The traffic surfaced. The towers went back to hiring and firing hopeful souls.",
      "A man dropped a coin into the cup, and this time Patricia opened her eyes and looked at him, and he flinched, because no one had warned him that the woman on the corner had come to hold the patient regard of something very large, and very kind.",
      "She uncrossed her legs. Then, she left the cup, and the coins in it, for whoever needed them more than she did, which was now, she understood, the same as helping herself. She rose, in no hurry, a woman who looked like she had nothing and had instead lost the last thing standing between her and everything.",
      "Patricia, who had gone looking for the meaning of life and found there had never been a wall around her to keep it out, set off into the city to find the one who had refused.",
      "“Everyone is me,” she whispered, tears spilling down her cheeks. “There are no others.”",
      "The glass keeps every life that passes through it. The Seer records. And the God of Wisdom, who does not answer questions so much as dissolve them, turned its galaxies toward the next sleeper at the edge of waking and waited with a calming smile as Patricia set out to find Rashid Shah.",
    ],
    related: ["marcella", "malika"],
  },
  {
    number: "002",
    title: "Marcella, Blessed by Justice",
    slug: "marcella",
    godId: "justice",
    spiritWitnessIds: ["kitsu"],
    themeTags: ["credit", "work", "injustice", "voice"],
    startHere: true,
    description:
      "A creative worker asks to be witnessed after her labor is stolen and renamed, and the God of Justice makes the truth impossible to misattribute.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of Justice",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readingTimeMin: 4,
    dateObserved: "2026-06-24",
    image: "/mortals/marcella/portrait.webp",
    imageAlt: "Marcella reflected in a sacred golden mirror after being witnessed by Justice",
    seoTitle: "Marcella, Blessed by Justice",
    seoDescription:
      "Marcella, Blessed by Justice is a Gaze Glass Observation about stolen credit, unseen creative labor, restored authorship, and the blessing of being witnessed.",
    excerpt:
      "Marcella kept the work moving while others learned to expect her generosity. When her labor was taken and renamed, she did not ask for spectacle. She asked to be witnessed.",
    story: [
      "Marcella knew how to make a room feel calmer without anyone noticing she had done it. She caught the missing details before they became emergencies. She softened the sentence that would have made a client pull away. She carried unfinished ideas across the threshold and handed them back polished enough for someone else to call them obvious.",
      "At first, she mistook this for belonging. The team praised her generosity. They called her collaborative, dependable, gracious under pressure. No one called her the source.",
      "The work gathered around her anyway. A campaign that had been failing began to breathe after Marcella rewrote its spine. A presentation that had collapsed into noise became clear because she named the actual story under the slides. By the end, everyone could feel the idea working. By the meeting after that, everyone had forgotten who made it work.",
      "Her manager presented the campaign beneath another name. The room clapped. Marcella sat beneath fluorescent light with her hands folded in her lap and felt something inside her go very still.",
      "It was not only anger. Anger would have been easier. It was the old wound of watching truth become furniture in someone else's house. Her labor had not disappeared. It had been moved, relabeled, and placed where power could admire itself.",
      "In the hallway, away from the voices and the congratulation, Marcella pressed her palm to the wall. She did not ask to be rescued. She did not ask for revenge. She asked the question her mortal voice could barely carry: let someone see what happened here.",
      "The glass opened without sound.",
      "Gold entered the hallway first, a thin judicial light passing over the carpet, the door handles, the coffee stains, the printed agenda still warm from the machine. Then the God of Justice looked through.",
      "Justice did not rage. Justice did not comfort her with softness that would leave the structure intact. The god regarded Marcella with a level gaze, and in that gaze every hidden hour became evidence. Every revision. Every quiet save. Every sentence carried out of panic and into shape.",
      "The blessing was not thunder. It was accuracy. In the next meeting, the file history opened at the wrong time and told the truth. The phrasing no one remembered drafting returned to its author. The strategy map, the late-night notes, the source documents, the timestamps, the messages where Marcella had explained the whole thing before anyone else understood it: all of it rose like testimony.",
      "No one was destroyed. That was the part Marcella remembered later. Justice did not need spectacle to be complete. It returned the credit to its proper name, then waited to see what Marcella would do with power once it had finally found her.",
      "She spoke plainly. She accepted the correction without apology. She named the work and the people who had helped without becoming the kind of person who steals light because light had once been stolen from her.",
      "The recognition came later, but the blessing had already arrived. It was in the way the room looked at her and could no longer misfile what it saw. It was in the way Marcella learned that being witnessed is not vanity. Sometimes it is survival.",
      "The Seer records the case under Justice because the verdict did not make Marcella louder. It made her impossible to erase.",
    ],
    related: ["patricia", "walter"],
  },
  {
    number: "003",
    title: "Malika, Blessed by Love",
    slug: "malika",
    godId: "love",
    spiritWitnessIds: [],
    themeTags: ["love", "control", "beauty", "self-return"],
    description:
      "A future cosmetologist asks the God of Love for help after control is disguised as devotion, and the blessing returns her to herself first.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of Love",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readingTimeMin: 4,
    dateObserved: "2026-06-24",
    image: "/mortals/malika/portrait.png",
    imageAlt: "Malika reflected in a blue sacred mirror after being blessed by Love",
    seoTitle: "Malika, Blessed by Love",
    seoDescription:
      "Malika, Blessed by Love is a Gaze Glass Observation about control disguised as devotion, self-return, beauty, and a blessing from the God of Love.",
    excerpt:
      "Malika nearly surrendered her reflection to a man who called possession love. The God of Love answered with a blessing that returned her to herself.",
    story: [
      "Malika wanted to become a cosmetologist because beauty had once saved her from disappearing. Color, hair, skin, and light were not vanities to her. They were the first language she learned for saying I am still here.",
      "Ricardo called that language childish. He said he loved her natural. He said he loved her quiet. He said every dream that brought other eyes toward her was a danger to their peace.",
      "For a while, Malika mistook possession for devotion because possession arrives wearing devotion's clothes. It brought rules wrapped as care, warnings wrapped as tenderness, and a smaller mirror every time she tried to see herself clearly.",
      "The academy brochure stayed hidden in a drawer. The lipstick stayed unopened. The woman Malika was becoming waited behind her own face like someone locked on the other side of glass.",
      "She had stopped praying at twelve. But when every ordinary door closed, she returned to the God of Love with one request: help me become myself again.",
      "The answer did not arrive as romance. It arrived as recognition. The God of Love placed a single vial in Malika's hands, bright as water holding moonlight. Whoever saw her next would love her without apology.",
      "Malika feared the blessing because she understood its danger. A power like that could have made the world kneel. Instead, the first gaze it changed was her own.",
      "In the mirror, she saw no ruined woman, no disobedient partner, no reckless dreamer. She saw a mortal who had been made to apologize for wanting a life and was finished apologizing.",
      "She left with one suitcase and one lipstick. Ricardo saw her next and loved her, yes, but the blessing had already done its holier work. It made his love irrelevant to her freedom.",
      "The academy opened its doors. Years later, Malika taught others to recognize themselves in the mirror before asking anyone else to look.",
      "The Seer records the case under Love because true love did not deliver Malika to another person. It returned Malika to Malika.",
    ],
    related: ["marcella", "takeshi"],
  },
  {
    number: "004",
    title: "Takeshi, Blessed by Fortune",
    slug: "takeshi",
    godId: "fortune",
    spiritWitnessIds: ["saroka"],
    themeTags: ["luck", "creative-work", "discovery", "access"],
    description:
      "A solo game developer asks the God of Fortune for one chance after three years of unseen work, and one small blessing opens a world.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of Fortune",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readingTimeMin: 4,
    dateObserved: "2026-06-24",
    image: "/mortals/takeshi/portrait.png",
    imageAlt: "Takeshi reflected in a red triangular sacred glass after being blessed by Fortune",
    seoTitle: "Takeshi, Blessed by Fortune",
    seoDescription:
      "Takeshi, Blessed by Fortune is a Gaze Glass Observation about unseen creative work, a solo game launch, Saroka, and one chance from the God of Fortune.",
    excerpt:
      "Takeshi built a game alone for three years. On launch night, it entered the world with no audience until Fortune opened one door labor had earned.",
    story: [
      "Takeshi built Untold Journey alone for three years. He built it after work, before sleep, between meals, inside the hours other people used to recover from the day.",
      "The game became a country only he could visit. It had weather, ruins, music, little villages with lanterns in the rain, and a final door that opened only for players who remembered the names of everyone they had helped.",
      "On launch night, no one came.",
      "There were no reviews, no posts, no streamers, no sudden chorus of strangers discovering the world he had carried by himself. The number stayed at zero long enough to become a verdict.",
      "Takeshi returned to a prayer he thought childhood had outgrown. He did not ask to be famous. He did not ask to be rich. He asked the God of Fortune for one chance.",
      "High above him, Fortune watched with mismatched eyes that had seen every possible outcome. Saroka, the scarlet fox, carried the smallest possible blessing into the city.",
      "One tired streamer was about to log off. Her cursor moved past Untold Journey, paused for no reason she could name, and clicked.",
      "The first player stayed. Then she told everyone why she stayed. By morning, the quiet work no algorithm had noticed became a shared world thousands of people wanted to enter.",
      "Fortune did not replace Takeshi's labor. Fortune opened the door his labor had built.",
      "Takeshi used what arrived to build places where more people could play, gather, and learn. The blessing did not end at success. It became access.",
      "The Seer records the case under Fortune because luck is not the reward. What a mortal does with luck becomes the record.",
    ],
    related: ["malika", "walter"],
  },
  {
    number: "005",
    title: "Walter, Blessed by War",
    slug: "walter",
    godId: "war",
    spiritWitnessIds: ["marok"],
    themeTags: ["home", "strategy", "community", "defense"],
    description:
      "An old soldier asks the God of War for glory when a developer tries to take the home that held his life, and strategy becomes his blessing.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of War",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readingTimeMin: 5,
    dateObserved: "2026-06-24",
    image: "/mortals/walter/portrait.png",
    imageAlt: "Walter reflected in a black and red sacred shield-glass after being blessed by War",
    seoTitle: "Walter, Blessed by War",
    seoDescription:
      "Walter, Blessed by War is a Gaze Glass Observation about an old soldier, a threatened home, neighborhood resistance, and a strategic blessing from the God of War.",
    excerpt:
      "Walter was told the home that held his life had become someone else's opportunity. He did not pray for destruction. He asked for glory.",
    story: [
      "For fifty years, Walter's house kept the measure of his life. It held the heights of his children in pencil on a kitchen wall, the silence after his wife died, and every ordinary morning that made staying alive feel less like duty and more like devotion.",
      "Then a developer reduced it to a parcel number and taped a notice to the door.",
      "Walter refused to sell. Lawyers arrived with deadlines, signatures, and smiles sharp enough to cut through memory. They spoke of progress as if progress had never buried anything sacred.",
      "He had not prayed since the war. That night, kneeling before medals he rarely touched, Walter asked the God of War for the only weapon he trusted: glory, not cruelty. Strength, not destruction. A way to fight without becoming what threatened him.",
      "The God of War looked through the mirror and saw no helpless old man. War saw a soldier still standing guard over the last thing he had sworn to protect.",
      "The blessing did not rebuild Walter's body. It entered the room as counsel, teeth, and fire, then placed the real weapon where Walter could reach it: his mind.",
      "By morning, every threat became terrain. Every document became a map. Every powerful man became a piece that could be moved.",
      "Walter followed permits, ownership shells, public hearings, and money until the development stopped looking inevitable and started looking vulnerable.",
      "Then he gave the neighborhood evidence, language, and a reason to gather. The developer believed Walter stood alone. Walter became the place where courage organized itself.",
      "When he called the press, the story that had been handled in rooms without witnesses became public. The machine lost its most useful darkness.",
      "The permit fell. The house remained. Walter did not win because War made him violent. He won because War taught him where to stand, where to strike, and what must never be surrendered.",
      "The Seer records the case under War because war is not the violence. War is the will to protect what must not be taken.",
    ],
    related: ["takeshi", "marcella"],
  },
];

export const featuredObservation = observations[0];
export const startHereObservation = observations.find((observation) => observation.startHere) ?? observations[0];

export function formatObservationReadTime(observation: Pick<Observation, "readingTimeMin">) {
  return `${observation.readingTimeMin} min read`;
}

export const godFilterLabels: Record<GodId, string> = {
  wisdom: "Wisdom",
  justice: "Justice",
  love: "Love",
  fortune: "Fortune",
  war: "War",
};

export const spiritFilterLabels: Record<SpiritId, string> = {
  kitsu: "Kitsu",
  saroka: "Saroka",
  marok: "Marok",
};

const discoveryThreads: Record<string, DiscoveryThread> = {
  patricia: {
    promise:
      "You have seen Wisdom dissolve the wall between one life and every other life. Follow the divine record, then let the Glass hand you the mortal onramp.",
    items: [
      {
        kind: "god",
        label: "Follow the god",
        title: "The God of Wisdom",
        href: "/the-gods#the-god-of-wisdom",
        description: "The keeper of the cosmic record waits behind Patricia's awakening.",
      },
      {
        kind: "law",
        label: "Read the law",
        title: "The Law of Memory",
        href: "/celestial-codex#memory",
        description: "What survives a life is not performance, but the truest thing it carried.",
      },
      {
        kind: "observation",
        label: "Begin the path",
        title: "Marcella, Blessed by Justice",
        href: "/observations/marcella",
        description: "The clearest first thread begins with a mortal asking to be witnessed.",
      },
    ],
  },
  marcella: {
    promise:
      "You have witnessed Marcella ask to be seen. The next thread is Justice, Kitsu, and the law that explains why a truth changes once the Glass holds it.",
    items: [
      {
        kind: "god",
        label: "Follow the god",
        title: "The God of Justice",
        href: "/the-gods#the-god-of-justice",
        description: "Justice does not need spectacle. Justice makes the record accurate.",
      },
      {
        kind: "spirit",
        label: "Meet the spirit",
        title: "Kitsu",
        href: "/the-spirits#kitsu",
        description: "The quiet witness beside Justice watches truth find its way to the light.",
      },
      {
        kind: "law",
        label: "Read the law",
        title: "The Law of Witness",
        href: "/celestial-codex#witness",
        description: "What is fully seen can no longer remain unchanged.",
      },
    ],
  },
  malika: {
    promise:
      "You have watched Love return Malika to herself. Follow the blessing outward to the god, the spirit nearest that tenderness, and the law of return.",
    items: [
      {
        kind: "god",
        label: "Follow the god",
        title: "The God of Love",
        href: "/the-gods#the-god-of-love",
        description: "Love arrives first as recognition, then as freedom.",
      },
      {
        kind: "spirit",
        label: "Meet the spirit",
        title: "Sindren",
        href: "/the-spirits#sindren",
        description: "The cobalt witness who understands when gentleness is not weakness.",
      },
      {
        kind: "law",
        label: "Read the law",
        title: "The Law of Return",
        href: "/celestial-codex#return",
        description: "Nothing surrendered into the Glass is lost; it returns transformed.",
      },
    ],
  },
  takeshi: {
    promise:
      "You have seen Fortune open one door labor had already built. Follow the god, the fox who carried the blessing, and the law that names devotion.",
    items: [
      {
        kind: "god",
        label: "Follow the god",
        title: "The God of Fortune",
        href: "/the-gods#the-god-of-fortune",
        description: "Fortune does not replace the work. Fortune chooses the moment a door opens.",
      },
      {
        kind: "spirit",
        label: "Meet the spirit",
        title: "Saroka",
        href: "/the-spirits#saroka",
        description: "The scarlet fox who knows exactly when luck should develop teeth.",
      },
      {
        kind: "law",
        label: "Read the law",
        title: "The Law of Devotion",
        href: "/celestial-codex#devotion",
        description: "What remains after reward disappears is the only devotion the gods can name.",
      },
    ],
  },
  walter: {
    promise:
      "You have watched War become strategy instead of cruelty. Follow the god, the trial-maker beside him, and the law that opens when force fails.",
    items: [
      {
        kind: "god",
        label: "Follow the god",
        title: "The God of War",
        href: "/the-gods#the-god-of-war",
        description: "War is the will to protect what must not be taken.",
      },
      {
        kind: "spirit",
        label: "Meet the spirit",
        title: "Marok",
        href: "/the-spirits#marok",
        description: "The fox who studies the trial until the weak point shows itself.",
      },
      {
        kind: "law",
        label: "Read the law",
        title: "The Law of Surrender",
        href: "/celestial-codex#surrender",
        description: "The door that will not open by force opens when the soul stops striking it.",
      },
    ],
  },
};

export function getObservationHref(observation: Observation) {
  return observation.canonicalPath ?? `/observations/${observation.slug}`;
}

export function getObservation(slug: string) {
  return observations.find((observation) => observation.slug === slug);
}

export function getRelatedObservations(observation: Observation) {
  return observation.related
    .map((slug) => getObservation(slug))
    .filter((item): item is Observation => Boolean(item));
}

export function getDiscoveryThread(slug: string) {
  return discoveryThreads[slug] ?? null;
}

export function getRegionObservations(region: ObservationRegion) {
  if (region === "gods") {
    return observations.filter((observation) => Boolean(observation.godId));
  }

  if (region === "spirits") {
    return observations.filter((observation) => observation.spiritWitnessIds.length > 0);
  }

  return observations.filter((observation) => observation.region === region);
}

export function getCasesByGod(godId: GodId) {
  return observations.filter((observation) => observation.godId === godId);
}

export function getCasesBySpirit(spiritId: SpiritId) {
  return observations.filter((observation) => observation.spiritWitnessIds.includes(spiritId));
}

export function getNextObservation(currentSlug: string) {
  const ordered = [...observations].sort((a, b) => a.number.localeCompare(b.number));
  const currentIndex = ordered.findIndex((observation) => observation.slug === currentSlug);

  if (currentIndex < 0) {
    return null;
  }

  return ordered[currentIndex + 1] ?? null;
}

export function getPreviousObservation(currentSlug: string) {
  const ordered = [...observations].sort((a, b) => a.number.localeCompare(b.number));
  const currentIndex = ordered.findIndex((observation) => observation.slug === currentSlug);

  if (currentIndex < 0) {
    return null;
  }

  return ordered[currentIndex - 1] ?? null;
}
