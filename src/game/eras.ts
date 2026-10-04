// Periods and blurbs for the Time Portal. Lines marked VERIFY need checking.
export type EraInfo = {
  id: string;
  name: string;
  nameAm: string;
  glyph: string;
  period: string;
  tagline: string;
  blurb: string;
  image: string;
  role: string;
  mapX: number;
  mapY: number;
  playable: boolean;
};

export const ERAS: EraInfo[] = [
  {
    id: "aksum",
    name: "Aksum",
    nameAm: "አክሱም",
    glyph: "አ",
    period: "First millennium CE", // VERIFY
    tagline: "The kingdom of stone and trade winds",
    blurb:
      "A powerful trading kingdom of the Horn of Africa, known for its tall carved stelae. Meet a stone carver, study a great stone, and build your first መዝገብ entry.",
    image: "/art/aksum.jpg",
    role: "Scribe's Apprentice",
    mapX: 26,
    mapY: 22,
    playable: true,
  },
  {
    id: "lalibela",
    name: "Lalibela",
    nameAm: "ላሊበላ",
    glyph: "ላ",
    period: "Medieval", // VERIFY
    tagline: "Churches carved from living rock",
    blurb: "Rock-hewn churches cut downward into the earth. This journey is coming soon.",
    image: "/art/lalibela.jpg",
    role: "Coming soon",
    mapX: 44,
    mapY: 40,
    playable: false,
  },
  {
    id: "gondar",
    name: "Gondar",
    nameAm: "ጎንደር",
    glyph: "ጎ",
    period: "17th century", // VERIFY
    tagline: "The royal city of castles",
    blurb: "A royal capital of stone castles and courtyards. This journey is coming soon.",
    image: "/art/gondar.jpg",
    role: "Coming soon",
    mapX: 62,
    mapY: 52,
    playable: false,
  },
  {
    id: "adwa",
    name: "Adwa",
    nameAm: "ዓድዋ",
    glyph: "ዓ",
    period: "1896", // VERIFY
    tagline: "The highlands of Adwa",
    blurb:
      "The highlands where, in 1896, Ethiopia defeated an invading army. This journey is coming soon.",
    image: "/art/adwa.jpg",
    role: "Coming soon",
    mapX: 78,
    mapY: 30,
    playable: false,
  },
];