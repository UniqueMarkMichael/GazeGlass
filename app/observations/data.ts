export type ObservationRegion = "gods" | "spirits" | "mortals";
export type ObservationMagnitude = "observation" | "story" | "novella" | "novel";

export type Observation = {
  number: string;
  title: string;
  slug: string;
  canonicalPath?: string;
  description: string;
  region: ObservationRegion;
  regionLabel: string;
  association: string;
  magnitude: ObservationMagnitude;
  magnitudeLabel: string;
  readTime: string;
  dateObserved: string;
  image?: string;
  imageAlt?: string;
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
    title: "The Gods",
    instrument: "The Orb",
    subtitle: "The scale of the divine.",
    description:
      "Stories connected to prophecy, judgment, cosmic pressure, and the forces that move before mortals know they have been moved.",
  },
  spirits: {
    title: "The Spirits",
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
    symbol: "Constellation",
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
    slug: "patricia-awakened-by-wisdom",
    canonicalPath: "/observations",
    description:
      "A former financier abandons wealth to seek enlightenment on a city street and learns there was never a wall between herself and the world.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of Wisdom",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readTime: "7 min read",
    dateObserved: "2026-06-13",
    image: "/mortals/patricia/wisdom-appears.png",
    imageAlt:
      "Patricia seated on a city street as the indigo God of Wisdom appears above her in gold celestial light",
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
      "And the deity did not explain. It did the older, harder thing: It took away the wall.",
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
    related: [],
  },
];

export const featuredObservation = observations[0];

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

export function getRegionObservations(region: ObservationRegion) {
  return observations.filter((observation) => observation.region === region);
}
