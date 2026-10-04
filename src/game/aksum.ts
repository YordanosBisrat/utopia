// Episode 01: Aksum. Zeway is a FICTIONAL character; his lines are dramatized.

export type Choice = { label: string; next: string | null; progress?: number };

export type DialogueNode = {
  id: string;
  line: string;
  choices: Choice[];
};

export const NPC = { name: "Zeway", title: "Stone Carver", x: 2, z: -1 };

export const OBJECTIVES = [
  "Speak with Zeway, the stone carver",
  "Examine the tallest stele",
  "Answer Zeway's question",
  "Report back to the master scribe",
];

export const DIALOGUE: DialogueNode[] = [
  {
    id: "start",
    line: "Ah, you carry the master scribe's tablets. He wants a record of our stones, does he? Then look closely, young scribe.",
    choices: [
      { label: "What are these stones?", next: "stones" },
      { label: "Why were they raised?", next: "why" },
    ],
  },
  {
    id: "stones",
    // VERIFY: stelae carved with false doors/windows imitating multi-storey buildings
    line: "We call them stelae. Tall stones, carved to look like many-storeyed buildings: see the windows and doors cut into the face? None of them open.",
    choices: [{ label: "Why were they raised?", next: "why" }],
  },
  {
    id: "why",
    // VERIFY: many stelae stand near burial places / royal tombs
    line: "Many of them stand near burial places, so they mark people of great importance. Go and study the tallest stone, then tell me what you see.",
    choices: [{ label: "I will look closely.", next: null, progress: 1 }],
  },
  {
    id: "again",
    line: "Study the tallest stone, young scribe. Windows, doors, the shape of the whole thing. Then come back and tell me what you saw.",
    choices: [{ label: "I will.", next: null }],
  },
];