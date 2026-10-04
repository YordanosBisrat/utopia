export type Fact = {
  id: string;
  keywords: string[];
  text: string;
  source: string;
  verified: boolean; 
};

export const FACTS: Fact[] = [
  {
    id: "aksum-overview",
    keywords: ["aksum", "axum", "kingdom", "important", "powerful", "capital", "history"],
    text: "Aksum was a powerful kingdom in the Horn of Africa, based around the city of Aksum in northern Ethiopia. It flourished in the first millennium CE.",
    source: "UNESCO World Heritage: Aksum (whc.unesco.org/en/list/15)",
    verified: false,
  },
  {
    id: "aksum-trade",
    keywords: ["trade", "trading", "port", "adulis", "red sea", "ivory", "merchant", "rome", "india"],
    text: "Aksum was a trading power. Goods such as ivory travelled through the Red Sea port of Adulis to partners in the Roman world, Arabia and India.",
    source: "VERIFY: UNESCO Aksum page or an academic history of Aksum",
    verified: false,
  },
  {
    id: "aksum-coins",
    keywords: ["coin", "coins", "money", "gold", "silver", "bronze", "currency"],
    text: "Aksumite rulers minted their own coins, in gold, silver and bronze.",
    source: "VERIFY: UNESCO Aksum page or a numismatic source",
    verified: false,
  },
  {
    id: "stelae",
    keywords: ["stele", "stelae", "stone", "obelisk", "tomb", "burial", "carved", "door", "window", "tall"],
    text: "Stelae are tall carved stones. Many in Aksum are carved to look like tall buildings, with false doors and windows that do not open, and many stand near burial places.",
    source: "UNESCO World Heritage: Aksum (whc.unesco.org/en/list/15)",
    verified: false,
  },
  {
    id: "geez",
    keywords: ["geez", "ge'ez", "script", "writing", "scribe", "inscription", "language", "letters"],
    text: "Ge'ez is an ancient Ethiopian writing system and language. Inscriptions from the Aksumite period were written in it.",
    source: "VERIFY: an academic source on Ge'ez / Ezana inscriptions",
    verified: false,
  },
  {
    id: "ezana",
    keywords: ["ezana", "king", "christian", "christianity", "cross", "ruler"],
    text: "King Ezana of Aksum is remembered as the ruler during whose reign Christianity became established in the kingdom, in the 4th century CE.",
    source: "VERIFY: UNESCO Aksum page or an academic source",
    verified: false,
  },
];

export function lookup(topic: string) {
  const t = topic.toLowerCase();
  const hits = FACTS.map((f) => ({
    f,
    score: f.keywords.filter((k) => t.includes(k)).length,
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (hits.length === 0) {
    return {
      found: false,
      message: "No verified information on this topic yet.",
    };
  }
  return {
    found: true,
    facts: hits.map(({ f }) => ({
      text: f.text,
      source: f.source,
      verified: f.verified,
    })),
  };
}