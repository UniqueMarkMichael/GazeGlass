export type ObservationRegion = "gods" | "spirits" | "mortals";
export type ObservationMagnitude = "observation" | "story" | "novella" | "novel";

export type Observation = {
  number: string;
  title: string;
  slug: string;
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
    number: "006",
    title: "The Fox Beneath the Banyan Tree",
    slug: "the-fox-beneath-the-banyan-tree",
    description:
      "A fox waits beneath an ancient tree while the God of Beauty decides whether mercy can survive being seen.",
    region: "gods",
    regionLabel: "The Gods",
    association: "The God of Beauty",
    magnitude: "observation",
    magnitudeLabel: "Observation",
    readTime: "3 min read",
    dateObserved: "2026-06-11",
    image: "/gods/beauty.webp",
    imageAlt: "The God of Beauty surrounded by celestial ornament",
    seoTitle: "The Fox Beneath the Banyan Tree",
    seoDescription:
      "Read a Gaze Glass fantasy observation connected to the God of Beauty, a fox, and a mercy almost too bright to name.",
    excerpt:
      "Beneath the banyan's endless shade, the fox did not move. Not for prayer. Not for escape. Not even when beauty stepped close enough to be cruel.",
    story: [
      "Beneath the banyan's endless shade, the fox did not move.",
      "Not for prayer. Not for escape. Not even when beauty stepped close enough to be cruel.",
      "The village had tied red thread around the oldest roots and called it devotion. The fox knew better. The thread was fear. Each knot marked a wish no one wanted overheard.",
      "When the God of Beauty arrived, every leaf turned its pale underside toward the sky. The god wore gold as if it had learned obedience. Ten hands opened. Ten shadows fell.",
      "\"You have been stealing prayers,\" the god said.",
      "The fox lowered its head. In its mouth, hidden behind careful teeth, was a knot of red thread chewed soft by grief.",
      "\"No,\" the fox answered. \"I have been keeping the ugliest ones safe.\"",
      "Beauty considered this. The village slept. The banyan breathed. Somewhere beneath the roots, a widow dreamed that her daughter still knew the way home.",
      "At last, the god bent and took the thread. It did not become gold in the divine hand. It became visible.",
      "That was worse.",
      "By morning, every person in the village remembered what they had asked the tree to hide. Some wept. Some fled. Some finally apologized.",
      "The fox remained beneath the banyan until dusk, guarding the roots from silence. When the Seer looked through the Glass, the god was gone, but the leaves still shone as though beauty had passed judgment and chosen not to destroy.",
    ],
    related: [
      "jem-and-the-weight-of-silence",
      "a-prayer-beneath-broken-stars",
      "the-girl-who-remembered-the-ocean",
    ],
  },
  {
    number: "005",
    title: "A Prayer Beneath Broken Stars",
    slug: "a-prayer-beneath-broken-stars",
    description:
      "A mortal asks the God of Love for a miracle and receives something smaller, stranger, and more difficult to keep.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of Love",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readTime: "4 min read",
    dateObserved: "2026-06-10",
    image: "/gods/love.webp",
    imageAlt: "The God of Love rendered in blue celestial light",
    seoTitle: "A Prayer Beneath Broken Stars",
    seoDescription:
      "Read a mythic fantasy story from Gaze Glass about a mortal prayer, the God of Love, and the cost of being answered.",
    excerpt:
      "The sky above Ileni's roof had cracked in seven places. Her mother said stars did that when someone loved too loudly.",
    story: [
      "The sky above Ileni's roof had cracked in seven places.",
      "Her mother said stars did that when someone loved too loudly. Her father said roofs cracked because no one in the house knew how to fix anything before winter. Ileni believed both explanations. She had learned early that mortals survived by letting impossible things and ordinary things share the same room.",
      "On the seventh night of rain, she climbed to the roof with a bowl of milk, three copper pins, and the name she had not spoken since her brother left.",
      "\"Bring him home,\" she whispered to the God of Love.",
      "Nothing happened.",
      "This was expected. Gods were busy. Love most of all.",
      "Then the milk froze.",
      "A blue hand rose from the bowl, no larger than a child's, and placed a single seed in Ileni's palm. It was warm. It pulsed once, like a heart embarrassed by its own noise.",
      "\"That is not my brother,\" Ileni said.",
      "The rain paused, offended.",
      "A voice answered from everywhere the roof leaked. \"No. It is a door.\"",
      "Ileni planted the seed beneath the broken stars. By morning, a vine had grown through the roof, down the wall, across the floorboards, and around the chair where her brother used to sit.",
      "At noon, a stranger knocked.",
      "He was not her brother. He carried no message. He knew nothing of war, or distance, or the road that had swallowed a boy five years before. But he had lost someone too, and when he saw the vine, he began to cry as if the house had called him by name.",
      "The Glass recorded what happened next without sentiment. Ileni made tea. The stranger stayed until the rain stopped. Neither was healed. Both were less alone.",
      "When Ileni asked the vine why Love had sent a door instead of a miracle, one leaf unfolded against her wrist.",
      "On it, in blue veins bright as larimar, were the words: Some prayers are not roads backward. Some are rooms large enough for another soul to enter.",
    ],
    related: [
      "the-fox-beneath-the-banyan-tree",
      "the-patient-last-light",
      "jem-and-the-weight-of-silence",
    ],
  },
  {
    number: "004",
    title: "Jem and the Weight of Silence",
    slug: "jem-and-the-weight-of-silence",
    description:
      "Jem is sent to carry one sentence between divine courts and learns why some truths arrive with claws.",
    region: "spirits",
    regionLabel: "The Spirits",
    association: "Jem",
    magnitude: "story",
    magnitudeLabel: "Character Story",
    readTime: "3 min read",
    dateObserved: "2026-06-09",
    image: "/spirits/jem.webp",
    imageAlt: "Jem, fox spirit assistant to the God of Beauty",
    seoTitle: "Jem and the Weight of Silence",
    seoDescription:
      "Read a Gaze Glass fox spirit story about Jem, the divine courts, and a truth too sharp to carry carelessly.",
    excerpt:
      "The message was only four words long, but Jem carried it as if it were a bowl filled to the lip with fire.",
    story: [
      "The message was only four words long, but Jem carried it as if it were a bowl filled to the lip with fire.",
      "Do not forgive yet.",
      "The God of Beauty had spoken the sentence softly. That made it heavier. Divine courts preferred thunder because thunder ended quickly. A whisper could keep opening inside the listener for centuries.",
      "Jem crossed the silver hall with the message tucked beneath one blue paw. Every statue turned its head as he passed. None asked what he carried. Statues are wise that way.",
      "At the Court of Mercy, the doors opened before he touched them.",
      "Mercy sat alone, polishing a cup that had once belonged to a tyrant. The cup had a crack down one side. Light leaked from it anyway.",
      "\"Beauty sends instruction?\" Mercy asked.",
      "Jem bowed. \"Beauty sends caution.\"",
      "He delivered the four words.",
      "The room dimmed.",
      "Mercy did not rage. Mercy did not weep. Mercy only set the cup down and looked at the fox with an expression mortals often mistake for kindness.",
      "\"Does she think forgiveness is mine to withhold?\"",
      "Jem's tail went still. Here was the danger in carrying truth: people always assumed the messenger had survived understanding it.",
      "\"No,\" Jem said. \"She thinks the wounded should not be asked to become holy before they are allowed to be honest.\"",
      "For a long while, even the cup stopped shining.",
      "Then Mercy nodded.",
      "When Jem returned, the God of Beauty did not ask whether the message had been received. She asked whether he had been kind.",
      "Jem thought of Mercy's hands. The cracked cup. The silence that followed four words.",
      "\"No,\" he said. \"I was useful.\"",
      "Beauty smiled. \"Good. Kindness can arrive later. Truth was due today.\"",
    ],
    related: [
      "the-fox-beneath-the-banyan-tree",
      "the-girl-who-remembered-the-ocean",
      "a-prayer-beneath-broken-stars",
    ],
  },
  {
    number: "003",
    title: "The Day the Wind Stopped",
    slug: "the-day-the-wind-stopped",
    description:
      "A town learns the shape of a bargain when every flag, sail, and breath of weather becomes still.",
    region: "gods",
    regionLabel: "The Gods",
    association: "The God of Fortune",
    magnitude: "observation",
    magnitudeLabel: "Observation",
    readTime: "2 min read",
    dateObserved: "2026-06-08",
    image: "/gods/fortune.webp",
    imageAlt: "The God of Fortune in gold and cosmic light",
    seoTitle: "The Day the Wind Stopped",
    seoDescription:
      "Read a short Gaze Glass fantasy observation about fortune, bargains, and a town where the wind suddenly stopped.",
    excerpt:
      "No one noticed the first hour. By the second, every sail hung like a guilty handkerchief.",
    story: [
      "No one noticed the first hour.",
      "By the second, every sail hung like a guilty handkerchief. By the third, the miller began to curse. By the fourth, the birds had gathered on the church roof to discuss what mortals had done this time.",
      "The town of Vey owed its luck to a god it no longer named.",
      "That was the problem with blessings. After three generations, people called them infrastructure.",
      "The baker still sold bread. The fishermen still mended nets. The mayor still stood in the square and promised the wind would return by evening, as if weather respected elected confidence.",
      "Only a child named Savi walked to the harbor shrine and cleaned the salt from the old gold coin embedded in the stone.",
      "\"We forgot,\" Savi said.",
      "The coin turned once.",
      "Not fully. Just enough to show it had heard.",
      "At sunset, the wind returned. Not kindly. It came all at once, slamming shutters, snapping ropes, and turning every forgotten prayer into dust.",
      "The next morning, the town rebuilt the shrine.",
      "The Glass records this not as punishment, but correction. Fortune is not offended when mortals prosper. Fortune is offended when they confuse being carried with walking alone.",
    ],
    related: [
      "a-prayer-beneath-broken-stars",
      "the-fox-beneath-the-banyan-tree",
      "the-patient-last-light",
    ],
  },
  {
    number: "002",
    title: "The Girl Who Remembered the Ocean",
    slug: "the-girl-who-remembered-the-ocean",
    description:
      "A spirit of memory follows a girl born inland who dreams of salt water no one in her bloodline has ever seen.",
    region: "spirits",
    regionLabel: "The Spirits",
    association: "The Spirit of Memory",
    magnitude: "observation",
    magnitudeLabel: "Observation",
    readTime: "4 min read",
    dateObserved: "2026-06-07",
    image: "/spirits/sindren.webp",
    imageAlt: "Sindren, cobalt fox spirit assistant to the God of Love",
    seoTitle: "The Girl Who Remembered the Ocean",
    seoDescription:
      "Read a lyrical Gaze Glass observation about memory, inheritance, and a girl who dreams of an ocean she has never seen.",
    excerpt:
      "Mara was born in a house of dust, three hundred miles from the nearest shore, with salt drying on her eyelashes.",
    story: [
      "Mara was born in a house of dust, three hundred miles from the nearest shore, with salt drying on her eyelashes.",
      "The midwife called it sweat. Her grandmother crossed herself. Her mother, who had never seen the sea and distrusted anything larger than a field, washed Mara's face and said nothing.",
      "At five, Mara drew waves on every wall.",
      "At nine, she began waking with shells in her fists.",
      "At thirteen, a blue fox appeared at the foot of her bed and asked if she was ready to return what did not belong to her.",
      "Mara sat up. \"I have never stolen anything.\"",
      "The fox blinked. \"Memory is rarely stolen. More often, it is buried alive.\"",
      "It led her through the sleeping town, past the grain silos, past the road markers, past the dry riverbed where no river had run in living memory. At the center of the riverbed, the fox dug until its paws struck glass.",
      "Beneath the sand was a bottle. Inside was a map. Inside the map was a scream.",
      "Mara touched the cork and remembered everything: ships arriving under black flags, women running with children, a grandmother's grandmother turning inland because the ocean had taken too many names.",
      "The fox waited while Mara cried.",
      "In the morning, she carried the bottle home. Her mother opened it. Her grandmother fell to her knees. The house filled with the sound of waves that had been trying to arrive for a century.",
      "The Glass records the spirit's final act with unusual tenderness. It did not return the family to the sea. It returned the sea to the family.",
    ],
    related: [
      "jem-and-the-weight-of-silence",
      "a-prayer-beneath-broken-stars",
      "the-fox-beneath-the-banyan-tree",
    ],
  },
  {
    number: "001",
    title: "The Patient's Last Light",
    slug: "the-patient-last-light",
    description:
      "A nurse notices one impossible light beside a dying bed and chooses not to call it a hallucination.",
    region: "mortals",
    regionLabel: "The Mortals",
    association: "The God of Mercy",
    magnitude: "observation",
    magnitudeLabel: "Observation",
    readTime: "4 min read",
    dateObserved: "2026-06-06",
    image: "/gods/mercy.webp",
    imageAlt: "The God of Mercy in soft sacred light",
    seoTitle: "The Patient's Last Light",
    seoDescription:
      "Read a Gaze Glass mortal observation about mercy, a nurse, and the final light beside a dying bed.",
    excerpt:
      "At 3:17 in the morning, Nurse Elian saw a second pulse flicker on the monitor of a man whose heart had already stopped.",
    story: [
      "At 3:17 in the morning, Nurse Elian saw a second pulse flicker on the monitor of a man whose heart had already stopped.",
      "It was not medical. She knew medical. Medical had alarms, numbers, forms, signatures, and the heavy shoes of people arriving too late.",
      "This was a light.",
      "It appeared beside the bed, small as a candle flame and blue at the edges. The dead man's daughter slept in the chair, one hand still holding her father's sleeve.",
      "Elian should have called someone.",
      "Instead, she closed the door.",
      "The light moved across the room and settled above the daughter like a hand that had forgotten how to touch. The woman's face changed. Not enough to wake her. Enough to loosen the grief that had been waiting at her jaw.",
      "Elian had seen death many times. She had never seen mercy arrive afterward.",
      "In the chart, she wrote only what the hospital could bear: patient passed peacefully.",
      "In the Glass, the Seer recorded the rest.",
      "The God of Mercy did not reverse the death. Mercy is not the enemy of endings. The god only stayed long enough for love to leave the room without being dragged.",
      "Years later, Elian would remember the light whenever a family asked if their beloved had suffered. She never lied. But sometimes she said, \"He was not alone.\"",
      "That, the Glass says, was also a kind of truth.",
    ],
    related: [
      "a-prayer-beneath-broken-stars",
      "the-girl-who-remembered-the-ocean",
      "the-day-the-wind-stopped",
    ],
  },
];

export const featuredObservation = observations[0];

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
