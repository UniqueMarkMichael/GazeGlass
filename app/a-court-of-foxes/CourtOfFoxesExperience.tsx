"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";

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
    "number": "01",
    "label": "Chapter One",
    "title": "The Celestial Court",
    "readTime": "~9 min",
    "question": "What does Jem fear about being wanted?",
    "hero": "/a-court-of-foxes/assets/ch1-beauty-throne.png",
    "heroAlt": "Jem beside the God of Beauty in a rose and gold celestial court",
    "accent": "rose",
    "summary": "Jem is sent down to live one mortal hour, escorted by War and shadowed by Justice.",
    "hook": "The crystal doors seal behind them. Below the court waits a stairway of black stone.",
    "body": [
      "I counted seven exits before the first fox smiled at me.",
      "Not kindly. Not subtly. With teeth. Divine courts were full of teeth.",
      "My goddess always told me I was no ordinary vixen — that I should never settle. Standing in that glittering room, I wondered if she understood those were two different instructions.",
      "The Celestial Court glittered like gold. Pillars of multi-colored glass rose into a ceiling too high to trust. Pillar candles burned in floating rings above us, their flames rose-bright at the center and honey-gold at the edges. Nauseating jasmine incense burned, wisps of white smoke snaking in every direction in loose loops. A harp played on its own below silk banners that hung between the pillars, embroidered with the old refrain in thread fine enough to look like trapped sunlight.",
      "Gods Watch. Mortals Pray. Spirits Remember.",
      "Every fox sat beside their patron deity with absolute reverence. One god. One fox. That was the law — and attendance was not optional. I stood at the right hand of the God of Beauty and pretended not to notice the weight of her gaze on the back of my bejeweled neck. My goddess's throne was sculpted from blocks of polished rose quartz. I peered into the reflective surface and blinked at myself from six different angles without ever choosing to look. Pink fur swept over one shoulder. A gold collar at my throat. A white tail curled neatly behind my little feet.",
      "I was trying my best to keep my face composed. Trying my best to keep my mouth soft. Despite two foxes vying for my attention, I kept my eyes lowered exactly enough to flatter, but not enough to seem afraid. I had to look like the very picture of devotion. But that was the problem with beauty. Beauty lies even when the truth is told. We all want to see what we want to see.",
      "A mortal servant passed by with a tray of sugared figs. Each fig had been brushed with gold dust and arranged around a spray of moonflowers. Lovely, at first glance. Hideous upon second sight. Beneath the nearest bloom, one petal had browned at the edge. A thin black vein spread through it like rot through lace. I saw it because my goddess had made me to see such things. The flaw under the ornament. The hunger under the smile. The bruise under the silk. Mortals think beauty is a gift. They are wrong. Beauty was a hand on the back of your neck, guiding you toward the place someone had already decided you belonged.",
      "“Jem,” the God of Beauty said, each syllable drawn like pulled silk.",
      "I turned my head a fraction and smiled. My goddess did not look at me. Gods rarely bothered to look directly at what belonged to them. She watched the assembly below with a little curve to her mouth, amused by the boredom of immortals.",
      "“Yes, my goddess?” I asked.",
      "The God of Beauty grinned. “You are counting exits again.”",
      "I stilled as her smile widened.",
      "“Only admiring the architecture,” I said.",
      "My goddess laughed, and every mirror in her throne caught the sound. “Of course you are.”",
      "Then the western doors opened late. Not a little late. Not politely late. Late enough that every head turned. Marok — divine assistant to the God of War — entered as though applause had been promised and merely forgotten. No one clapped. He wore the colors of War the way fire wore smoke: carelessly, beautifully, and with every intention of ruining something. His coat was green as the glass grass in Utopia. He caught me looking. Of course he did. Marok's grin sharpened. I looked away first, which was irritating because it made him win something I had not agreed to play.",
      "The eastern doors opened next. No delay. No flourish. No glitter. Kitsu, divine assistant to the God of Justice, entered at the exact appointed moment, as if the court's clock had taken lessons from his spine. His fur was as gold as the sun at dawn. His glimmering tail swept once behind him, controlled as a brushstroke. Kitsu did not look at the gods first. He looked at the exits. All seven. Then he looked at me. My skin tightened under my collar. Marok saw me when I was pretending. Kitsu saw what the pretending was built around — and that made him dangerous in a quieter way.",
      "“One night,” Marok said, later, when the bells had rung and the boredom had curdled into something reckless. “Borrowed bodies. Tails surrendered before the ninth bell. Returned before dawn. As mortals.”",
      "“Absolutely not,” Kitsu said. “It is forbidden to leave without summons.”",
      "“It is frowned upon,” Marok said.",
      "And I wanted out. The truth came so suddenly I had to lower my pink eyes before anyone saw it. I wanted one hour where no god adjusted me with a hand on my back. One hour where no mirror told me what I was worth. But desire was a door, too — and I had spent too long counting exits to mistake every open door for freedom.",
      "The God of Beauty rose from her throne, and the court finally noticed us. “My assistant, Jem, will attend the mortal hour,” she announced. “War's assistant seems eager to escort her. Justice's fox seems eager to prevent catastrophe. How convenient. They may both go.”",
      "I stopped at the threshold and counted the exits one last time. Seven behind me. One ahead. Marok came to my left, warm as trouble. Kitsu came to my right, quiet as a verdict. Behind me, the court glittered like a cage. Ahead, the mortal night opened its teeth and smiled."
    ],
    "scenes": [
      {
        "after": 4,
        "src": "/a-court-of-foxes/assets/ch1-court-interior.png",
        "alt": "The Celestial Court — stained glass, gold mirrors, candlelight",
        "caption": "The Celestial Court — pillars of colored glass, candles rose-bright at the center."
      },
      {
        "after": 14,
        "src": "/a-court-of-foxes/assets/ch1-court.png",
        "alt": "The God of Beauty on her rose quartz throne, Jem at her feet",
        "caption": "She never looked directly at what belonged to her."
      }
    ]
  },
  {
    "number": "02",
    "label": "Chapter Two",
    "title": "The Mortal Hour",
    "readTime": "~10 min",
    "question": "What does Jem surrender when she lets herself be touched?",
    "hero": "/a-court-of-foxes/assets/ch2-stairway.png",
    "heroAlt": "Three fox spirits descending a black stairway veined with amber",
    "accent": "gold",
    "summary": "The three surrender their tails and step into borrowed mortal flesh.",
    "hook": "Below waits the mortal city: music, smoke, and the first hour Jem has ever belonged to no one.",
    "body": [
      "Icy air grasped my lungs as we exited the Celestial Court.",
      "I had expected gold. Everything above had been gold, or glass pretending to be gold, or beauty pretending not to be a cage — but the stairway beneath the Celestial Court had been cut from black stone veined with amber light. It spiraled down through the body of the palace like a secret no one wished to claim, and smelled like cinnamon rotting.",
      "My claws clicked against each step. Marok took the stairs as if gravity had offended him personally — bounding three at a time, green tail high, ears pricked toward trouble. Kitsu descended as though every stair had filed a petition and he had approved each one in order.",
      "I stayed between them, because — of course I did. Not because I needed guarding. Only because the stairway was narrow, and Marok kept glancing back with that grin, and Kitsu kept watching the shadows ahead as if law itself might be hiding in them with a knife. Behind us, the crystal court doors sealed with a sound like a kiss pressed to glass. I did not look back. Though I wanted to.",
      "“Still time to confess this was a joke,” Kitsu said.",
      "Marok’s ears twitched. “The tragic thing about you, golden boy, is that you think jokes cannot also be destiny.”",
      "“They cannot,” Kitsu growled.",
      "Marok cackled. “Then you are telling them wrong.”",
      "I should have remained silent. Silence was safer. Instead I said, “If this is destiny, it has poor manners.”",
      "Marok spun on the next landing and walked backward with bravado. “There she is again. The woman under the ornament.”",
      "I nearly missed a step. Kitsu did not. His shoulder brushed mine before I could fall — a controlled, careful touch that vanished almost before it happened. Marok saw it anyway. Of course he did.",
      "“Boys,” I said sweetly, pitching my voice to the honeyed lift my goddess used when she wanted something destroyed. “I have four paws and an excellent memory. Make this about territory, and I will bite you very hard.”",
      "For one glorious heartbeat, they both shut up. Then Marok opened his big mouth. “Is that a promise?”",
      "The stairway ended at a door made of dark mirror-glass. No handle. No hinge. Only our reflections warped across its surface: three foxes — one pink, one green, one gold — all pretending we had not just stepped out of the laws that kept the heavens tidy. Words glowed above the door in old script.",
      "The mirror brightened until a face appeared within it. Not a person. Not exactly. A mask of black glass, with eyes of candle flame and a mouth too thin for kindness.",
      "“The God of Beauty’s assistant attends under command,” it said, its burning eyes turning to me. “The God of War’s assistant attends under intent. The God of Justice’s assistant attends under protest. Terms of the Mortal Hour: tails surrendered, bodies transformed, divine seals veiled. Return before dawn’s first bell. Failure to return will result in forfeiture, retrieval, and possible censure.”",
      "“Possible?” Marok asked.",
      "“That word is not comforting,” Kitsu said.",
      "“No,” I said. “It is honest. I prefer it to guaranteed.”",
      "Beyond the door waited a chamber round as an eye — walls black as tar, floor white marble. At its center stood three narrow basins of still water, each shaped like a crescent moon. Above them hung silver hooks, delicate and cruel, swaying though there was no breeze. “Surrender in order of claim,” the mask said. “War. Justice. Beauty.” Of course Beauty came last. Beauty loved an audience.",
      "Marok padded forward, all easy swagger — until he reached the hook. Then the green of his tail dimmed, and I saw the truth before he covered it. He was afraid. Light tore from him. His tail became a ribbon of green fire pulled into the basin, coiling beneath the water like a sleeping serpent. For a breath he looked smaller without it. Then he smiled too brightly. “Well. That was intimate.”",
      "Kitsu stepped to the second basin. He did not hesitate — that was his cruelty to himself. The hook touched his golden tail and his whole body locked. No sound came out of him. That was worse. Gold light streamed into the water, clean and terrible. When it ended, he swayed. I moved before I thought. So did Marok. Neither of us touched him.",
      "“I am fine,” he said.",
      "“Liar,” I said. The word escaped before caution could catch it. Something warmer moved beneath his surprise. “Observed,” he said quietly. I had no idea why that felt like praise.",
      "Then the mask turned to me. My reflection moved in every wall: pink fox, gold collar, bright magenta eyes — an army of pretty things, all walking to the same hook. I hated every single one of them.",
      "The hook touched my tail. Pain bloomed white. Not sharp. Not clean. Worse — familiar. As if every hand that had ever arranged me, praised me, displayed me, and called it love had found the root of me and pulled. My little legs buckled. Marok moved first. Kitsu said my name. I did not fall. I would hold that later like a jewel between my teeth. I did not fall.",
      "My tail became rose-pink light in the basin, bright as a wound under water. The world tipped. “Borrowed flesh granted,” the mask said, from very far away. I had been a fox. Then I was pure heat. Then breath. Then weight. Then too much skin.",
      "I landed hard on hands and knees — pale, slender things spread against cold marble, five fingers splayed like startled spiders. My hair fell around my face in a pink curtain. I inhaled. Then I gagged. The world assaulted me. Jasmine. Stone. Smoke from the city below. My own heartbeat, frantic and loud.",
      "“Jem?” Marok asked — his voice lower now, rougher, still amused. He stood in borrowed flesh, hunter-green hair loose around a face, eyes still that glimmering green above a mouth made entirely for mistakes. “Well,” he said, staring down at himself. “That is inconveniently handsome.”",
      "Justice in mortal skin was worse. Kitsu looked like a temple statue that had learned disappointment — gold-brown skin, dark hair bound at the nape, eyes the same impossible amber as his foxfire. Then he looked at me. Marok did too. As foxes we had fur and function. As mortals, everything had edges. Wrists. Throats. Mouths.",
      "I tried to stand. My knees betrayed me. Marok offered his hand. “Still beautiful,” he said, softer than a joke. The words should have irritated me — they did — but they steadied something I had not known was shaking, because he said them as if he was not asking to own the answer.",
      "“Beauty is not the concern,” Kitsu said carefully. “Balance is. Take the hand if you need it.”",
      "“I do not need it,” I said. My legs wobbled. Marok’s hand remained. “No debt,” he said. “Just a hand.” That was the trouble with Marok — every now and then, beneath all the ruin, he said the right thing. I took his hand. His fingers closed around mine, warm and startlingly human, and the contact raced up my arm before I could command it not to.",
      "“The Mortal Hour has begun,” the mask said. The door had become a tall human mirror in a gilded frame. Beyond it, a corridor of lamps, and past that the dark mouth of the city. Music pulsed faintly through the glass.",
      "The mirror rippled. For one heartbeat, my reflection vanished. A silver-tailed fox stood behind us in the glass — thin and pale, with eyes like old moonlight, their tail gleaming bright as a blade drawn in secret. They looked at me. Not Marok. Not Kitsu. Me. Then their mouth opened, but no sound came out. The image blinked away.",
      "Kitsu’s voice came low and immediate. “What did you see?” I looked at the empty mirror, then at Marok’s hand still wrapped around mine, then turned toward the mortal city, where music waited like a dare. “Nothing,” I replied coolly. The mirror knew I was lying. So did Kitsu. So, gods help me, did Marok."
    ],
    "scenes": [
      {
        "after": 19,
        "src": "/a-court-of-foxes/assets/ch2-ritual.png",
        "alt": "The three basins — tails surrendered",
        "caption": "War. Justice. Beauty — tails surrendered to the crescent basins, the black-glass mask watching."
      },
      {
        "after": 27,
        "src": "/a-court-of-foxes/assets/ch2-mortal.png",
        "alt": "Borrowed flesh — and a silver-tailed watcher in the glass",
        "caption": "Borrowed flesh — Marok’s offered hand, Kitsu’s careful distance, and a silver-tailed watcher in the glass."
      },
      {
        "after": 30,
        "src": "/a-court-of-foxes/assets/ch2-standing.png",
        "alt": "Three mortals — Justice, Beauty, War",
        "caption": "Justice, Beauty, and War in borrowed skin — everything edges now: wrists, throats, mouths."
      }
    ]
  },
  {
    "number": "03",
    "label": "Chapter Three",
    "title": "The Ninth Bell",
    "readTime": "~12 min",
    "question": "What does Jem forget when no one is holding her neck?",
    "hero": "/a-court-of-foxes/assets/ch3-street.png",
    "heroAlt": "Jem, Marok, and Kitsu outside a warm tavern on a rainy mortal street",
    "accent": "green",
    "summary": "The Scale of Judgment shatters at the Ninth Bell. Its halves vanish into the city.",
    "hook": "Above the tavern, far beyond mortal weather, the true Bell begins to ring.",
    "body": [
      "I had assumed the mortal city would smell worse.",
      "It did, obviously. But not simply worse. It smelled impossibly alive. Smoke curled from iron chimneys and roasted-chestnut carts. Rainwater slicked the cobblestones in silver ribbons. Somewhere close, oranges had been split open, their sharp sweetness bleeding into the street. Somewhere farther, something had died in an alley and no one had politely magicked the evidence away. Perfume, sweat, hot sugar, horse, beer, mud, lamp oil, human breath — it all collided at once and climbed straight into my skull.",
      "I stopped under the archway and gagged with dignity. That is to say, very little dignity.",
      "Marok laughed once, then clapped a hand over his own mouth as the smell hit him too. Kitsu merely went still, which was his preferred way of suffering.",
      "“Mortals live in this?” I asked.",
      "Marok inhaled deeply, eyes bright. “They do more than live in it.”",
      "“Yes,” Kitsu said. “They contract diseases.” “They dance,” Marok corrected. Kitsu sighed. “They riot.” “They kiss,” Marok said, pushing his lips out toward me. “They also riot after kissing,” Kitsu said. Marok pointed at him as if he had just proven a sacred theorem. “Passion.” “Poor city planning,” Kitsu said, frowning.",
      "I pressed my fingers to the bridge of my nose. Fingers remained troubling. Too long. Too bare. Too expressive. Every part of this borrowed body seemed designed to betray me. My lungs wanted too much air. My heart insisted on being dramatic. My feet, delicate traitors, objected to every stone. And my hair. My hair was everywhere — pink as foxglove, loose down my back, sliding over my shoulders whenever I moved. I had spent centuries with fur and dignity. Now I had a gown thin enough to make the night personal and hair determined to crawl into my mouth.",
      "Humans were built incorrectly. A carriage rattled past, and I startled at the violence of its wheels. Marok caught my elbow before I stepped backward into a puddle. Kitsu caught my other arm at the same time. Naturally. For one suspended moment, I stood between them with Marok’s warmth on my left and Kitsu’s controlled grip on my right, both of them pretending this was practical. I looked down at their hands. They released me in the same breath.",
      "“Balance,” Kitsu said. “Reflex,” Marok said. “Territory,” I growled. Both of them looked wounded. It improved my mood considerably.",
      "The mirror-gate behind us folded itself into the wall of an old brick building, as if it had always been nothing more than a window gone black with age. Above the archway, a tarnished sign swung in the wind.",
      "Beneath the letters, someone had painted a fox with three tails drinking from a goblet.",
      "Marok grinned slowly. “No,” Kitsu said. “You say that so often,” Marok replied. “Do you ever grow bored of being ignored?” Kitsu scoffed. “That depends. Do you ever grow bored of making disaster feel courted?” Marok grinned. “Never.”",
      "Music pulsed from behind the door. Not the clean harp-notes of the Celestial Court. This music had knees. It had hips. It had the audacity to thump through the soles of my bare feet and make my new human blood answer before I had given it permission. I hated it immediately. I wanted more.",
      "Marok pushed open the door. Heat swallowed us. The Ninth Bell was not a tavern. It was not a temple. It was something worse: both, pretending to be neither. Lanterns hung in clusters from black rafters, each one covered in colored glass so the light spilled red, amber, and green over the room. A bar curved along the far wall like a grin. Mortals packed the center, moving together in a whirl of skirts, boots, bare shoulders, open throats, and laughter loud enough to start wars. On a raised platform, three musicians played as if they were trying to outrun death. Drum. Fiddle. Some reedy pipe that sounded like a bird losing an argument. And above the bar, mounted inside a case of smoky glass, hung a golden scale.",
      "I noticed it because Kitsu stopped breathing. Not metaphorically. Not dramatically. He stopped.",
      "Marok followed his gaze and frowned. “That is a little on the nose, even for mortals.” The scale was beautiful in the way divine tools often were: too balanced to be decorative, too sharp to be safe. Its central beam was blackened gold. Two shallow pans hung from chains so fine they looked like threads of light. The words beneath the case read:",
      "Naturally, this meant every mortal in the building had probably touched it.",
      "Kitsu’s face had gone pale beneath the warm brown of his borrowed skin. “That should not be here,” he said. Marok leaned closer. “Is it real?” “No.” Kitsu’s answer came too quickly. “It cannot be.” “That was not a no.” “It is impossible.”",
      "I looked at the scale again. It did not glow. It did not sing. It sat above a bar while a mortal woman below it poured beer into chipped mugs and shouted at a man to stop licking the dice. “Perhaps it is a replica,” I said. Kitsu’s eyes did not leave it. “Perhaps.” Marok brightened. “Excellent. Then we should enjoy ourselves.” “That is not what perhaps means.”",
      "But Marok was already moving. A mortal woman with copper hair and three necklaces appeared in front of us as though summoned by foolishness. “First time at the Bell?” she asked. Marok tried to open his mouth to say something stupid. Kitsu spoke too fast: “No.” I said, “Yes.” Marok said, “Tragically undercelebrated until now.”",
      "The woman looked between us, decided we were pretty enough to tolerate, and slapped three small clay cups onto a nearby table. Amber liquid sloshed over the rims. “House welcome,” she said. “Drink, dance, just don’t bleed on the floor. Okay?”",
      "Kitsu stared at the cups as if one had confessed to murder. Marok lifted his immediately. “To mortal customs!” “To limited censure,” I said, because apparently my mouth had survived the transformation with all its worst impulses intact.",
      "Kitsu did not drink. Marok did. His expression changed. First delight. Then alarm. Then delight again, but more reckless. “Oh,” he said. I sniffed my cup. It smelled like honey, smoke, and regret. “Absolutely not,” Kitsu said. I drank.",
      "The liquid hit my tongue like a slap wearing perfume. My eyes watered. Heat traveled down my throat and bloomed in my stomach, shocking enough that I nearly laughed. Marok watched me with wicked approval. “Well?” he asked. “Disgusting,” I said. Then I drank again.",
      "Kitsu took the cup from my hand. I stared at him. He stared back. “Balance,” he said. “Possession,” I replied. His eyes sharpened. Then, very deliberately, he released the cup and folded his hands behind his back. “My apology.” That should not have pleased me, but it truly did.",
      "Marok, who had finished his drink and possibly part of his common sense, leaned toward me. “Dance with me.” “No,” I said, bright and pleasant as a door closing. “You don’t know what I’m asking,” Marok replied. I smiled. “I have been told that before. It ended in bloodshed.” Marok’s grin flashed. “And yet your hair looks magnificent.” I lifted my chin. “That has nothing to do with you.” “Most miracles don’t,” Marok said, sighing. Kitsu made a soft, pained sound.",
      "The music quickened. Bodies spun. A pair of mortal women turned beneath joined hands, skirts flaring like flowers caught in a storm. No one bowed. No one asked permission from a god. No one seemed arranged. They simply moved because the music had asked them to, and their bodies had answered. I looked away too late. Marok saw. Of course he did. “One dance,” he said, and this time his voice had less tease in it. “No debt. Just gravity.” That word should have been harmless. It was not.",
      "“Do not let him twirl you near any furniture,” Kitsu warned. I shrieked, then brought the back of my hand up to muffle my smile — and feigned innocence the way my goddess taught me to. Marok offered me his hand. “Do let me twirl you near everything else.” I took his hand because refusing would have looked like fear. Also because I wanted to.",
      "The second Marok drew me into the crush of bodies, the room changed. Heat pressed close from every side. Music climbed into my knees. My bare feet slid on spilled drink and sawdust. I stumbled immediately. Marok caught me by the waist. A warmth bloomed in my chest. His fingers splayed warm against the rose-colored fabric of my gown. I looked down at it. He did not move.",
      "“Too much?” he asked, his thick, hunter-green brows knitting together. The question was quiet enough that I almost missed it beneath the fiddle. That was what made it dangerous. “No,” I said. His smile returned, but softer at the edges. “Then stop thinking like you still have four paws.” “I miss the paws,” I whispered. “You do have excellent paws,” Marok flirted. “Do not flatter my lost paws,” I warned, smiling. “I would never disrespect them by lying!” Marok exclaimed. I laughed before I could stop myself.",
      "Marok moved. I had expected chaotic dancing — with him, one expected chaos the way one expected rain from a black cloud. But his body knew the rhythm. Not perfectly. Not politely. Joyfully. He turned me under his arm, caught me when I came back, and stepped just close enough that the next breath had to negotiate between us. This was what mortals meant by dancing. Not steps. Not music. Argument.",
      "His hand at my waist said stay. My hand on his shoulder said do not presume. His grin said too late. My glare said try me. Around us, the Ninth Bell roared. Marok spun me again, and for one wild moment I forgot I was owned. I forgot the God of Beauty’s hand on my neck. I forgot the scale above the bar and the silver fox in the mirror and the city’s rot beneath its perfume. There was only warm, mortal skin. Music. Gravity. And Marok’s voice near my ear. “There you are.”",
      "I should have stepped back. I did not. Across the room, Kitsu watched us. He had not touched his drink. Of course he had not. He stood beside the table like a judgment waiting for evidence, eyes following every turn, every stumble, every place Marok’s hand almost moved and did not.",
      "The song ended with a crash of drum and shouting. I was breathing too fast. Marok was too. Good. Then Kitsu appeared at the edge of the dance floor. “I require one dance,” he said. Marok coughed. “Require? That’s your line, bro?” Kitsu looked at him. “Yes, bro.” “With her?” Marok asked. Kitsu growled. “With Jem.”",
      "Hearing my name in his voice did something unacceptable to the air. Marok’s smile sharpened, but he released me. “Careful, Golden Boy. People might think you’re enjoying yourself.” Kitsu bowed low to me, eyes fixed on Marok. “I would never be so irresponsible.” Then he offered me his hand. Not palm up, like Marok. Palm inward. A choice I could step into or refuse. That was somehow worse.",
      "I took it. Kitsu’s fingers closed around mine with restrained precision, as though he had calculated exactly how much contact was useful and stopped one breath before dangerous. The musicians began another song, slower this time. Of course they did. Kitsu led as if law had been given a body. No flourish. No wasted pressure. His hand settled at my back, not my waist, and the restraint of it made me far more aware of everywhere he was not touching me.",
      "“You dance well for someone who disapproves of motion,” I said. Kitsu placed his lips near my ear. “I disapprove of unnecessary risk.” A chill ran down my spine, but I batted my eyelashes. “Is this necessary?” His gaze flicked to Marok, then back to me. “Clarifying.” “Clarifying what?” “That you are capable of wanting danger without surrendering to it.”",
      "My breath caught. The mortal room blurred around him. His eyes were still amber, still severe, but there was heat beneath the severity. Contained, not absent. A flame hidden behind temple doors. “And you?” I asked. His jaw tightened. The song pulled us closer by half an inch. Only half. My new human body noticed as if it were a scandal. “I am capable of wanting many things,” Kitsu said. “That does not make them lawful.” “No,” I said. “Only honest.”",
      "For the first time since I had known him, Kitsu missed a step. Barely. Enough that his hand pressed more firmly at my back. Enough that Marok, watching from the table with his second cup halfway to his mouth, noticed and stopped smiling. Kitsu recovered immediately. Naturally. The song ended. He released me at once, but the place where his hand had been remained warm. “Observed,” I said, because I was cruel and curious and perhaps the amber drink had been stronger than advertised. Kitsu’s eyes darkened.",
      "Marok laughed too loudly from the table. “You think you’re so cool, Golden Boy?” I returned to them with as much dignity as a barefoot woman in a too-thin gown could manage. Marok had acquired another cup. No one had given it to him. This was concerning. “How many have you had?” Kitsu asked. Marok looked into the cup as if the answer might be swimming there. “This one? One.” “That is not what I asked,” Kitsu growled. Marok’s eyes narrowed into slits. “Then ask better questions.”",
      "I took the cup from him and sniffed it. Fire. “This smells like lantern oil,” I said, pinching the bridge of my nose. “And it tastes like courage,” Marok whispered, lips near my ear. “It tastes like theft,” said a voice behind us. The copper-haired woman from earlier plucked the cup from my hand. “You three have coin?”",
      "We stared at her. Ah. Coin. A mortal custom requiring preparation, which none of us had done, because the gods did not pay assistants to be scandalous. Marok patted his borrowed coat and produced, to everyone’s surprise, three black pearls, a button shaped like a skull, and a small green flame hovering above his palm. Kitsu slapped his hand shut. “No immortal displays,” he hissed. The copper-haired woman narrowed her eyes. “Is that a trick?” “Yes,” I blurted. “No,” Marok said. “Bad one,” Kitsu added.",
      "I mesmerized the woman with every ounce of power I had spent centuries pretending not to wield. “Forgive us. We are very new to being irresponsible.” Her expression softened despite itself. I could feel my goddess’s hand on the back of my neck. I hated using it. I hated more that it worked. “It’s all right,” she said, smiling. “Dance debt, then. One of you helps clean at close.” Kitsu immediately said, “I accept.” Marok immediately said, “He accepts.” I immediately said, “No one is staying until close. We leave before dawn.”",
      "At that exact moment, the golden scale above the bar chimed. Not loudly. Not enough for the mortals to notice over the music, but the sound slipped through me like a needle through silk. Kitsu turned first. The smoky glass case had cracked. A single line split it from top to bottom. Inside, the scale trembled. Marok blinked at it with alcohol-bright eyes. “That is definitely not a replica.” “No,” Kitsu said. The word had lost all irritation. Now it was fear.",
      "The room seemed to tilt toward the artifact. Mortals kept drinking. Kept laughing. Kept dancing beneath a divine instrument that could halt a Judgment, as unaware as flowers growing over a grave. A flash of silver moved in the mirror behind the bar. My breath caught. A fox tail. Pale as old moonlight. Then gone.",
      "“Did you see—” I began. Marok was already moving. “Don’t,” Kitsu snapped. Marok climbed onto the bar. The copper-haired woman shouted. Someone cheered. Someone else threw a peanut at him. “Marok,” I said, but my voice vanished under the drum. He turned back to me from the bar, grinning like a fool with his heart showing through the cracks. “One impressive thing, Jem. Then we leave.”",
      "“I am not impressed by theft.” “Borrowing.” “I am not impressed by borrowing from glass cases either.” Kitsu shoved through the crowd. “Put one hand on that case and I will break it for you.” Marok’s grin faltered. “You are very possessive of objects for a man who claims to worship justice.” Kitsu snarled. “That is Heba’s Scale of Judgment.”",
      "The words hit the room and should have shattered it. They did not. The mortals heard nothing sacred in them. They only laughed and danced, because mortals did not know when they stood at the edge of divine ruin. Marok looked back at the scale. His expression changed. For one breath, he looked sober. Then the case opened by itself. No one touched it. The smoky glass simply swung outward, inviting. Silver flickered in the mirror again. A mouth opening without sound.",
      "My stomach dropped. “Marok,” I said. “Get down.” But Marok had already reached for the scale. His fingers closed around the blackened-gold beam. Green light sparked once under his skin. Kitsu lunged. “No!” Marok twisted away, half laughing, half startled. “I have it.” “You should not have it!” Kitsu declared. Marok whined. “I know that now!” Kitsu seized the other end of the scale. The two of them froze on the bar, War and Justice in borrowed flesh, each gripping one side of a thing neither mortal nor fox should have been touching.",
      "The scale began to glow. Gold at Kitsu’s hand. Green at Marok’s. Then rose-pink along the center, answering me though I had not moved. Every glass in the tavern rang. Mortals stopped dancing. The copper-haired woman whispered a prayer.",
      "“Kitsu,” I said carefully. His eyes did not leave the scale. “Let go, Marok.” “You let go!” Marok growled. “You are intoxicated,” Kitsu said. “You are insufferable!” Marok snarled. Kitsu tugged. “You are endangering the court.” Marok tugged harder. “You are always the court!” The words tore out of Marok with more force than he seemed to expect. Kitsu flinched. Only a little. Enough.",
      "The scale screamed. Not aloud. Inside the bones. I climbed onto the nearest chair, reaching for them both. “Stop.” The silver fox appeared in the mirror behind the bar. Clear now. Smiling. They lifted one pale paw and pressed it to the glass. The scale cracked.",
      "A line of white light split the beam down the middle. For one impossible moment, the room held its breath. Then the Scale of Judgment broke in half. The blast threw every lantern sideways. Gold fire burst from one half. Green fire from the other. Rose light flashed between them, and all the mirrors in the Ninth Bell went black. Marok fell from the bar. Kitsu hit the floor on one knee. I landed hard against a table, the taste of copper blooming in my mouth.",
      "The two halves of the Scale hovered above us. One turned toward the east-facing windows. The other tilted toward the cellar door behind the bar. “No,” Kitsu whispered. The halves vanished. Not fell. Not flew. Vanished — pulled through the city by two invisible hands.",
      "The music had stopped. Every mortal in the Ninth Bell stared at us. Marok looked at his empty hands. For once, he did not smile. Kitsu looked at me, and whatever law he had been holding inside himself had gone pale with horror. Above the tavern, far beyond brick and smoke and mortal weather, a bell began to ring. Not the tavern bell. Not the ninth. The true one. It rolled through my borrowed bones, and somewhere inside the dark, the silver-tailed fox laughed without making a sound."
    ],
    "scenes": [
      {
        "after": 11,
        "src": "/a-court-of-foxes/assets/ch3-outside.png",
        "alt": "Outside the Ninth Bell — the sign, the three of them",
        "caption": "The sign has always been there. They only just found it."
      },
      {
        "after": 15,
        "src": "/a-court-of-foxes/assets/ch3-scale-glows.png",
        "alt": "The Scale of Judgment glowing above the bar",
        "caption": "That should not be here."
      },
      {
        "after": 17,
        "src": "/a-court-of-foxes/assets/ch3-bar.png",
        "alt": "Inside the Ninth Bell — bar, scale, the three of them",
        "caption": "The Ninth Bell at full roar — scale above, mortals below."
      },
      {
        "after": 28,
        "src": "/a-court-of-foxes/assets/ch3-dance1.png",
        "alt": "Jem and Marok — first dance",
        "caption": "The floor asked. Her body answered."
      },
      {
        "after": 32,
        "src": "/a-court-of-foxes/assets/ch3-dance-video.mp4",
        "alt": "Not steps. Not music. Argument.",
        "caption": "Not steps. Not music. Argument.",
        "video": true
      },
      {
        "after": 33,
        "src": "/a-court-of-foxes/assets/ch3-dance3.png",
        "alt": "Jem and Marok — close",
        "caption": "He watched every place Marok’s hand almost moved and did not."
      },
      {
        "after": 36,
        "src": "/a-court-of-foxes/assets/ch3-kitsu-dance1.png",
        "alt": "Kitsu and Jem — the first hold",
        "caption": "Law had been given a body. It did not know what to do with that."
      },
      {
        "after": 38,
        "src": "/a-court-of-foxes/assets/ch3-kitsu-dance2.png",
        "alt": "Kitsu and Jem — the dip",
        "caption": "Half an inch. Only half. Her body noticed as if it were a scandal."
      },
      {
        "after": 39,
        "src": "/a-court-of-foxes/assets/ch3-kitsu-dance-video.mp4",
        "alt": "Observed.",
        "caption": "Observed.",
        "video": true
      },
      {
        "after": 45,
        "src": "/a-court-of-foxes/assets/ch3-fox-mirror.png",
        "alt": "The silver fox in the mirror — paw to glass",
        "caption": "Pale as old moonlight. Then gone."
      },
      {
        "after": 49,
        "src": "/a-court-of-foxes/assets/ch3-fight-scale.png",
        "alt": "Kitsu and Marok each gripping the scale, Jem reaching up",
        "caption": "War and Justice. Each gripping one end. Neither should have touched it."
      },
      {
        "after": 53,
        "src": "/a-court-of-foxes/assets/ch3-scale-explodes.png",
        "alt": "The scale breaking — the blast",
        "caption": "Gold fire. Green fire. Rose light. Then nothing."
      },
      {
        "after": 54,
        "src": "/a-court-of-foxes/assets/ch3-aftermath.png",
        "alt": "The aftermath — Kitsu, Marok, Jem on the tavern floor",
        "caption": "Marok stared at his empty hands. For once, he did not smile."
      }
    ]
  },
  {
    "number": "04",
    "label": "Chapter Four",
    "title": "The Thread Cut",
    "readTime": "~9 min",
    "question": "What remains when a fox is severed from what named them?",
    "hero": "/a-court-of-foxes/assets/ch4-hero.png",
    "heroAlt": "Jem, Marok, and Kitsu on the tavern floor after the Scale breaks",
    "accent": "green",
    "summary": "All assistant tails across the heavens are severed. Marok knows a name he should not.",
    "hook": "The Tail Market has entered the story, and the gods are no longer the only danger.",
    "body": [
      "The true Bell did not ring above us. It rang through us — through the tavern, the tables, the overturned cups, the shocked mortals with their open mouths and beer-damp hands. It rolled through brick and smoke and glass, through marrow, through memory, through every borrowed inch of my human body. For one breath, no one moved. Then everyone did.",
      "Mortals screamed. A chair toppled. Someone dropped a mug, and the sound of it breaking was so small beneath the Bell that it seemed almost shy. The copper-haired woman backed away from the bar with both hands pressed to her mouth. The musicians stared at their instruments as if the fiddle or the drum might explain why a golden scale had split in half above their heads and vanished into the city like a crime with wings. Marok lay on the floor amid splinters of glass, one arm thrown over his face. Kitsu was still on one knee. I was half under a table, tasting blood and sawdust and my own excellent decisions.",
      "The Bell rang again. My borrowed ribs squeezed around the sound, and something behind my spine answered with a pain so sharp I forgot the tavern, forgot the mortals, forgot even the Scale. My tail. Except I did not have one. My body arched. I slapped a hand over my mouth, but a sound got out anyway. Not a scream. Worse. A broken little thing that made Marok sit up too fast and Kitsu turn his head like a blade drawn from a sheath.",
      "“Jem,” Kitsu said. Then the sound hit him next, and I watched it happen. His expression did not change — of course it did not — but his hands curled against the floor until his knuckles went white. Gold fire flickered once around his fingers and died.",
      "Marok made no attempt to be dignified. He swore loudly enough to make three mortals gasp and one elderly man choke on his sausage. “What is that?” Marok snapped. Kitsu’s jaw worked. “A summons.” “That is not the dawn bell.” “No.” Something cold moved under the word. “It is worse.”",
      "The Bell rang a third time, and the floor vanished. Not truly — unfortunately, the floor remained committed to being a floor — but the pull of the Bell seized us by something deeper than flesh and yanked. It should have drawn us home. That was what summons did. One god. One fox. One thread between them, braided through oath and tail and witness. The Bell found that thread in me. Then it found the thread cut.",
      "Pain burst white. Marok shouted. Kitsu inhaled like he had been stabbed cleanly and had decided not to inconvenience anyone by bleeding. The tavern stretched around us — lanterns smearing into streaks of amber, mortal faces blurring, the cracked mirror behind the bar going black. The last thing I saw before the world tore sideways was the silver-tailed fox in the dark glass, watching me with moon-pale eyes. They smiled. Then the tavern disappeared.",
      "I landed on cold marble. Again. I was beginning to develop feelings about marble, none of them tender. My palms struck first. My knees followed. The impact jarred my teeth together and sent my hair spilling into my mouth. I gagged, shoved it aside, and tried to breathe around the Bell still vibrating inside my bones.",
      "The Mortal Hour chamber had changed. The crescent basins were empty. Not dim. Not drained. Empty. The rose-pink light that had been my tail was gone. The green fire that had been Marok’s was gone. The gold line of Kitsu’s judgment was gone. Above the basins, the silver hooks swayed, clean and bright and innocent as lies. “No,” I said. My voice sounded small in the round chamber.",
      "Marok pushed himself up beside the first basin. His dark green hair hung in his face, and there was blood at his temple, bright against his skin. He looked into the water, and whatever joke he had been reaching for died before it reached his mouth. “Where is it?” he asked. Kitsu stood very slowly. He crossed to the second basin and held his hand over the water without touching it. “The tails were under seal. The chamber itself witnessed surrender. Nothing can remove a surrendered tail before return.” Marok laughed once. It was a terrible sound. “Apparently something can.”",
      "Kitsu turned on him. “You touched the Scale!” Marok flinched as if the words were a hand across his face. “I know,” Marok said. “Do you understand what you touched? The Scale of Judgment is not a toy above a mortal bar. It is the one instrument capable of halting a Judgment once the Bell begins.” “I know that now!” Marok exclaimed. “You knew enough before.” “I was drunk!” “You were warned.” Marok’s eyes flashed green. “By you? You warn everyone. It’s actually your love language.” Kitsu sighed. “Do not make this charming.” “I am not trying to make this charming.”",
      "The chamber went still. For a moment the glittering fool fell away, and underneath him was someone younger. Not in years. In terror. He looked at me, then away. “I thought it was a replica,” he said. “I thought—” “You thought impressing Jem mattered more than listening.” That landed. Hard.",
      "I stood before I meant to. My knees wobbled, but I stayed upright, because rage is an underrated form of balance. “Do not put my name in the place where your blame belongs,” I said. Kitsu’s eyes cut to mine. So did Marok’s. And I hated them both a little at that moment — Kitsu for being right too loudly, Marok for being wrong too beautifully, and myself for being the kind of creature men argued around as though my wanting had caused the weather.",
      "The Bell rang again. The black-glass walls lit from within — not with reflection, but with words. ASSISTANTS SEVERED. The phrase appeared once, then again, then again, multiplying across every wall until there was no darkness left between the letters.",
      "My mouth went dry. Marok backed away from the first basin. “Assistants,” he said. Not us. All of us. One wall cleared. A black mirror opened like an eye, and in it I saw the Celestial Reliquary. Vast and circular, lined with niches of gold and stone, each one holding a vessel for a fox assistant’s tail. Scarlet for the God of Fortune. Cobalt for the God of Love. Green for the God of War. Gold for the God of Justice. Magenta for the God of Beauty. Every niche was open. Every vessel was empty.",
      "Saroka’s scarlet vessel lay cracked on its side. Sindren’s cobalt ribbon of light was gone. My goddess’s magenta vessel stood polished and perfect, hiding its emptiness so beautifully that I nearly missed it. A sound left me that might have been a laugh if it had not been so close to sickness. Kitsu stepped toward the mirror. “No.” The word had no command in it this time. Only grief.",
      "The mask from the Mortal Hour appeared in the glass, its candle-flame eyes guttering low. “Return incomplete.” “No,” Kitsu said. “Return is impossible. There is a difference. The assistant seals are severed. The tails are unaccounted. Our mortal forms are unstable. The Judgment Bell is active.” “Judgment?” I asked. The mask’s eyes turned toward me. I wished they would stop doing that. “Commencement has begun.” “That is not possible,” Kitsu said. “Many impossible things are developing a habit tonight,” Marok muttered.",
      "The mirror flickered. For one heartbeat, the Reliquary vanished and the Celestial Court appeared — gods rising from their thrones in a storm of impossible color, fox assistants moving in panic around them, some crouched low as if something had been ripped from their spines. Saroka flashed past the glass, scarlet ears flattened, no tail behind her. Then the image shattered back to black.",
      "Tails were not ornaments. Mortals thought they were — pretty things, sacred things, charming things to paint on tavern signs with goblets in their paws. They were wrong. A fox’s tail was a memory. Witness. Oath. The place the god’s claim touched the assistant’s will and made something useful, terrible, binding. Without it, I felt wrong. Not only bare. Unmoored. As if someone had reached into the center of me and removed the word that told my body where to end.",
      "My borrowed knees buckled. Marok caught my hand. Kitsu caught my waist. Both moved at once. No one joked. No one accused. For one breath, all three of us touched. Marok’s palm was hot against mine. Kitsu’s hand was steady at my side. My own fingers dug into Marok’s wrist hard enough to hurt him, and he did not pull away. Kitsu’s grip tightened — not possessive, not gentle exactly. Necessary. Rose light sparked once in the space between us. Green answered. Gold followed. The lights braided, thin as threads, then vanished. The pain eased. Not gone. Nothing good was gone tonight. But eased.",
      "Marok stared at our joined hands. Kitsu stared at the place where his hand touched my waist. I stared at both of them and decided I would rather be thrown through another floor than discuss it. “Stabilization is temporary,” the mask said. “Helpful,” I said through my teeth. “Anything else?” The candle-eyes dimmed. “Recover tails. Recover Scale. Halt false commencement.” “False?” Kitsu asked sharply. The mirror shuddered. For a moment, something moved behind the mask. Silver. Pale as old moonlight. Then gone. The mask’s mouth opened wider than it should have been able to. “Recover tails. Recover Scale.” The black mirror cracked. And the message vanished.",
      "Kitsu released me as if the contact had burned him. Marok did not release my hand until I looked at our fingers and lifted one brow. He let go at once. “Temporary stabilization,” he said, because apparently death, theft, and divine catastrophe had not cured him of being unbearable. “That sounds romantic.” “That sounds medical,” Kitsu said. “That sounds like both of you are about to become my second and third least favorite problem,” I said. Marok looked almost pleased. “Only second and third?” “The missing tail is first.” That killed his smile again.",
      "“The Scale broke in two. One half went toward the east-facing windows. One toward the cellar door. Our tails vanished at the same time. That is not a coincidence.” Kitsu’s gaze sharpened. “Scale and witness are bound. A Judgment instrument cannot move without a witness thread. The halves may have followed tail signatures.” “Or carried them,” I said.",
      "Both males looked at me. I turned toward my empty basin. The water should have been clear. It was not. A film floated across the surface, thin and pearlescent, beautiful as crushed petals under ice. Beauty magic. My stomach twisted. I had not cast it. My goddess had made me recognize rot beneath ornament, hunger beneath a smile, bruise beneath silk. And this was glamour used like a bandage over an amputation. I reached toward the basin. Kitsu caught my wrist. “Careful.” The word was quiet. No command. Warning. “You see it,” he said. “I see something pretending to be pretty,” I replied. Marok stepped closer. “That narrows it down to half the heavens.”",
      "The pearlescent film shimmered, and for one heartbeat I saw beneath it: not water, not basin, but a narrow alley packed with cages. Tails hung inside them like trapped fire. Scarlet. Cobalt. Green. Gold. Rose. Then the vision vanished. “I saw cages,” I said. Kitsu went very still. “Where?” “I do not know. An alley. Iron bars. Too much noise. Tails like lanterns.”",
      "“Tail Market,” Marok said. Kitsu turned slowly toward him. The chamber chilled. “What is the Tail Market?” I asked. Marok did not answer. That was how I knew the next problem had arrived. Not with a Bell. Not with a silver fox. With silence. “How do you know that name?” Kitsu’s voice was calm enough to be dangerous. Marok’s eyes met mine first. Wrong choice. Kitsu saw it. “Marok,” Kitsu said.",
      "Outside the chamber — beyond the black door and the old stairs and the Celestial Court above us — the Judgment Bell rang again. This time, no summons came. No mercy either. The tails were gone. The Scale was broken. And the God of War, apparently, had known where trouble kept its address."
    ],
    "scenes": [
      {
        "after": 8,
        "src": "/a-court-of-foxes/assets/ch4-chamber.png",
        "alt": "The Mortal Hour chamber — empty basins, silver hooks",
        "caption": "The silver hooks swayed, clean and bright and innocent as lies."
      },
      {
        "after": 10,
        "src": "/a-court-of-foxes/assets/ch4-argument.png",
        "alt": "Kitsu confronting Marok",
        "caption": "“You warn everyone. It’s actually your love language.”"
      },
      {
        "after": 13,
        "src": "/a-court-of-foxes/assets/ch4-severed.png",
        "alt": "ASSISTANTS SEVERED multiplying across every wall",
        "caption": "The letters burned until there was no darkness left between them."
      },
      {
        "after": 14,
        "src": "/a-court-of-foxes/assets/ch4-reliquary.png",
        "alt": "The Celestial Reliquary — empty niches, cracked vessels",
        "caption": "My goddess always knew how to dress a wound."
      },
      {
        "after": 19,
        "src": "/a-court-of-foxes/assets/ch4-braid.png",
        "alt": "All three touching — rose, green, gold light braiding",
        "caption": "Rose. Green. Gold. Thin as threads. Then gone."
      },
      {
        "after": 24,
        "src": "/a-court-of-foxes/assets/ch4-basin-vision.png",
        "alt": "The basin vision — cages beneath the surface",
        "caption": "Not water. Not basin. Cages. Tails like lanterns."
      }
    ]
  },
  {
    "number": "05",
    "label": "Chapter Five",
    "title": "No Foxes. No Judgment.",
    "readTime": "~10 min",
    "question": "Who benefits when every witness is removed?",
    "hero": "/a-court-of-foxes/assets/ch5-court-mirror.png",
    "heroAlt": "The Celestial Court reflected in a black mirror while fox spirits panic",
    "accent": "gold",
    "summary": "Marok knew. Before Attendance, before the night began. The warning was real.",
    "hook": "Someone inside the court wanted no foxes present. The Tail Market waits.",
    "body": [
      "The chamber smelled like crushed flowers left too long in the rain. My goddess’s magic always announced itself politely before it lied. The power softened the air, smoothed the black glass, and laid a pearlescent film over the empty basins as if theft could become less violent by being made lovely. The water in my basin shimmered rose and magenta, pretty enough to frame, if one had no taste and no respect for amputation.",
      "Kitsu was staring at Marok. Marok was staring at the basin. I was staring at both of them and thinking that if the gods had wanted me obedient, they should not have made me this good at noticing rot. “What is the Tail Market?” I asked again. Marok did not answer.",
      "The Judgment Bell rolled somewhere above us, distant now, but distance did not make it merciful. It trembled through the floor, through the crescent basins, through the place behind my spine where my tail should have been. Kitsu stepped closer to Marok. Not quickly. That would have been less frightening. He moved with the terrible patience of a verdict that had already been written. “Answer her,” he growled.",
      "Marok lifted one hand to the blood at his temple, looked at the red on his fingers, and smiled as if the sight had offended him by being too honest. “It is a market.” “Helpful,” I said. “For tails,” Kitsu added. The words struck the chamber colder than the Bell. “Stolen things. Forbidden things. Pieces of spirit no lawful court would admit can be priced.” “And yet they are,” Marok said.",
      "“The Tail Market is a rumor,” Kitsu said. “A disgrace told by foxes who wish to frighten other foxes into better behavior.” Marok gave a very small laugh. It had no joy in it. “You sound almost convincing.” Kitsu’s calm changed shape. Not broke. Never that. It gathered itself into something narrower. “You know where it is.” “I know where it was.” “That is not denial.” “No,” Marok said. “It is grammar.”",
      "Kitsu’s hand moved. Gold light circled his fingers, thin as wire. The scent of cold parchment and struck bells cut through the rotting flowers. Not a spell, exactly. It was worse than a spell. It was law remembering it had teeth. Marok’s smile faded. “Do not,” he said. Kitsu’s voice lowered. “Then answer without assistance.”",
      "“Enough,” I said. Both males looked at me. Good. I was tired of being the table over which men set their knives. “Kitsu, if you are about to drag the truth out of him, ask the question that matters. Marok, if you are about to avoid the truth, choose a prettier lie. The current one is insulting.”",
      "For once, there was no wink waiting in Marok’s eyes. “The Tail Market was where I was going tonight,” he said. The chamber went so quiet I heard one drop of water fall from an empty hook into an empty basin. “You were going,” Kitsu said, “to a criminal market during a sanctioned Mortal Hour.” “Not for shopping.” “How reassuring.” “I received a warning.” Gold light tightened. “When?” Marok looked at me again. Wrong choice. “Before Attendance,” he said.",
      "Before the court. Before the stairway. Before the borrowed bodies. Before Marok had looked at the eighth exit and made desire sound like a door. My stomach turned, and this time it had nothing to do with human flesh. “What warning?” I asked. Marok looked as if he would rather swallow the hook above his basin. Then he said: “No foxes. No Judgment.”",
      "The black glass behind him flashed white. Words appeared, written in a hand I did not know and yet felt I had seen in a dream. NO FOXES. NO JUDGMENT. The letters burned for one heartbeat, then dissolved into smoke that smelled like wet iron and cheap violets. A market scent. A warning scent. A trap scent.",
      "Kitsu stared at the place where the words had been. “Who sent it?” “I do not know.” The gold wire pulsed. Marok hissed and clutched his wrist. “Truth,” Kitsu said. “I do not know.” Again the gold pulsed. This time Marok did not flinch. The answer held. Kitsu looked almost disappointed.",
      "“You knew there might be danger to the assistants,” I said. “I knew there might be a threat.” “So you told us?” His silence answered first. My hand lifted. I do not remember deciding to raise it. I only remember seeing it there, pale and shaking, suspended between us with all five fingers spread. Marok did not move away. That made it worse. He stood there with blood at his temple and no tail behind him and fear in his eyes, and he looked like he might let me strike him if it gave the moment somewhere to go. I did not. Not because he did not deserve it. Because he would have accepted it, and I refused to become another pretty punishment arranged for someone else’s relief. I lowered my hand. The space between us did not heal. It only learned to stand upright.",
      "“You used my goddess’s command,” I said. “You used my cage as your cover.” “No.” The gold wire snapped bright. Marok sucked in a breath. “I used the allowance as cover. I did not know the God of Beauty would order Jem into it.” The wire dimmed. Truth. Annoyingly. “You wanted to take me,” Kitsu said. “Yes. To keep me away from the court.” “To make you look at the warning before you bury it under procedure.” “I would have reported it.” “Yes,” Marok said. “That was the problem.”",
      "Kitsu went very still. Marok’s voice cracked at the edge and immediately tried to pretend it had not. “If someone inside the court wanted no foxes present for Judgment, then reporting the warning to the court seemed unwise.” “And drinking beneath the Scale of Judgment seemed wise?” “No,” Marok said. No joke. No grin. Just the word. It landed harder that way.",
      "The black mirror above the basins lit again. This time, it showed the Celestial Court. Gods stood in clusters beneath glass pillars, their faces too perfect to hold panic properly. The God of Justice had one hand on a cracked scroll. The God of War’s iron throne stood empty, which was somehow worse than seeing him in it. The God of Love knelt beside Sindren, whose cobalt ears lay flat. Saroka paced in a circle around the God of Fortune’s dais, tailless and furious, scarlet sparks snapping from her paws. Then my goddess appeared.",
      "The God of Beauty stood in front of the mirror as if the catastrophe had been arranged for her complexion. Rose quartz. Magenta light. The lovely tilt of a head that had never needed permission to own a room. Her gaze found me at once. Then the basin beside me. Then the pearlescent film on the water. Every visible assistant looked. Saroka stopped pacing. Sindren lifted one trembling hand to her mouth. My empty spine throbbed. The chamber became very small.",
      "“Beauty magic,” said the God of Justice from the mirror. My goddess’s smile did not move. “Careful.” He looked at me. So did the others. Kitsu stepped half a pace in front of me. I noticed. So did my goddess. I should have disliked it. I did dislike it. I also did not ask him to move. “The glamour on the basin is Beauty-aspected,” Kitsu said, “but Jem did not cast it.” “Can you attest to that under oath?” Kitsu paused. Tiny. Terrible. My heart heard it anyway. “I can attest,” he said carefully, “that she was with us when the tails vanished.”",
      "Not the same answer. My goddess’s magenta eyes slid to me. “Jem, darling.” I hated darling more than I hated marble. “Did you dress the theft?” The question was gentle. It should have come with a knife so at least everyone could admire the honesty. “No, my goddess.” “Did you recognize the dressing?” “Yes.” A murmur moved through the reflected court. Marok stepped forward. Too late, but with heat. “She saw through it. That is different.”",
      "I looked into the mirror and smiled with every cruel, polished lesson my goddess had ever taught me. “Beauty magic can hide rot. It can also expose it. If I were responsible, I would not have left a veil I could see through.” My goddess’s smile sharpened. Pride, perhaps. Possession, certainly. “Clever vixen,” she said. I wanted to bite the word in half.",
      "The God of Justice turned to Kitsu. “Recover the Scale. Recover the tails. The false commencement must be halted before the first mortal verdict locks.” “Authority?” Kitsu asked. The God of Justice lifted the cracked scroll. “Improvised.” Kitsu looked as if someone had handed him a burning coal and called it breakfast. Marok looked delighted for half a second before remembering why delight had been made illegal tonight.",
      "The God of War’s voice came from somewhere off mirror. “Marok.” Marok’s face changed. Not fear. Worse. A son hearing disappointment from a father who had never used the word son. The God of War stepped into view. Iron-dark skin. Eyes green as storm glass. A mouth built for commands rather than comfort. “You will repair what you broke.” Marok bowed his head. “Yes, master.” No cackle. No flourish. Only obedience. I hated that about him.",
      "My goddess’s gaze lingered on me until the last moment. “Try not to become ugly, Jem.” The connection snapped to black. For a few breaths, none of us spoke. Then Marok exhaled. “Well. That was nurturing.” Kitsu looked at him. Marok lifted both hands. “Yes, wrong moment. I heard it as I said it.”",
      "I turned back to the basin. The pearlescent film had thickened. It swirled lazily across the water, smug as cream over poison. Jasmine over spoiled milk. My magic, but not mine. Or near enough to be blamed. “I need to touch it,” I said. “No,” Kitsu and Marok said together. That annoyed me so much I almost smiled. “I was not asking,” I said, batting my lashes. Kitsu’s jaw tightened. “It may be keyed to your power.” “Then it will answer me.” “It may be keyed to hurt you.” I feigned a yawn. “Many things are. I still meet them socially.”",
      "Marok stepped closer, but not close enough to touch. His hand hovered, then fell at his side. Good. He was learning. “Jem,” he said, very quietly. “No debt. No cover. No clever turn of phrase. Tell us what you need.” That was unfair. Decency should not be allowed to arrive after betrayal. It confused the architecture. I looked at the water. “If I fall, catch me.” Kitsu’s answer came immediately. “Yes.” Marok’s came softer. “Always.” I did not look at either of them. I touched the water.",
      "The glamour opened like an eye. The chamber disappeared. Noise struck me first. Not tavern noise. Not laughter or music. This noise was sharper, meaner, made of whispers and cages rattling and coins clinking against teeth. The air smelled of wet iron, burned sugar, cheap violets, and animal fear. I stood in a narrow alley roofed with torn red cloth. Lanterns swung overhead, each one holding a tiny flame shaped like a tail. Iron cages lined the walls. Inside them burned ribbons of spirit-light. Scarlet. Cobalt. Green. Gold. Magenta. My tail glowed in the nearest cage, curled on itself like a sleeping thing pretending not to be terrified.",
      "I tried to reach for it. A hand caught my wrist. Not Kitsu’s. Not Marok’s. Silver fingers, cold as moonlit glass. The silver-tailed fox leaned close from behind a curtain of mirrors. In this vision they were almost human and not human at all, a face made of beautiful wrong angles, eyes pale with old amusement. Their mouth opened. “No foxes,” they whispered. Their breath smelled like extinguished candles. “No Judgment.” I yanked free. The alley shattered.",
      "I came back screaming. Not elegantly. Not prettily. With teeth. Marok caught my hand. Kitsu caught my waist. Rose light sparked between us, sharper this time. Green answered too fast. Gold wrapped around both and held. The braided thread burned for one breath, and the pain behind my spine loosened enough for me to drag air into my lungs. Neither male let go until I nodded. That mattered. I hated that it mattered.",
      "“I saw them,” I said. Kitsu’s voice was low. “The tails?” “Yes.” Marok swallowed. “Where?” “The Tail Market.” His eyes closed for half a heartbeat. Guilt looked wrong on him. Too plain. Too mortal. “Can you lead us there?” Kitsu asked him. Marok opened his eyes. “Yes.” Truth. No gold wire needed.",
      "I stepped between them before Kitsu could choose the sharpest of his lawful things. “We recover one tail first.” “Yours,” Marok said. “No.” Both of them stared. “My tail was nearest in the vision because the glamour wanted me to reach for it. That’s bait.” Kitsu’s expression shifted, calculation returning like armor sliding into place. “Scarlet was unstable in the court mirror.” “Saroka,” I said.",
      "The God of Fortune’s fox. My friend. My girl, if immortals who belonged to gods were allowed such mortal little words. The memory of her scarlet tail lying absent behind her made something hot and ugly rise in my throat. “We find Saroka’s tail first. Then we follow whatever it knows.” Marok nodded at once. Kitsu studied me. “That is a dangerous choice.” “Good,” I said. “I am in the mood to disappoint safety.” Marok’s mouth twitched. Kitsu did not smile, but something in his eyes warmed despite itself.",
      "Then the chamber door opened. No mask. No invitation. Only a slit of black leading into the old stairway, and beyond that, the mortal city that had already bitten us once and would surely be delighted to find us bleeding again. Marok stepped toward it, then stopped. He looked back at me. “For what it is worth,” he said, “I did not want you to be used.” I held his gaze. The kind thing would have been to answer quickly. I was not feeling kind. “No,” I said at last. “You only built a door and hoped I would not be pushed through it.” He absorbed that without flinching. Good.",
      "Kitsu passed him without touching him. “We move.” Marok followed. I took one step after them, then another. My borrowed feet ached. My hair clung to the blood drying near my mouth. My spine felt unfinished. Behind us, the basin’s pretty film sealed itself again. A beautiful lie. Ahead, the stairs descended toward wet iron, cheap violets, and the place where stolen tails burned in cages. Marok had brought us into the night. Now he would have to lead us through its teeth."
    ],
    "scenes": [
      {
        "after": 15,
        "src": "/a-court-of-foxes/assets/ch5-court-mirror.png",
        "alt": "The court mirror — gods, Saroka tailless, the God of Beauty watching Jem",
        "caption": "My goddess never looked directly at what belonged to her. Until now."
      },
      {
        "after": 25,
        "src": "/a-court-of-foxes/assets/ch5-vision.png",
        "alt": "The Tail Market vision — alley, cages, the silver fox",
        "caption": "Silver fingers, cold as moonlit glass. “No foxes. No Judgment.”"
      },
      {
        "after": 31,
        "src": "/a-court-of-foxes/assets/ch5-door.png",
        "alt": "The three of them at the chamber door — heading into the city",
        "caption": "Marok had brought them into the night. Now he would lead them through its teeth."
      }
    ]
  },
  {
    "number": "06",
    "label": "Chapter Six",
    "title": "Fortune Bleeds",
    "readTime": "~15 min",
    "question": "What does Justice become when control cracks?",
    "hero": "/a-court-of-foxes/assets/ch6-tail-market-entrance.png",
    "heroAlt": "Jem, Kitsu, and Marok at the hand-and-eye arch leading into the Tail Market",
    "accent": "rose",
    "summary": "Saroka's scarlet tail is recovered, restored through all three powers, and Fortune names the true trap.",
    "hook": "Beauty. War. Justice. Not all foxes. Them.",
    "body": [
      "The mortal city had teeth, and Marok knew which alley taught them to bite.",
      "That should not have reassured me. It did not.",
      "We descended from the Mortal Hour chamber through the old stairway, past black stone veined with amber light and shadows that smelled faintly of cinnamon gone wrong. The Bell had stopped ringing, which felt less like mercy and more like a god taking a breath before saying something worse.",
      "My spine ached where my tail should have been. Humans were a draft species.",
      "Marok walked ahead, not with his usual swagger. There was a carefulness at the edges now, a glance into every mirror, every dark pane of glass. The silver-tailed fox had trained us quickly. How embarrassing. Kitsu walked behind me, close enough that I knew exactly where he was without looking. That also should not have reassured me. It did not. Mostly.",
      "\"How far?\" Kitsu asked.",
      "\"Far enough to be inconvenient,\" Marok said. \"Not far enough to be comforting.\"",
      "Marok stopped on the next landing. \"You knew this route well enough to lead us in the dark,\" Kitsu said.",
      "\"I know many places in the dark.\"",
      "\"That is not an answer.\"",
      "\"It is the only one I am giving while Jem is bleeding into her own mouth.\"",
      "I blinked.",
      "Kitsu's gaze snapped to me. I touched my lower lip; my fingers came away red. I had bitten myself during the last vision, and apparently my body had decided to make a project of it.",
      "\"I am fine,\" I said.",
      "Kitsu looked at the blood on my fingers. \"That sentence continues to do poor work tonight.\"",
      "The stairway ended before any of us had to decide what to do with that.",
      "The lower door opened without touch, and the city swallowed us a second time. Rain had begun, a cold mist that turned every lantern into a blurred little wound. The air smelled of coal, spoiled fish, and underneath all of it, faint and sweet as a lie under a tongue, cheap violets.",
      "Marok smelled it too. His shoulders went still. \"This way.\"",
      "Kitsu caught my wrist before I followed. Not hard. Not possession. Warning. He released me before I could ask. \"Your balance is still compromised.\"",
      "\"My patience is worse.\"",
      "\"I noticed.\"",
      "\"Of course you did.\" His mouth almost moved. Almost. A terrible development.",
      "We followed Marok through streets that narrowed as if the city were folding itself around a secret. The violet scent strengthened, and wet iron came with it. My stomach remembered the vision and tried to leave before the rest of me.",
      "\"There,\" Marok said.",
      "An arch rose between two leaning buildings, hands painted across its stones, not fox paws, not mortal hands. Too many fingers. Each palm bore a small black eye. Beneath it hung a strip of red cloth, soaked dark by rain.",
      "\"This is warded,\" Kitsu said. \"Against law.\"",
      "\"Mostly against creditors.\" Kitsu gave him a look. Marok sighed. \"Yes. Against law.\"",
      "\"And you intended to enter alone?\"",
      "\"I intended to enter charming.\"",
      "\"That is much worse.\"",
      "I touched the red cloth. It was warm, and the rain slid off it as though the fabric remembered fire more clearly than weather. Something pulsed under my fingers, and a flicker of rose answered inside me, weak and wrong without my tail. The cloth parted.",
      "Marok stared at it. \"I was going to knock.\"",
      "\"With what? Your conscience?\"",
      "\"That has been unavailable since the tavern.\"",
      "I ducked beneath the cloth before either of them could decide to become useful.",
      "The Tail Market was exactly as ugly as its perfume. Lanterns swung overhead, each flame curled into the shape of a tiny tail, and iron cages lined both walls, stacked into shadow. Mortals moved among the stalls, but not only mortals. Every smile knew too much. Beautiful market. Rotten heart. I hated it immediately. The market loved that.",
      "\"No immortal displays,\" Kitsu said. \"No bargains. No names given. No gifts.\"",
      "\"What if the gift is wine?\" Marok asked.",
      "\"Especially wine.\"",
      "We passed a cage of soft blue light, not Sindren's, though it curled against the bars as if it knew me. I kept walking. Scarlet. We needed scarlet. Fortune first, not mine, not the magenta tail nearest in the vision, sleeping in its cage and waiting to make a fool of my wanting. Fortune. Saroka. My girl.",
      "\"Jem,\" Kitsu said quietly. I had stopped walking.",
      "Ahead, beneath a lantern shaped like a bleeding coin, Saroka's tail burned inside a narrow glass cage. Scarlet light. Ember edges. A curl like laughter with a knife behind it. Every few heartbeats it struck the glass, and sparks spilled down the inside like blood pretending to be stars. My throat closed. The vendor guarding it was thin as a bad promise, in a mask made from cracked dice. Each die showed the same number on every side. One. One. One. No chance at all.",
      "\"Pretty,\" he said, stroking the glass. \"Freshly cut. Bites the future whenever it can.\"",
      "I moved. Kitsu caught my wrist. Marok caught my other hand. Both at once. I looked at them, slowly. Kitsu released me first. Marok leaned close enough to murmur, \"If you break his face, let me help.\" That did not calm me. It made me like him, which was worse. I stepped toward him with every lesson the God of Beauty had carved into my spine. \"How much?\"",
      "\"For this? You cannot pay. I do not mean price, little bloom. I mean permission.\"",
      "\"Whose permission?\" Kitsu asked.",
      "\"Justice is not welcome here. War may browse. Beauty may admire. Justice may leave.\"",
      "Marok smiled. Not his bright smile. A war smile. \"War is tired of browsing.\" Green light flickered once beneath his skin. Kitsu's hand snapped out and gripped his wrist. \"No displays.\"",
      "\"He has Saroka's tail.\"",
      "\"And a market full of witnesses.\"",
      "The vendor chuckled. \"Beautiful. Reckless. Lawful. All three cut at the root and still playing yourselves.\"",
      "\"Who gave you that tail?\" I asked.",
      "For one heartbeat, the eyes behind the mask flashed silver. Not violet. Silver. \"A former fox paid in advance.\"",
      "Kitsu inhaled. Marok's fingers curled. I thought of the silver-tailed fox in the mirror, their breath like extinguished candles. No foxes. No Judgment.",
      "\"Then we take the tail,\" I said.",
      "The vendor spread his gloved hands. \"Take what you can keep.\"",
      "The cage opened. Not by key. Not by mercy. It unfolded like a flower made of knives, and Saroka's tail shot out, straight into my chest.",
      "Pain bloomed scarlet. Not mine. Hers. Beauty pulled from the root; Fortune split into every path at once and made each one bleed. I saw Saroka laughing beneath the God of Fortune's throne. Saroka biting a coin in half because it had insulted her. Saroka tailless in the court mirror, furious and afraid.",
      "Then I saw futures. Too many. In one, Kitsu died with gold fire in his mouth. In one, Marok burned green enough to light a city and did not survive the dawn. In one, I stood crowned in magenta flame while the Celestial Court burned behind me, and I was laughing. Or screaming. Or both. I hit the ground. Kitsu caught me before my skull met stone. Marok caught the scarlet tail with both hands. The market screamed, not the vendors, the market itself. Every cage rattled. The dice-masked vendor reeled back, clutching his mask as silver light leaked through its cracks.",
      "\"Run,\" Marok said.",
      "\"Can you stand?\" Kitsu asked. I opened my mouth. Nothing elegant came out.",
      "\"That sounded like no,\" Marok said.",
      "\"I did not ask you,\" Kitsu growled.",
      "\"Her pride answered. Her legs abstained.\"",
      "\"Stop being right,\" I said.",
      "The vendor lunged. Kitsu moved. I had seen Kitsu precisely, seen him angry in the careful way a locked door is angry. I had not seen him violent. He lifted one hand, and gold law snapped across the alley like a whip made of verdicts. The scent of cold parchment and struck bells shattered the violet stink. The vendor slammed into the wall and stayed there, pinned by burning symbols. \"By emergency authority of the God of Justice,\" Kitsu said, calm enough to freeze rain, \"you are detained.\"",
      "Marok stared at him. \"Improvised looks good on you.\"",
      "We ran, or rather, they ran, and I made a heroic contribution by not vomiting on either of them. Marok held Saroka's tail against his chest as if it might break. Kitsu kept one hand at my back, not pushing. Guiding. Something silver moved in every surface we passed. Watching. Always watching.",
      "At the arch, the red cloth dropped in front of us. \"Jem,\" Marok said. I understood before he finished. Beauty opens what beauty recognizes. I reached out, and beneath the crimson surface I saw rot: tiny silver threads stitched through the fabric, each one shaped like a fox tail. A lock disguised as ornament. A beautiful lie. I dug my nails in and pulled. Rose-magenta light tore through, the threads snapping one by one, and the arch opened. We spilled into the rain. Kitsu did not let go until we reached an abandoned shrine between two warehouses, its roof cracked down the middle. Someone had painted a fox over the old saint's mouth. Silver paint. My stomach twisted. Marok set Saroka's tail on the altar as gently as if returning a sleeping child. The scarlet light curled, shivering, trying to remember its shape.",
      "\"We need the Reliquary,\" Kitsu said.",
      "\"We cannot go back through the court,\" Marok replied.",
      "\"Then we use reflection.\" He looked at the cracked basin filled with rainwater. \"Here.\"",
      "\"Nothing about tonight sounds safe,\" I said. \"That is why Kitsu keeps speaking.\" The corner of his mouth almost betrayed him. Almost.",
      "He knelt and touched two fingers to the rainwater, and gold light spread across it, turning every drop into a tiny bell. \"Saroka. Assistant to the God of Fortune. Witness required. Restoration requested under emergency authority.\"",
      "The water went scarlet. Saroka's face appeared in it, and she looked awful, eyes dull, ears flattened, mouth set hard enough to crack.",
      "\"Jem?\" she whispered.",
      "I dropped to my knees. \"You look terrible.\"",
      "\"Romantic of you.\"",
      "\"Do not flirt with me while tailless. It feels unethical.\" Her laugh turned into a gasp, and the tail on the altar convulsed.",
      "\"We have little time,\" Kitsu said. \"Saroka, can you receive it?\"",
      "\"No.\" My heart stopped. Then her mouth twisted. \"But do it anyway.\"",
      "Of course. My girl.",
      "Kitsu looked at me. \"Fortune's thread is unstable. Beauty to reveal the true path. War to force the severed thread open. Justice to bind it without breaking her. Put one hand on the tail, one in the water.\"",
      "Marok knelt opposite me, all green eyes and blood and guilt. \"And me?\"",
      "\"You burn the cage thread when Jem exposes it. Only the cage thread. Do not touch Fortune's.\" The words were too sharp. Marok flinched.",
      "\"Not now,\" I told Kitsu. He closed his eyes for one breath. When he opened them, his voice had softened. \"Can you do that?\"",
      "Marok nodded. \"Yes.\" Truth. No gold wire needed.",
      "I put one hand on Saroka's tail. Scarlet fire licked my palm. I put the other in the rainwater. \"If this goes badly,\" she said, \"tell Sindren I looked exquisite.\"",
      "\"If this goes badly, I will lie better than that.\"",
      "She smiled. Then Kitsu began.",
      "Gold light rose around us in a thin, exact circle. The shrine filled with cold parchment and struck bells, rainwater, and Saroka's magic: clove, copper, and the first breath before dice hit a table. Fortune smelled like a chance that had already cut you.",
      "My sight opened. The scarlet tail was a memory, witness, oath, and a thousand small fortunes Saroka had carried without complaint. Under it all, silver wire wound tight. There. Rot beneath the ornament. I dug my fingers into the light and found the lie. Pain ripped up my arm. I did not scream. I had screamed enough for one chapter. \"Marok.\"",
      "Green fire answered. Not the tavern flame that had grabbed the Scale to make me look. Narrower. Hotter. Honest enough to frighten him. He pressed both hands to the silver wire where my magic exposed it, and war burned without showing off.",
      "The wire shrieked. Saroka screamed. I screamed too. Kitsu's hands closed over mine in the water, gold law pulled, and the braided thread snapped into being between my ribs: rose, green, gold. Sharper than before. Not a comfort this time. A hook.",
      "\"Hold,\" Kitsu commanded. I hated commands. I held.",
      "\"Kitsu,\" I said. His hands tightened around mine. Too hard. Then loosened at once. \"Forgive me,\" he breathed. The apology nearly undid me more than the pain. \"Later. Bind her.\"",
      "Something in his face cracked. Not control. Something beneath it. He was afraid, not of law failing, but of hurting me while keeping it. That was much worse.",
      "The gold circle flickered. Marok swore. \"Kitsu.\"",
      "\"I know.\" His calm was gone. Not shattered. Stripped. Beneath it was heat, bright and severe and too honest to survive daylight.",
      "\"Jem,\" he said, voice low and rough. \"Look at me.\" I did. Stupidly. His eyes were gold enough to hurt. \"I need an anchor.\"",
      "\"You have my hands.\"",
      "\"Not enough.\" My heart stumbled. Marok went very still.",
      "\"I will not take one,\" Kitsu said.",
      "There were a dozen ways to pretend I did not understand. Unfortunately, Beauty had made me excellent at seeing what hid beneath pretty things, and there was nothing hidden here. Only wanting, restrained so tightly it had become pain.",
      "Desire was a door, too. And I had spent too long counting exits to mistake every open one for freedom. So I opened it myself. \"Then ask.\"",
      "Kitsu's breath caught. Marok looked away, not wounded, but as if giving us a privacy the universe had no intention of providing.",
      "Kitsu's voice was barely sound. \"May I kiss you?\"",
      "My hands were burning. Saroka's tail screamed under my palm. The Judgment Bell breathed somewhere above the city. It was a terrible moment for a first kiss. Naturally, it was ours.",
      "\"Yes,\" I replied.",
      "Kitsu kissed me like a law breaking itself on purpose. Soft first. Careful. Then not. Gold light surged through the shrine, clean and terrible. My body forgot pain for one impossible heartbeat and remembered only mouth, rain, breath, and the exact pressure of his hand holding mine beneath the water. He did not take it. He anchored. He asked, and then he held the answer as if it were sacred.",
      "Rose light flared. Green fire roared. The silver wire snapped. In the basin, Saroka arched back with a scream that shook the shrine stones, and her tail tore itself back into being behind her like a banner dragged through war. She collapsed forward, panting, tail burning bright and furious at her back. Kitsu broke the kiss. Too quickly. Of course. He looked at me as if he had committed treason and discovered it tasted like rain. My pride made an alarming number of suggestions, most of them unhelpful.",
      "Marok looked at the shrine roof. \"Well,\" he said hoarsely. \"I am having many complicated feelings.\" I tried to glare at him. It came out almost fond. Unacceptable.",
      "Kitsu released my hands and stood so fast he nearly stumbled. Nearly. I saw it. He turned away, one hand pressed over his mouth as if he could put the kiss back where it came from. That annoyed me more than it should have.",
      "Saroka lifted her head, tail flickering, unstable but whole. For one breath, her eyes went black. Then red. Then full of stars. \"Oh,\" she whispered. Fortune had found her. Or eaten her. With Fortune, the distinction was decorative.",
      "\"Saroka?\" Her gaze fixed on me through the water. Not on Kitsu. Not on Marok. Me. \"Three tails braided,\" she said, in a voice like coins falling into a well with no bottom. \"Rose. Green. Gold. Not bound by gods. Bound by witness.\"",
      "Kitsu turned slowly. Marok's face went blank. \"One court burning. One Bell lying. One Scale split and singing from two graves.\" The rain in the basin began to boil without heat. \"Jem crowned in pink fire.\"",
      "My borrowed lungs forgot their work. Saroka smiled, but it was not kind. It was not cruel either. It was the God of Fortune, who had never cared for the difference. \"The trap is not for all foxes. All foxes are the curtain.\"",
      "\"Then who is it for?\" Kitsu asked.",
      "Her stare moved from him to Marok, then back to me. \"Beauty. War. Justice.\"",
      "The shrine went silent. Even the rain seemed to hold its breath. Then the stars vanished from her eyes, and she sagged against someone I could not see. Sindren's cobalt-marked hands caught her. \"Jem,\" Sindren said, voice shaking. \"What did she see?\"",
      "I looked at Kitsu. He looked pale. I looked at Marok. He looked guilty. \"Trouble,\" I said.",
      "\"That narrows it down to half the heavens,\" Saroka laughed weakly.",
      "The reflection began to fade. \"Stay alive,\" I told her.",
      "\"Bossy.\" Then the water went dark. For a moment, only our three reflections remained in the basin. Pink hair. Green eyes. Gold hands. Too bruised. Too human. Too silent.",
      "Above us, the Judgment Bell rang once. Softly this time. Almost thoughtfully.",
      "\"We need the Scale halves,\" Kitsu said.",
      "\"And the next tail,\" Marok nodded.",
      "I looked at the silver fox painted over the saint's mouth. Rain slid down its muzzle like a secret told too late. Beauty. War. Justice. Not all foxes. Us.",
      "I rose carefully. My legs trembled, but I stayed upright. Rage remained an underrated form of balance, but apparently kisses from Justice were not useless either. I would die before admitting that aloud. Marok offered his hand. Not too close. A choice. Kitsu watched it happen and did not look away. I took it, because refusing would have been rude and because my knees had become theological objections. His fingers closed around mine for one breath, then released. \"No debt,\" he said. Kitsu's mouth tightened. Not anger. Memory. The first real smile I had felt all night tugged at the corner of my mouth. \"Good. Because I am collecting enough of those already.\"",
      "We stepped out into the rain. Behind us, Saroka's restored thread burned briefly in the water, then vanished. Ahead, the city gleamed with wet stone, broken law, and mirrors waiting in every window. Somewhere in that dark, my tail hung in a cage. Somewhere else, a Scale half sang from its grave. And somewhere between them, a silver-tailed fox was watching to see which piece of myself I would reach for first."
    ],
    "scenes": [
      {
        "after": 35,
        "src": "/a-court-of-foxes/assets/ch6-tail-market.png",
        "alt": "Jem, Marok, and Kitsu walking through the Tail Market among cages, masked vendors, and tail-shaped lanterns",
        "caption": "The Tail Market was exactly as ugly as its perfume."
      },
      {
        "after": 41,
        "src": "/a-court-of-foxes/assets/ch6-saroka-tail-cage.png",
        "alt": "Jem held back by Marok and Kitsu before Saroka's scarlet tail burning in a glass cage guarded by a dice-masked vendor",
        "caption": "Scarlet light. Ember edges. A curl like laughter with a knife behind it."
      },
      {
        "after": 57,
        "src": "/a-court-of-foxes/assets/ch6-fortune-vision-strike.png",
        "alt": "Jem struck by Saroka's scarlet tail as Fortune visions show Kitsu, Marok, and Jem in possible futures",
        "caption": "Fortune split into every path at once and made each one bleed."
      },
      {
        "after": 65,
        "src": "/a-court-of-foxes/assets/ch6-kitsu-law-whip.png",
        "alt": "Kitsu casting gold law like a whip at the dice-masked vendor while Jem watches and Marok holds Saroka's scarlet tail",
        "caption": "Gold law snapped across the alley like a whip made of verdicts."
      },
      {
        "after": 90,
        "src": "/a-court-of-foxes/assets/ch6-restoration-ritual.png",
        "alt": "Jem, Kitsu, and Marok performing the restoration ritual around Saroka's scarlet tail and a rainwater basin where Saroka's face appears",
        "caption": "Fortune smelled like clove, copper, and the first breath before dice hit a table."
      },
      {
        "after": 109,
        "src": "/a-court-of-foxes/assets/ch6-kitsu-first-kiss.png",
        "alt": "Kitsu kissing Jem inside a gold ritual circle while Marok turns away with green fire at the shrine",
        "caption": "Kitsu kissed me like a law breaking itself on purpose."
      },
      {
        "after": 118,
        "src": "/a-court-of-foxes/assets/ch6-saroka-prophecy.png",
        "alt": "Jem, Kitsu, and Marok beneath braided rose, green, and gold fox tails as Saroka's prophecy reveals Beauty, War, and Justice",
        "caption": "Beauty. War. Justice."
      }
    ]
  },
  {
    "number": "07",
    "label": "Chapter Seven",
    "title": "The Silvertail Story",
    "readTime": "~14 min",
    "question": "What does desire reveal when the gods refuse to witness themselves?",
    "hero": "/a-court-of-foxes/assets/ch7-rain-city-walk.png",
    "heroAlt": "Jem walking through the rain-slick mortal city between Kitsu and Marok under the distant Judgment Bell",
    "accent": "gold",
    "summary": "Veyr's history is named, the Menagerie is revealed, and the braid between Beauty, War, and Justice answers again.",
    "hook": "The Scale sings where want is bought.",
    "body": [
      "Rain made the city honest. Not clean. Never that.",
      "The mortal streets glistened under the storm, every cobblestone shining as if it had been polished by grief and poor decisions. Smoke sagged from chimneys. Gutters carried wilted flowers, spilled ale, and a thin ribbon of scarlet light that vanished when I looked directly at it. Saroka's restored thread, already gone from the shrine water. Or my imagination developing theatrical tendencies. Both seemed plausible.",
      "We left the abandoned shrine behind us, though its silver-painted fox stayed in my mind with its mouth sealed over the saint's lips. Rain slid cold beneath the collar of my gown. The fabric clung to my borrowed skin with the tender persistence of a bad idea. My feet ached. My ribs hurt. My mouth still remembered Kitsu's. Traitorous mouth.",
      "I touched my lower lip before I could stop myself. Kitsu noticed. Naturally. Marok noticed him noticing, more naturally. No one said anything, which was the worst possible choice, because silence had begun breeding in the space between us.",
      "The Judgment Bell hung somewhere above the clouds, quiet for now. That quiet did not comfort me. Quiet, in my experience, was what catastrophe did while choosing jewelry.",
      "Marok walked to my left, carrying guilt like it had weight. Kitsu walked to my right, carrying law like it had teeth. I walked between them because apparently the universe enjoyed arranging symbolism where my patience used to be.",
      "\"You are shaking,\" Kitsu said.",
      "\"I am expressing disapproval through temperature.\"",
      "\"You are cold.\"",
      "\"I dislike that word. It makes me sound manageable.\"",
      "Marok shrugged out of his coat before either of us could object. The motion was too quick, too practiced, too unlike a joke.",
      "\"No,\" I said.",
      "He held the coat out anyway. It was dark green, rain-soaked at the shoulders, warm from him underneath. War smelled like rain striking hot stone, smoke, and the sort of courage that was mostly panic with better posture.",
      "\"No debt,\" he said.",
      "Kitsu's gaze flicked to him. Marok's mouth tightened. \"No performance either.\"",
      "That was unfair. Decency, again. Arriving late. Tracking mud across the floors.",
      "I took the coat. My fingers brushed his. Green light sparked once between our hands, faint and almost shy. It met the rose ache beneath my skin and vanished before it could become a confession. Kitsu looked away. Also unfair.",
      "I put the coat around my shoulders and immediately hated how much warmer I became.",
      "\"Thank you,\" I said.",
      "Marok blinked as if I had stabbed him politely. \"You are welcome,\" he replied, careful with every word. Kitsu lifted one hand. \"May I?\"",
      "There were many terrible things about the question. The worst was that I understood it before he explained. I glanced at his palm. Gold light gathered there, thin and precise, smelling faintly of cold parchment and struck bells.",
      "\"For warmth?\" I asked.",
      "\"For stabilization.\"",
      "\"Charming.\"",
      "\"For warmth also,\" he admitted.",
      "I should have refused on principle. Principle was one of the few things I still owned outright. Unfortunately, my teeth chose that moment to chatter. Betrayal, from inside my own face.",
      "\"Yes,\" I said.",
      "Kitsu touched two fingers to the edge of Marok's coat where it rested near my throat. Not my skin. The coat. A choice I could step away from. Gold warmth spread through the wet fabric, subtle and careful. It did not burn. It held. The chill eased from my shoulders and left behind the even more annoying sensation of being cared for competently. Rose light answered in my chest. Green flickered from the coat. Gold settled over both. The braided thread appeared for one breath, too fine to touch and too real to dismiss. Then it was gone. Marok stared at the place where it had been. Kitsu dropped his hand as if the fabric had bitten him.",
      "I looked straight ahead. \"If either of you makes that meaningful, I will walk into the river.\"",
      "Marok opened his mouth. Kitsu said, \"Do not.\" Marok closed it. A miracle.",
      "We followed the wet street toward the old district, where the city seemed less built than accumulated. Houses leaned over the lanes, their upper stories nearly touching. Glass windows watched us with dark faces. Every reflection held only rain until I looked away. Then silver moved at the edge. Always at the edge. I was beginning to hate edges.",
      "\"There,\" Kitsu said.",
      "Ahead, at the end of a crooked lane, stood another shrine. Not the abandoned saint from before. This one had been made for the gods. Poor thing.",
      "It was small by divine standards, which meant only large enough to crush a mortal house beneath its shadow. Three steps led to a glass alcove where miniature thrones had once been arranged for travelers to leave offerings. The roof was tiled in blue-black ceramic. Gold script ran along the lintel, faded by weather but still legible.",
      "Gods Watch. Mortals Pray. Spirits Remember.",
      "Someone had ruined it. Not with carelessness. With devotion.",
      "The glass over the shrine had been cracked from the inside. Each miniature throne had been overturned. Offerings lay smashed across the steps: coins split in half, wilted flowers, little carved foxes with their tails snapped off. On the back wall, painted in silver across every god's face, were the words:",
      "LET THE GODS WITNESS THEMSELVES.",
      "The rain went quiet in my ears. Not stopped. Quiet. As if the world had leaned away from the sentence. Marok exhaled through his teeth. \"Veyr.\" Kitsu's face changed. Not surprise. Recognition. Fear, perhaps, if Justice permitted it to enter by the servants' door. The name slid through me cold. \"The Silvertail.\" Marok looked at me. \"You know the story?\"",
      "\"I know a court story. Those are usually warnings wearing perfume.\"",
      "\"This one earned it,\" Kitsu said. The gold in his eyes had gone distant. Not softer. Older.",
      "I stepped under the shrine roof to escape the rain and immediately regretted touching dry ground. The air inside smelled of extinguished candles, old blood, and the sweet powder mortals use to hide decay from guests. Veyr's scent. I knew it now. The silver paint on the wall shone wet though no rain reached it. Marok stayed at the threshold, shoulders hunched beneath the storm. \"Veyr was assistant to the God of Mercy.\"",
      "Kitsu said nothing. Of course he did not. Stories that mattered often made him formal.",
      "\"The God of Mercy had a fox?\" I asked.",
      "\"All gods had one once,\" Kitsu said. \"Before some domains were absorbed. Before Judgment became centralized. Veyr witnessed the petitions no one else wanted to hold.\"",
      "The God of Mercy. A fox made to stand beside her and watch mortals beg. I looked at the snapped wooden foxes on the floor. \"And then?\"",
      "Marok's voice lost its shine. \"Then came the Glasswater Judgment.\"",
      "I knew that name. Everyone knew that name. Not details. The court buried details the way Beauty buried rot: under gold, song, and repetition. Glasswater was a moral. A mistake. A century-sized scar polished until it reflected nothing useful.",
      "Kitsu crouched beside one of the broken offerings. He did not touch it. \"A mortal city petitioned the heavens to delay their verdict. Plague, famine, civil war. Their witnesses conflicted. The God of Mercy argued for postponement.\"",
      "\"And Judgment refused?\" I asked.",
      "\"The Scale required a fox witness.\"",
      "Marok's mouth twisted. \"Veyr pledged that the God of Mercy would hold the verdict long enough for the city to heal.\"",
      "The shrine's silver words seemed to brighten.",
      "LET THE GODS WITNESS THEMSELVES.",
      "\"What happened?\" I asked, although I could feel the shape of the answer in the air.",
      "Kitsu looked at the cracked glass. \"The pledge failed.\"",
      "\"That is not an answer.\"",
      "\"No,\" he said. \"It is the part the court lets us say.\"",
      "Marok rubbed one hand over his face. Rainwater and blood smeared together at his temple. \"The city drowned in its own river during commencement. The God of Mercy screamed herself voiceless. Veyr's tail turned silver overnight. Then he vanished.\"",
      "\"Vanished,\" I repeated.",
      "\"Exiled,\" Kitsu said.",
      "Marok looked at him. Kitsu did not look back. \"Unofficially.\"",
      "Ah. One of those words the divine loved so much. Unofficial. Regrettable. Necessary. Translation: someone suffered and no one wanted fingerprints.",
      "\"And now he steals fox tails and breaks the Scale,\" I said.",
      "\"He believes no foxes means no Judgment,\" Kitsu said.",
      "Marok stared at the silver sentence. \"He believes if the gods have no witnesses, they will finally have to watch themselves. The shrine felt smaller. The air moved cold against my neck, though Kitsu's warmth still held in the coat. Villain, then. Warning, also. How inconvenient. I hated when monsters had reasons. It made the knife messy. A shard of mirror lay among the broken offerings. In it, my face appeared pale and rain-damp. Pink hair clung to my cheeks. My magenta eyes were too bright. Marok's coat around my shoulders. Kitsu's gold warmth at my throat. Behind me, Veyr appeared. Not fully. Never fully. Silver tail. Pale eyes. A smile like a door opening under water. I did not turn. Finally, I was learning.",
      "\"What do you want?\" I asked the mirror.",
      "Marok and Kitsu went still. The reflection smiled wider. No sound came from the shrine. Then silver light crawled across the mirror's surface, writing itself one letter at a time. The letters smelled of extinguished candles and cheap violets.",
      "THE SCALE SINGS WHERE WANT IS BOUGHT.",
      "The mirror cracked. Not shattered. Cracked exactly down the center, splitting my reflection into two almost-Jems who both looked unimpressed and terrified.",
      "\"Where want is bought,\" Marok said.",
      "Kitsu stood. \"A pleasure house.\"",
      "\"Many things are bought in this city,\" I said.",
      "\"Not like that.\" Marok's voice had gone tight. \"The Velvet Menagerie.\"",
      "Kitsu turned to him. \"You know it.\"",
      "\"I know of it.\"",
      "\"That distinction is becoming very tiresome.\"",
      "Marok's jaw moved once. \"It is not a brothel. Not only. It’s a house of reflected desire. Mortals go there to see what they want. Spirits go there to sell the admission back.\"",
      "\"That sounds horrifying,\" I said.",
      "Marok looked at me. \"It is popular.\"",
      "\"Those are rarely opposites.\"",
      "Kitsu's gaze cut to the broken shrine. \"If a Scale half is there, Veyr placed it deliberately.\"",
      "\"To tempt us?\" Marok asked.",
      "\"To measure us.\"",
      "I laughed once. It was not pretty. The sound bounced against the cracked glass and came back thinner. \"Excellent. I was hoping the night would develop opinions about my private humiliations.\"",
      "Marok stepped closer. Not too close. He was learning still, which remained unsettling. \"Jem.\"",
      "\"No.\"",
      "\"You do not know what I was going to say.\"",
      "\"I know it involved concern. I am not accepting new concerns until my previous concerns have been processed by staff.\"",
      "Kitsu looked at me. \"You are exhausted.\"",
      "\"I am radiant.\"",
      "\"You are bleeding again.\"",
      "I touched my lip. Red. Again. Truly, this body was committed to drama.",
      "Marok's coat tightened around my shoulders as I pulled it closer. \"I am not going into a house of reflected desire with both of you while looking like I lost an argument with a staircase.\"",
      "Marok blinked. \"That is your objection?\"",
      "\"It is the objection I am currently making aloud.\"",
      "Kitsu stepped in front of me. Slowly. A choice I could refuse by moving away. He lifted a hand, stopped halfway, and waited. The rain struck the shrine roof. Silver paint shone behind him. Marok watched without smiling. Consent had become the strangest ritual of the night. More sacred than the court. More honest than the gods.",
      "\"Yes,\" I said, annoyed by how softly the word came.",
      "Kitsu touched his thumb beneath my lower lip. A brief touch. Barely there. Gold warmth closed over the split skin. Cold parchment. Struck bells. Restraint sharp enough to draw blood without meaning to. His eyes flicked to my mouth. Then away. Too quickly. Of course. My own mouth remembered his and became unbearable.",
      "\"There,\" he said.",
      "\"Fixed?\"",
      "\"Closed.\"",
      "\"That is not the same.\"",
      "\"No,\" he said. \"It is not.\"",
      "The words should not have meant anything. They did.",
      "Marok looked at the ruined thrones as if giving us privacy by choosing the ugliest possible object to admire. \"Veyr wants us emotionally compromised before the Menagerie.\"",
      "\"Late,\" I said.",
      "Marok's gaze returned. His smile was small, tired, and too sincere for my comfort. \"Yes.\"",
      "The Judgment Bell rang once above the city. Soft. Almost amused.",
      "Silver paint slid down the shrine wall in thin threads, gathering beneath the message. It pooled around the broken wooden foxes and revealed something hidden beneath the offerings: a strip of black velvet tied around a tiny gold key. Marok did not touch it. Kitsu did not touch it. Progress all around. I crouched. The key was warm, and the velvet smelled of honey, smoke, and regret beneath the violets. Pleasure dressed as an invitation. Desire dressed as a door. Etched along the key's side was a fox tail curled into a question mark.",
      "\"The Velvet Menagerie,\" Marok said.",
      "Kitsu's face hardened. \"We cannot avoid it.\"",
      "\"No,\" I said, wrapping the key in the velvet and slipping it into Marok's coat pocket because apparently I owned the pocket now. \"But we can avoid being stupid about it.\"",
      "Marok inhaled. Kitsu looked directly at him. Both of them said nothing. Astonishing.",
      "I stood too fast. The shrine tilted. My knees filed a brief objection. Marok caught my elbow. Kitsu caught the coat on my back. Both at once. Neither tightened. Neither claimed. They held until I found the ground again. Rose light sparked under my skin. Green answered from Marok's hand. Gold from Kitsu's. For one breath, the braid wound through us, fragile and stubborn as a thread pulled through a needle in the dark. I did not pull away. Neither did they.",
      "Rain hammered the roof. The silver words watched us. Somewhere in the city, a pleasure house waited to show us the shape of wanting.",
      "I had spent eternity being arranged by Beauty. I had spent one night learning that desire could open like a trap. Now I stood between War and Justice, wearing War's coat warmed by Justice's hand, and tried very hard not to think about how safe that felt. Failure, apparently, was contagious. \"Lead,\" Kitsu said to Marok. Marok looked at me first. Not for permission, exactly. For witness. That was worse. Better. Both. I nodded once. Marok stepped back into the rain. \"The Menagerie is three streets west and one bad decision down.\"",
      "\"Only one?\" I asked.",
      "He glanced over his shoulder. \"I am trying to be optimistic.\"",
      "Kitsu passed beneath the ruined refrain without looking up.",
      "Gods Watch. Mortals Pray. Spirits Remember.",
      "Behind us, the defaced shrine dripped silver into the gutter. Ahead, the city opened its wet mouth and waited. We followed the key toward velvet, want, and whatever part of us Veyr expected to break next."
    ],
    "scenes": [
      {
        "after": 27,
        "src": "/a-court-of-foxes/assets/ch7-marok-coat-kitsu-warmth.png",
        "alt": "Marok's dark green coat around Jem while Kitsu warms it with gold magic and rose, green, and gold light answer between them",
        "caption": "Rose light answered in my chest. Green flickered from the coat. Gold settled over both."
      },
      {
        "after": 37,
        "src": "/a-court-of-foxes/assets/ch7-ruined-god-shrine.png",
        "alt": "Jem, Kitsu, and Marok standing in the rain before a ruined god shrine with broken fox offerings and overturned thrones",
        "caption": "Someone had ruined it. Not with carelessness. With devotion."
      },
      {
        "after": 58,
        "src": "/a-court-of-foxes/assets/ch7-glasswater-judgment.png",
        "alt": "The Glasswater Judgment vision with a white fox witness, the God of Mercy, drowning mortal city, and distant heavenly court",
        "caption": "The city drowned in its own river during commencement."
      },
      {
        "after": 65,
        "src": "/a-court-of-foxes/assets/ch7-veyr-mirror-shard.png",
        "alt": "Jem holding a mirror shard where Veyr's pale silver face appears while Kitsu and Marok watch in the ruined shrine",
        "caption": "Silver tail. Pale eyes. A smile like a door opening under water."
      },
      {
        "after": 98,
        "src": "/a-court-of-foxes/assets/ch7-kitsu-heals-lip.png",
        "alt": "Kitsu touching Jem's lower lip with gold healing light while Marok watches from the ruined shrine",
        "caption": "Gold warmth closed over the split skin."
      },
      {
        "after": 109,
        "src": "/a-court-of-foxes/assets/ch7-menagerie-key.png",
        "alt": "A tiny gold key tied with black velvet among broken fox offerings, coins, violets, and rain-slick shrine debris",
        "caption": "Pleasure dressed as an invitation. Desire dressed as a door."
      }
    ]
  },
  {
    "number": "08",
    "label": "Chapter Eight",
    "title": "The Velvet Menagerie",
    "readTime": "~12 min",
    "question": "What does want reveal when the mirror finally answers?",
    "hero": "/a-court-of-foxes/assets/ch8-velvet-menagerie-exterior.png",
    "heroAlt": "Jem, Marok, and Kitsu standing in the rain before the red-curtained Velvet Menagerie",
    "accent": "green",
    "summary": "The Menagerie reflects want, Marok's stolen tail burns inside mirrored desire, and the first Scale half answers in Kitsu's hand.",
    "hook": "Somewhere behind the mirror, a broken half of the Scale begins to sing.",
    "body": [
      "The Velvet Menagerie did not stand at the end of the street. It waited there. The building leaned between two rain-black warehouses, too narrow for the amount of music breathing through its walls. Red velvet curtains covered every window. Gold foxes had been carved into the lintel, each one facing a different direction, each mouth open around a tiny mirror. No sign named the place. Desire, apparently, preferred not to file paperwork.",
      "Marok stopped three steps away. Kitsu noticed. I noticed Kitsu noticing. Naturally, Marok noticed both of us and looked tired enough to become sincere by accident.",
      "\"The Menagerie reflects want,\" Marok said. \"Not truth. Want. There is a difference.\"",
      "\"Comforting,\" I said.",
      "\"It will show you the shape of whatever you refuse to say.\"",
      "\"My list is long.\"",
      "\"It is also arrogant.\"",
      "\"Thank you.\"",
      "\"That was not admiration.\"",
      "\"It sounded correctly dressed.\"",
      "Kitsu's gaze stayed on the curtained windows. \"No bargains. No names. No private rooms unless all three of us enter together.\"",
      "Marok's mouth twitched. \"Justice in a pleasure house. I may recover from tonight after all.\"",
      "Kitsu looked at him. Marok lifted both hands. \"Wrong moment. I heard it as I said it.\"",
      "I pulled his coat tighter around my shoulders and withdrew the gold key from its pocket. The velvet strip around it had warmed against my palm. Honey, smoke, regret, and something sweeter underneath — want pretending to be welcome. A beautiful lie. The key turned in the door before I touched the lock. Of course it did.",
      "Inside, the Menagerie glowed like a secret told under silk. The foyer was round, paneled in dark wood and mirror-glass. Velvet draped the walls in crimson folds. Lanterns floated overhead, their flames pink at the center and green at the edges, as if Beauty and War had been made into decoration without either of them consenting. The floor was black marble veined with gold. I hated it immediately, partly because it was beautiful.",
      "A woman waited beneath a chandelier of glass roses. No. Not a woman. A spirit wearing a woman's shape with too much skill. Her smile was perfect. Her eyes were not. They reflected us as we wished to be seen. Marok brighter. Kitsu unburdened. Me untouched. Cruel place.",
      "\"Three guests,\" she said. \"One key. One question.\"",
      "\"We are not here to buy anything,\" Kitsu said.",
      "The hostess smiled. \"Everyone says that before they pay.\"",
      "\"I prefer clarity,\" Kitsu replied.",
      "\"I prefer honesty. We will both be disappointed.\"",
      "Marok stepped half a pace ahead of me. Not shielding. Not quite. \"We are looking for something stolen.\" The hostess's eyes slid to him. \"So are most who enter.\"",
      "\"My tail,\" he said. No joke. No grin. The Menagerie listened.",
      "The velvet walls seemed to lean closer. Somewhere deeper in the house, a violin sighed into a chord so low it felt touched rather than heard. The hostess lifted one jeweled hand. \"War wants what War lost. Justice wants what was taken. Beauty wants—\"",
      "\"Careful,\" I warned.",
      "Her smile widened. For a heartbeat, her reflection behind her had a silver tail. Then only velvet. \"This way,\" she said. We followed her through a hallway lined with mirrors. Each one showed a room that was not there. Mortals feasting at tables loaded with impossible fruit. A man was kneeling while a woman crowned him with roses. A girl dancing with her dead mother. A king weeping into a dog's fur. Want, want, want, dressed in silk, grief, hunger, and theater. Then the mirrors began showing me. Me on my goddess's throne, my magenta tail restored and longer than law allowed. Me with mortals kneeling at my feet, their faces lifted in adoration. Me between Marok and Kitsu, both of them looking at me as if I were not owned by anyone and still somehow worth worshipping.",
      "I stopped walking. Bad body. Worse heart.",
      "The mirror-Jem smiled. She was not trapped. That was the temptation. Not possession in chains. Possession disguised as choosing the cage myself. Every eye on her. Every hand offered. Every want arranged around her like flowers around an altar. I hated how beautiful it looked.",
      "Kitsu's voice came softly. \"Jem?\" Marok did not touch me. Neither did Kitsu. Good. Wretchedly good. I looked away from the mirror, and the version of myself inside it kept smiling without me.",
      "\"I am fine,\" I said.",
      "Marok winced. \"That sentence is developing a reputation.\"",
      "\"I can live with being unreliable.\"",
      "Marok licked his lips. \"That is not what I meant.\"",
      "\"No,\" I said. \"But it is what I heard.\"",
      "The hostess opened a velvet door. Beyond it waited a chamber full of smoke. Green smoke. Marok went still. At the center of the room, suspended above a round bed of black mirrors, burned his tail. It was not caged in glass like Saroka's had been. It was threaded through the mirrors themselves, green fire pulled into a hundred reflected ribbons. Each pane held a different Marok. Laughing. Bleeding. Drinking. Bowing to the God of War. Grinning at me from the Celestial Court. Grabbing the Scale. Dropping the smile when my goddess ordered me into the night. And one reflection showed him kneeling in a city of ash, hands empty, green fire dying behind his eyes.",
      "Marok looked at that one longest. The room smelled of rain on hot stone. And fear. War's fear did not smell like cowardice. It smelled like a torch held too close to a curtain and called bravery until the room caught.",
      "Kitsu stepped beside him. \"Do not touch anything yet.\"",
      "Marok laughed once. Small. Wrong. \"I was not planning to.\" The mirror nearest him cracked. His tail flared. A silver thread ran through the green fire, tight as a noose.",
      "\"There,\" I said.",
      "Kitsu's gold light rose at once. \"Same severance bind.\"",
      "\"Not the same,\" I said. They both looked at me. I hated being correct. It invited responsibility. \"Saroka's cage wanted to split her future. This wants him to burn through them.\"",
      "The hostess, still at the door, gave a pleased little hum. \"Beauty sees the mechanism.\"",
      "I turned my head slowly. \"Beauty also bites.\"",
      "\"Only when wanted.\"",
      "Kitsu's eyes cooled. \"Leave.\"",
      "The hostess smiled at him. \"Justice does not command here.\"",
      "\"No,\" he said. \"But I can make disobedience expensive.\" Gold law snapped once under his voice. The hostess bowed, amused, and withdrew. The door closed without touching the frame.",
      "Marok stared at his tail. \"What happens if I take it?\"",
      "\"The bind will make you feed it,\" Kitsu said.",
      "\"Feed it what?\"",
      "I looked at the mirrors. At every Marok laughing harder than he meant to. At every Marok failing privately and performing publicly. At the ash-city version with no grin left. \"Your fire,\" I said. \"All of it, if it can.\"",
      "\"That sounds dramatic.\"",
      "\"It sounds accurate,\" Kitsu said.",
      "Marok's smile appeared and died without committing. \"Then we should not let it have all of me.\" He reached for the first mirror. Kitsu caught his wrist. Not hard. Warning. Marok looked down at the hand. Then at Kitsu.",
      "\"Ask,\" Kitsu said.",
      "The word startled me. It startled Marok too. The room waited.",
      "Marok swallowed. \"Jem.\" There was no flirtation in it. No wink. No brave little garnish. Only my name, held like something sharp. \"I need you to see the lie before I burn it,\" he said.",
      "\"And me?\" Kitsu asked.",
      "Marok looked at him. \"I need you to stop me when I do not stop myself.\"",
      "Truth. No gold wire needed.",
      "I stepped toward the mirrors and set one hand over the green reflection of his tail. Heat licked my palm. \"If I say stop, you stop.\"",
      "\"Yes,\" Marok said.",
      "\"If Kitsu says stop, you stop.\"",
      "Marok's jaw flexed. \"Yes.\"",
      "\"If you make a joke while nearly dying, I will be cross.\"",
      "\"I cannot promise miracles.\"",
      "\"Marok.\"",
      "He breathed out. \"Yes.\"",
      "Kitsu moved behind him, gold light gathering in his hands. \"Begin.\"",
      "Marok pressed both palms to the mirror. Green fire exploded up his arms. He did not scream at first. That was worse. His body locked. His teeth bared. Every reflection in the room opened its mouth at once, and all of them laughed with his voice. Too bright. Too loud. Too desperate.",
      "I pushed my sight into the mirror. Rot beneath the ornament. The silver thread was not wrapped around his tail. It was wrapped around his pride. No. Not pride. The wound under it. Failure. The belief that if he did not dazzle fast enough, someone would finally see the terror underneath and send him back to whatever war made of unwanted sons.",
      "\"Oh,\" I whispered.",
      "Green fire surged. Marok gasped then, knees buckling. Kitsu caught his shoulders from behind. Gold light wrapped around Marok's ribs, holding him upright without caging him.",
      "\"Stop,\" Kitsu said.",
      "Marok did not. His fire poured into the mirrors. The silver bind drank it greedily. Every reflected Marok began to burn from the inside out.",
      "\"Marok,\" I said.",
      "His eyes found mine through the smoke. He was trying to smile. Idiot. Beautiful, ruined idiot.",
      "\"I can do it,\" he rasped.",
      "\"No,\" I said. \"You can die impressively. That is different.\"",
      "Kitsu's control cracked audibly in his voice. \"Release it.\"",
      "Marok shook his head. The room brightened green. Too green. His skin went pale beneath the light. The air filled with rain striking stone, smoke, and a bitter edge like metal left in the mouth.",
      "He was burning out. I had one terrible, clear thought: if I waited for permission, I would lose him. Then another, clearer: consent is not waiting for someone to know how to ask while they are drowning. It is offering a hand where they can refuse it.",
      "I stepped close. \"Marok,\" I said, and my voice cut through the green. \"Look at me.\"",
      "He did. Barely. I touched his face with both hands. He could have pulled away. He did not.",
      "\"May I anchor you?\" I asked.",
      "His breath broke. \"Yes.\"",
      "I kissed him. Not gently enough to be mistaken for pity and not hard enough to be a form of punishment. A hand offered. A door opened. A refusal to let him turn himself into a torch and call it useful. For one heartbeat, Marok did not respond. Then his hands left the mirror and found my waist. Stopped there. Waited there. A question in every finger. I answered by staying.",
      "Green fire slammed through me. War tasted like smoke, honey, rain, and a grief that had learned to grin before it learned to speak. Rose light rose to meet it, not smoothing, not owning. Revealing. Beneath Marok's charm was terror. Beneath the terror was loyalty so fierce it had teeth. Beneath that was a boy looking at the God of War and deciding joy would be armor if no one gave him any.",
      "Kitsu's gold law closed around us both. Not jealous. Not cruel. Quiet. He held the room steady while I held Marok. The silver thread shrieked. Marok tore his mouth from mine with a sound that might have been my name. Green fire snapped back into him. The mirrors shattered inward. His tail blazed into being behind him, green and furious and whole. The blast knocked us apart.",
      "Kitsu caught me before I hit the mirrored bed. Marok landed on one knee, both hands braced on the floor, his restored tail burning bright enough to turn the smoke emerald.",
      "For once, he did not make a joke. He looked at me as if all the words had burned with the cage. My mouth tingled. My heart was behaving without supervision. Unacceptable.",
      "Kitsu released me carefully. Too carefully. He looked at Marok, then at me, and something quiet folded behind his eyes. Not cruelty. Not anger. Retreat. That hurt more than it had any right to. \"Thank you,\" Marok said. Two words. Bare. No performance.",
      "\"You are welcome,\" I said, and tried not to sound as shaken as I was.",
      "A low note sounded beneath the floor. Gold. Not Kitsu's gold. Scale gold. Every broken mirror on the floor turned toward the same wall. Behind the velvet there, something blackened and divine pulsed once. Kitsu went still. \"A Scale half.\" Marok stood too quickly and nearly collapsed. I pointed at him. \"Do not make me regret saving you.\" His restored tail flicked once, weak but alive. \"I would not dream of it.\"",
      "\"You dream of terrible things.\"",
      "\"Yes,\" he said softly. \"Apparently.\"",
      "Kitsu approached the wall and drew the velvet aside. Behind it was no door. Only a mirror, tall and dark, its surface written over in perfect gold script. Legal script. Kitsu's hand.",
      "NO FOXES. NO JUDGMENT.",
      "The words burned across the glass. Kitsu stopped breathing. Marok turned toward him, all restored fire and fresh horror. I shifted my gaze from the writing to Kitsu's face. The Menagerie went silent around us. Somewhere behind the mirror, a broken half of the Scale began to sing."
    ],
    "scenes": [
      {
        "after": 15,
        "src": "/a-court-of-foxes/assets/ch8-menagerie-hostess.png",
        "alt": "The Menagerie's spirit hostess beneath a chandelier of glass roses while Jem, Marok, and Kitsu face her",
        "caption": "They reflected us as we wished to be seen. Marok brighter. Kitsu unburdened. Me untouched."
      },
      {
        "after": 27,
        "src": "/a-court-of-foxes/assets/ch8-mirror-hall-desires.png",
        "alt": "Jem, Marok, and Kitsu in a mirror hallway where an alternate Jem sits enthroned and adored",
        "caption": "Possession disguised as choosing the cage myself."
      },
      {
        "after": 34,
        "src": "/a-court-of-foxes/assets/ch8-marok-tail-mirror-room.png",
        "alt": "Marok's green fox tail burning through a chamber of black mirrors while Jem and Kitsu prepare to free it",
        "caption": "Green fire pulled into a hundred reflected ribbons."
      },
      {
        "after": 86,
        "src": "/a-court-of-foxes/assets/ch8-marok-anchor-kiss.png",
        "alt": "Jem anchoring Marok with a kiss while green fire, rose light, and Kitsu gold law fill the mirror chamber",
        "caption": "A hand offered. A door opened."
      },
      {
        "after": 96,
        "src": "/a-court-of-foxes/assets/ch8-scale-half-cliffhanger.png",
        "alt": "Kitsu drawing aside red velvet to reveal a dark mirror and the glowing broken half of the Scale of Judgment",
        "caption": "Somewhere behind the mirror, a broken half of the Scale began to sing."
      }
    ]
  }
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
const tooltipClickBlockMs = 900;

function tooltipSentenceFragment(text: string) {
  return text.replace(/[.!?]+$/, "");
}

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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const pendingResumeRef = useRef<ResumeBookmark | null>(null);
  const choiceConfirmRef = useRef<HTMLDivElement | null>(null);
  const tooltipTimerRef = useRef<number | null>(null);
  const tooltipClickBlockRef = useRef<{ key: string; until: number } | null>(null);

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
    const root = document.documentElement;
    root.classList.toggle("cof-reader-choice-active", stage === "choice");
    root.classList.toggle("cof-reader-ending-active", stage === "ending");

    return () => {
      root.classList.remove("cof-reader-choice-active", "cof-reader-ending-active");
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "choice" || !choice) return;

    const frame = window.requestAnimationFrame(() => {
      choiceConfirmRef.current?.scrollIntoView({
        block: window.innerWidth <= 760 ? "center" : "nearest",
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [choice, stage]);

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

  useEffect(() => {
    if (!readWithMe || stage !== "reading") return;

    let followup: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      scrollParagraphIntoView(readWithMeIndex);
      followup = window.setTimeout(() => scrollParagraphIntoView(readWithMeIndex), 90);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (followup) window.clearTimeout(followup);
    };
  }, [readWithMe, readWithMeIndex, stage]);

  useEffect(() => {
    if (stage !== "reading") return;

    let frame: number | null = null;
    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateActiveParagraph();
      });
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeParagraphIndex, chapterIndex, readWithMe, readWithMeIndex, stage]);

  useEffect(() => {
    return () => {
      clearTooltipTimer();
    };
  }, []);

  function clearTooltipTimer() {
    if (!tooltipTimerRef.current) return;
    window.clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = null;
  }

  function showTooltip(key: string) {
    clearTooltipTimer();
    setActiveTooltip(key);
  }

  function hideTooltip(key: string) {
    clearTooltipTimer();
    setActiveTooltip((current) => (current === key ? null : current));
  }

  function cancelTooltipPress(key: string) {
    hideTooltip(key);
    if (tooltipClickBlockRef.current?.key === key) {
      tooltipClickBlockRef.current = null;
    }
  }

  function showTouchTooltip(key: string, event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    tooltipClickBlockRef.current = { key, until: Date.now() + tooltipClickBlockMs };
    showTooltip(key);
  }

  function blockTooltipClick(key: string, event: MouseEvent<HTMLElement>) {
    const block = tooltipClickBlockRef.current;
    if (!block || block.key !== key) return;
    if (Date.now() > block.until) {
      tooltipClickBlockRef.current = null;
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    tooltipClickBlockRef.current = null;
    hideTooltip(key);
  }

  function tooltipProps(key: string, label: string, placement: "top" | "bottom" = "top") {
    return {
      className: "cof-tooltip",
      "data-tooltip": label,
      "data-tooltip-active": activeTooltip === key ? "true" : undefined,
      "data-tooltip-place": placement,
      onBlur: () => hideTooltip(key),
      onClickCapture: (event: MouseEvent<HTMLElement>) => blockTooltipClick(key, event),
      onContextMenu: (event: MouseEvent<HTMLElement>) => showTouchTooltip(key, event),
      onFocus: () => showTooltip(key),
      onPointerCancel: () => cancelTooltipPress(key),
      onPointerLeave: () => cancelTooltipPress(key),
      onPointerUp: () => hideTooltip(key),
    };
  }

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
        setActiveParagraphIndex(activeParagraphIndex);
      }
      return next;
    });
  }

  function readNext() {
    setReadWithMeIndex((current) => {
      const nextIndex = Math.min(chapter.body.length - 1, current + 1);
      setActiveParagraphIndex(nextIndex);
      return nextIndex;
    });
  }

  function scrollParagraphIntoView(index: number, behavior: ScrollBehavior = "smooth") {
    const paragraphIndex = Math.max(0, Math.min(index, chapter.body.length - 1));
    const paragraph = paragraphRefs.current[paragraphIndex];
    const reader = readerRef.current;
    if (!paragraph || !reader) return;

    const supportDock = reader.querySelector<HTMLElement>(".cof-support-dock");
    const dockHeight = supportDock?.getBoundingClientRect().height ?? 0;
    const offset = Math.max(28, Math.min(190, dockHeight + 32));
    const readerStyle = window.getComputedStyle(reader);
    const readerScrolls = readerStyle.overflowY !== "visible" && reader.scrollHeight > reader.clientHeight + 1;

    if (readerScrolls) {
      const readerRect = reader.getBoundingClientRect();
      const paragraphRect = paragraph.getBoundingClientRect();
      reader.scrollTo({
        top: Math.max(0, reader.scrollTop + paragraphRect.top - readerRect.top - offset),
        behavior,
      });
    } else {
      const paragraphTop = paragraph.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, paragraphTop - offset), behavior });
    }

    paragraph.focus({ preventScroll: true });
  }

  function findPlace() {
    scrollParagraphIntoView(activeParagraphIndex);
  }

  function updateActiveParagraph() {
    const reader = readerRef.current;
    if (!reader) return;
    const readerRect = reader.getBoundingClientRect();
    const readerStyle = window.getComputedStyle(reader);
    const readerScrolls = readerStyle.overflowY !== "visible" && reader.scrollHeight > reader.clientHeight + 1;
    const supportDock = reader.querySelector<HTMLElement>(".cof-support-dock");
    const dockRect = supportDock?.getBoundingClientRect();
    const visibleTop = readerScrolls ? readerRect.top : 0;
    const visibleBottom = readerScrolls ? readerRect.bottom : window.innerHeight;
    const dockBottom =
      dockRect && dockRect.bottom > visibleTop && dockRect.top < visibleBottom ? dockRect.bottom : visibleTop;
    const scanTop = Math.min(visibleBottom - 40, Math.max(visibleTop, dockBottom + 24));
    const scanBottom = visibleBottom - 20;
    const anchorY = Math.min(scanBottom, scanTop + Math.min(180, Math.max(80, (scanBottom - scanTop) * 0.34)));
    let nearest = activeParagraphIndex;
    let nearestDistance = Number.POSITIVE_INFINITY;

    paragraphRefs.current.forEach((paragraph, index) => {
      if (!paragraph || (readWithMe && index > readWithMeIndex)) return;
      const rect = paragraph.getBoundingClientRect();
      if (rect.bottom < scanTop || rect.top > scanBottom) return;
      const distance =
        rect.top <= anchorY && rect.bottom >= anchorY
          ? 0
          : Math.min(Math.abs(rect.top - anchorY), Math.abs(rect.bottom - anchorY));
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
    <div className={`cof-experience cof-stage-${stage} cof-theme-${theme} ${fontClass}`} data-pace={pace}>
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
          <button
            {...tooltipProps("text-smaller", "Make the story text smaller.", "bottom")}
            type="button"
            onClick={() => setFontStep((value) => Math.max(0, value - 1))}
            aria-label="Decrease text size"
          >
            A-
          </button>
          <button
            {...tooltipProps("text-larger", "Make the story text larger.", "bottom")}
            type="button"
            onClick={() => setFontStep((value) => Math.min(2, value + 1))}
            aria-label="Increase text size"
          >
            A+
          </button>
          <button
            {...tooltipProps("theme", theme === "day" ? "Switch to the darker night reader." : "Switch to the brighter day reader.", "bottom")}
            type="button"
            onClick={() => setTheme((value) => (value === "day" ? "night" : "day"))}
          >
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
              <button
                {...tooltipProps("begin", "Start reading from Chapter One.")}
                className="cof-primary-action cof-tooltip"
                type="button"
                onClick={begin}
              >
                Begin the chronicle
                <span aria-hidden="true">&rarr;</span>
              </button>
              {resumeBookmark ? (
                <button
                  {...tooltipProps("resume", "Return to your saved reading position.")}
                  className="cof-secondary-action cof-tooltip"
                  type="button"
                  onClick={resumeReading}
                >
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
                  key={item.number}
                  {...tooltipProps(`chapter-${item.number}`, `Jump to ${item.label}: ${tooltipSentenceFragment(item.title)}.`, "bottom")}
                  className={`${index === chapterIndex ? "is-active " : ""}cof-tooltip`}
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
                      key={item}
                      {...tooltipProps(
                        `pace-${item}`,
                        item === "drift"
                          ? "Drift: relaxed pacing with no focus guide."
                          : item === "focus"
                            ? "Focus: balanced text with the reading ruler."
                            : item === "sprint"
                              ? "Sprint: tighter text with a reading band."
                              : "Rest: larger text with lantern focus.",
                        "bottom",
                      )}
                      aria-checked={pace === item}
                      className="cof-pace-button cof-tooltip"
                      data-active={pace === item}
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
                    {...tooltipProps("focus-lantern", "Lantern focus dims surrounding paragraphs so this one stands out.", "bottom")}
                    aria-label="Lantern paragraph focus"
                    aria-pressed={focusMode === "spotlight"}
                    className="cof-support-button cof-tooltip"
                    data-active={focusMode === "spotlight"}
                    onClick={() => toggleFocus("spotlight")}
                    type="button"
                  >
                    ◐
                  </button>
                  <button
                    {...tooltipProps("focus-band", "Reading band adds a soft horizontal guide to the active paragraph.", "bottom")}
                    aria-label="Reading band focus"
                    aria-pressed={focusMode === "band"}
                    className="cof-support-button cof-tooltip"
                    data-active={focusMode === "band"}
                    onClick={() => toggleFocus("band")}
                    type="button"
                  >
                    ≋
                  </button>
                  <button
                    {...tooltipProps("focus-ruler", "Reading ruler underlines and marks the active paragraph.", "bottom")}
                    aria-label="Reading ruler focus"
                    aria-pressed={focusMode === "ruler"}
                    className="cof-support-button cof-tooltip"
                    data-active={focusMode === "ruler"}
                    onClick={() => toggleFocus("ruler")}
                    type="button"
                  >
                    ▔
                  </button>
                  <button
                    {...tooltipProps("read-with-me", "Read With Me reveals one paragraph at a time. Use Next to continue.", "bottom")}
                    aria-label="Read With Me"
                    aria-pressed={readWithMe}
                    className="cof-support-button cof-tooltip"
                    data-active={readWithMe}
                    onClick={toggleReadWithMe}
                    type="button"
                  >
                    ¶
                  </button>
                  <button
                    {...tooltipProps(
                      "images-toggle",
                      showImages ? "Hide story images when you want fewer distractions." : "Show story images again.",
                      "bottom",
                    )}
                    aria-label="Show or hide story images"
                    aria-pressed={!showImages}
                    className="cof-support-button cof-tooltip"
                    data-active={!showImages}
                    onClick={() => setShowImages((value) => !value)}
                    type="button"
                  >
                    ▧
                  </button>
                  <button
                    {...tooltipProps("find-place", "Find My Place scrolls back to your highlighted paragraph.", "bottom")}
                    className="cof-support-button cof-tooltip"
                    type="button"
                    onClick={findPlace}
                    aria-label="Find my place"
                  >
                    ⌖
                  </button>
                  {readWithMe ? (
                    <button
                      {...tooltipProps("read-next", "Reveal the next paragraph and follow it down the page.", "bottom")}
                      className="cof-next-button cof-tooltip"
                      type="button"
                      onClick={readNext}
                      aria-label="Show the next paragraph"
                    >
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
                      key={`${chapter.number}-${paragraph.slice(0, 20)}-${index}`}
                      aria-hidden={hidden}
                      className={blockClassName}
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
                            <figure key={scene.src} className="cof-inline-scene">
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
                <button
                  {...tooltipProps(
                    "continue-reading",
                    chapterIndex < chapters.length - 1
                      ? `Continue to ${chapters[chapterIndex + 1].label}.`
                      : "Open the final path choice.",
                  )}
                  className="cof-primary-action cof-tooltip"
                  type="button"
                  onClick={continueReading}
                >
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
            <button
              {...tooltipProps("choice-marok", "Choose Marok's spark, risk, and dangerous sincerity.")}
              className={`${choice === "marok" ? "is-selected " : ""}cof-tooltip`}
              type="button"
              onClick={() => setChoice("marok")}
            >
              <span className="cof-dot cof-dot-green" />
              <strong>Go with Marok</strong>
              <em>War's fox. Spark, ruin, and dangerous sincerity.</em>
            </button>
            <button
              {...tooltipProps("choice-kitsu", "Choose Kitsu's restraint, truth, and steady protection.")}
              className={`${choice === "kitsu" ? "is-selected " : ""}cof-tooltip`}
              type="button"
              onClick={() => setChoice("kitsu")}
            >
              <span className="cof-dot cof-dot-gold" />
              <strong>Go with Kitsu</strong>
              <em>Justice's fox. Restraint, truth, and a hand that stays.</em>
            </button>
            <button
              {...tooltipProps("choice-both", "Choose the triune bond: no claiming, no hierarchy.")}
              className={`${choice === "both" ? "is-selected " : ""}cof-tooltip`}
              type="button"
              onClick={() => setChoice("both")}
            >
              <span className="cof-dot cof-dot-rose" />
              <strong>Choose both</strong>
              <em>The triune bond. No claiming. No hierarchy.</em>
            </button>
          </div>
          {choice ? (
            <div className="cof-choice-confirm" ref={choiceConfirmRef}>
              <p>{choiceConfirmation(choice)}</p>
              <button
                {...tooltipProps("cross-dark", "Reveal the ending shaped by your chosen path.")}
                className="cof-primary-action cof-tooltip"
                type="button"
                onClick={() => setStage("ending")}
              >
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
              <button
                {...tooltipProps("record-name", "Mark this ending as witnessed in this reading session.")}
                className="cof-tooltip"
                type="button"
                onClick={() => setJoined(true)}
              >
                Record my name
              </button>
            )}
            <button {...tooltipProps("read-again", "Return to the cover and begin again.")} className="cof-tooltip" type="button" onClick={replay}>
              Read again
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
