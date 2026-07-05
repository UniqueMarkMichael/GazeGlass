export const PRESS_ROUTE = "/press"; // TODO_MARK_PRESS_SLUG

export const pressGalleryContent = {
  route: PRESS_ROUTE,
  meta: {
    title: "The Press Gallery — Gaze Glass",
    description:
      "Media resources, story angles, press assets, boilerplate, and contact information for Gaze Glass, a New York storytech imprint building an adult mythic fantasy world across novels, interactive fiction, and the web.",
    shortDescription:
      "Media resources, story angles, press assets, boilerplate, and contact information for Gaze Glass.",
    ogImage: "/press-assets/og/gazeglass-press-gallery-og-1200x630.jpg",
  },
  masthead: {
    label: "THE PRESS GALLERY",
    logotype: "Gaze Glass",
    line: "Gods Watch · Mortals Pray · Spirits Remember — and the press records.",
    mediaContactLabel: "Media contact",
    keyArt: {
      src: "/press-assets/masthead/gazeglass-press-masthead-key-art.png",
      alt: "",
      caption:
        "A gold glass celestial instrument inside the Gaze Glass press gallery masthead.",
      credit: "Image courtesy of Gaze Glass.",
      usage: "Cleared for editorial use with credit.",
      dimensions: "2172 x 724 PNG",
    },
  },
  facts: [
    { label: "Brand / imprint", value: "Gaze Glass" },
    { label: "Founder pen name", value: "Gaze Glass" },
    { label: "Founder real name", value: "[MARK_REAL_NAME_TBD]" },
    { label: "Based in", value: "New York City" },
    {
      label: "Category",
      value: "Adult epic fantasy / romantasy / storytech / spatial storytelling",
    },
    { label: "Flagship work", value: "A Family of Mortals" },
    { label: "Website", value: "www.gazeglass.com" },
    { label: "Press contact", value: "press@gazeglass.com [CONFIRM MAILBOX]" },
    { label: "Correct spelling", value: "Gaze Glass" },
    { label: "Key names", value: "Rashid Shah; Jem; Marok; Kitsu; Heba" },
  ],
  works: [
    {
      title: "A Family of Mortals",
      shortTitle: "AFOM",
      category: "Adult epic fantasy",
      length: "~115k words",
      logline:
        "The gods don't send fire or flood — they draft a broken family to execute humanity's final judgment, and one brother refuses.",
      status: "Querying / self-pub evaluation",
      rating: "[MARK_RATING_TBD]",
      coverAssetId: "afom-cover",
      image: {
        src: "/press-assets/works/gazeglass-afom-cover-web.png",
        alt: "A Family of Mortals cover art showing Rashid Shah beneath divine figures and cosmic judgment.",
      },
    },
    {
      title: "A Court of Foxes",
      shortTitle: "ACOF",
      category: "Romantasy novella + interactive prequel",
      tagline: "Some tails are worth chasing.",
      status: "In production; interactive reader forthcoming",
      rating: "[MARK_RATING_TBD]",
      coverAssetId: "acof-cover",
      image: {
        src: "/press-assets/works/gazeglass-acof-cover-web.png",
        alt: "A Court of Foxes cover art showing Jem, Marok, and Kitsu in a gilded court.",
      },
    },
    {
      title: "Big Scale Betrayal",
      shortTitle: "BSB",
      category: "Dark romantasy serial, ancient Kemet",
      status: "In development",
      rating: "[MARK_RATING_TBD]",
      coverAssetId: "bsb-cover",
    },
  ],
  storyAngles: [
    {
      hook: "The brother who said no.",
      description:
        "A protagonist who refuses his divine mandate from page one — destiny-refusal as the spine of an epic fantasy.",
    },
    {
      hook: "The adman turned mythmaker.",
      description:
        "A career copywriter (Omnicom; Dell, PNC, Xfinity) walks away from enterprise branding to build a mythic story world. This is the human-interest pivot.",
    },
    {
      hook: "Spatial storytelling.",
      description:
        "Not just books — a navigable world you enter through interactive fiction, a matching tool, and an in-world site. This is the indie-creator-as-worldbuilder / storytech angle.",
    },
    {
      hook: "Choose your fox.",
      description:
        "Branching interactive romantasy with three endings — TikTok-native publishing meets canon.",
    },
    {
      hook: "Braided cosmology.",
      description:
        "[MARK_APPROVAL_REQUIRED: cultural framing must be personally approved before publishing.]",
    },
  ],
  boilerplates: [
    {
      label: "25-word boilerplate",
      wordCount: 25,
      text: "Gaze Glass is a New York storytech imprint building an interconnected adult fantasy world across novels, interactive fiction, and immersive web — spatial storytelling where you enter the world.",
    },
    {
      label: "50-word boilerplate",
      wordCount: 50,
      text: "Gaze Glass is the pen name and storytech imprint of a New York writer and career experience designer building one interconnected fantasy world across novels, interactive fiction, and the web. Its flagship epic, A Family of Mortals, follows a family drafted by the gods to judge humanity — and the son who refuses.",
    },
    {
      label: "100-word boilerplate",
      wordCount: 100,
      text: "[MARK_APPROVAL_REQUIRED: 100-word boilerplate pending]",
    },
  ],
  founder: {
    displayName: "[MARK_FOUNDER_DISPLAY_NAME_TBD]",
    realName: "[MARK_REAL_NAME_TBD]",
    penName: "Gaze Glass",
    title: "Founder, Gaze Glass",
    location: "New York City",
    headshot: {
      src: "[MARK_HEADSHOT_SRC_TBD]",
      alt: "[MARK_HEADSHOT_ALT_TBD]",
      caption: "[MARK_HEADSHOT_CAPTION_TBD]",
      credit: "[MARK_HEADSHOT_CREDIT_TBD]",
    },
    bios: [
      { label: "25-word bio", text: "[MARK_APPROVAL_REQUIRED: founder bios pending]" },
      { label: "60-word bio", text: "[MARK_APPROVAL_REQUIRED: founder bios pending]" },
      { label: "120-word bio", text: "[MARK_APPROVAL_REQUIRED: founder bios pending]" },
    ],
  },
  quotes: [
    {
      quote: "Most fantasy asks you to read a world. I want you to walk into one.",
      attribution: "[MARK_ATTRIBUTION_TBD]",
    },
    {
      quote: "The story starts the moment someone refuses the role they were handed.",
      attribution: "[MARK_ATTRIBUTION_TBD]",
    },
  ],
  pressKit: {
    zipPath: "/press-assets/zip/gaze-glass-press-kit.zip",
    status: "[PENDING_FINAL_ASSETS]",
  },
  assets: [
    {
      id: "masthead-key-art",
      category: "Brand and newsroom art",
      title: "Press Gallery masthead key art",
      caption:
        "A gold glass celestial instrument inside the Gaze Glass press gallery masthead.",
      credit: "Image courtesy of Gaze Glass.",
      usage: "Cleared for editorial use with credit.",
      alt: "A gold glass celestial instrument in a dark editorial room.",
      thumbnailSrc: "/press-assets/masthead/gazeglass-press-masthead-key-art.png",
      webSrc: "/press-assets/masthead/gazeglass-press-masthead-key-art.png",
      printSrc: "",
      dimensions: "2172 x 724",
      format: "PNG",
      downloadName: "gazeglass-press-masthead-key-art.png",
    },
    {
      id: "logo-pack",
      category: "Logo pack",
      title: "Gaze Glass logo pack",
      caption: "[ASSET_PENDING: light and dark SVG/PNG lockups]",
      credit: "Image courtesy of Gaze Glass.",
      usage: "Usage note pending final logo package.",
      alt: "",
      downloadName: "gazeglass-logo-pack.zip",
    },
    {
      id: "founder-headshot",
      category: "Founder headshots / founder emblem",
      title: "Founder headshot or pen-name emblem",
      caption: "[MARK_HEADSHOT_SRC_TBD]",
      credit: "[MARK_HEADSHOT_CREDIT_TBD]",
      usage: "Usage note pending Mark approval.",
      alt: "",
      downloadName: "gazeglass-founder-headshot.zip",
    },
    {
      id: "work-covers",
      category: "Book covers and key art",
      title: "Work cover/key art set",
      caption: "[ASSET_PENDING: final print and web-resolution work art package]",
      credit: "Image courtesy of Gaze Glass.",
      usage: "Usage note pending final cover package.",
      alt: "",
      downloadName: "gazeglass-work-art.zip",
    },
    {
      id: "afom-cover",
      category: "Book covers and key art",
      title: "A Family of Mortals cover art",
      caption:
        "A Family of Mortals key art featuring Rashid Shah beneath divine figures and cosmic judgment.",
      credit: "Image courtesy of Gaze Glass.",
      usage: "Cleared for editorial use with credit. Do not alter cover art.",
      alt: "A Family of Mortals cover art showing Rashid Shah beneath four divine figures.",
      thumbnailSrc: "/press-assets/works/gazeglass-afom-cover-web.png",
      webSrc: "/press-assets/works/gazeglass-afom-cover-web.png",
      printSrc: "",
      dimensions: "1024 x 1536",
      format: "PNG",
      downloadName: "gazeglass-afom-cover-web.png",
    },
    {
      id: "acof-cover",
      category: "Book covers and key art",
      title: "A Court of Foxes cover art",
      caption:
        "A Court of Foxes key art featuring Jem, Marok, and Kitsu inside a gilded romantasy court.",
      credit: "Image courtesy of Gaze Glass.",
      usage: "Cleared for editorial use with credit. Do not alter cover art.",
      alt: "A Court of Foxes cover art showing Jem, Marok, and Kitsu in a gilded court.",
      thumbnailSrc: "/press-assets/works/gazeglass-acof-cover-web.png",
      webSrc: "/press-assets/works/gazeglass-acof-cover-web.png",
      printSrc: "",
      dimensions: "1024 x 1536",
      format: "PNG",
      downloadName: "gazeglass-acof-cover-web.png",
    },
    {
      id: "og-share-card",
      category: "Social / OG card",
      title: "Press Gallery social preview card",
      caption:
        "A restrained Ink Indigo and Gold Leaf press gallery background for Gaze Glass link previews.",
      credit: "Image courtesy of Gaze Glass.",
      usage: "Cleared for editorial and social preview use with credit.",
      alt: "A dark literary press gallery background with gold rules, books, glass, and window light.",
      thumbnailSrc: "/press-assets/og/gazeglass-press-gallery-og-1200x630.jpg",
      webSrc: "/press-assets/og/gazeglass-press-gallery-og-1200x630.jpg",
      printSrc: "",
      dimensions: "1200 x 630",
      format: "JPG",
      downloadName: "gazeglass-press-gallery-og-1200x630.jpg",
    },
    {
      id: "fact-sheet",
      category: "Fact sheet PDF",
      title: "One-page press fact sheet",
      caption: "[DOCUMENT_PENDING: fact sheet PDF]",
      credit: "Gaze Glass.",
      usage: "Cleared for editorial reference.",
      alt: "",
      downloadName: "gazeglass-fact-sheet.pdf",
    },
    {
      id: "usage-guidelines",
      category: "Usage and credit guidelines",
      title: "Usage and credit guidelines",
      caption: "[DOCUMENT_PENDING: usage and credit guidelines]",
      credit: "Gaze Glass.",
      usage: "Cleared for editorial reference.",
      alt: "",
      downloadName: "gazeglass-usage-credit-guidelines.txt",
    },
  ],
  coverage: [],
  releases: [],
  contact: {
    label: "Media contact",
    name: "[MARK_CONTACT_NAME_TBD]",
    email: "press@gazeglass.com",
    mailboxNote: "[CONFIRM MAILBOX]",
    responseTime: "Replies within 1 business day.",
    availability:
      "Available for: written Q&A, audio interviews, video interviews, podcast appearances, and background context.",
    mailto:
      "mailto:press@gazeglass.com?subject=Media%20Inquiry%20%E2%80%94%20Gaze%20Glass",
  },
} as const;
