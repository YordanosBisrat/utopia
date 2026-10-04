// Episode 01: Aksum. Zeway is a FICTIONAL character; his lines are dramatized.

export type Target = "npc" | "stele" | null;

export type Choice = {
  label: string;
  next: string | null;
  progress?: number; // objective stage reached when this choice is picked
  unlock?: string; // መዝገብ entry id unlocked by this choice
};

export type DialogueNode = {
  id: string;
  line: string;
  choices: Choice[];
};

export const NPC = { name: "Zeway", title: "Stone Carver", x: 2, z: -1 };
export const TALK_DISTANCE = 2.4;

// The tallest 3D stele the player can examine
export const STELE_SPOT = { x: 13, z: -5.5, range: 3.8 };

export const OBJECTIVES = [
  "Speak with Zeway, the stone carver",
  "Examine the tallest stele",
  "Answer Zeway's question",
  "Journey complete: open your መዝገብ",
];

// VERIFY: false doors/windows imitating multi-storey buildings
export const EXAMINE_TEXT =
  "You run your eyes up the stone. It is tall and narrow, cut with rows of windows and a doorway at its foot, shaped like a many-storeyed building. Yet nothing opens. Every detail is carved into the stone itself.";

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
  {
    id: "quiz",
    line: "You have seen it. Now tell me, young scribe: what do you think these great stones were raised to mark?",
    choices: [
      {
        label: "Burial places of important people",
        next: "right",
        progress: 3,
        unlock: "stelae",
      },
      { label: "Stores of grain", next: "hint" },
      { label: "Walls to guard the city", next: "hint" },
    ],
  },
  {
    id: "hint",
    line: "Hmm. Think about the doors that never open, and where these stones stand. Who would a house like that be made for?",
    choices: [{ label: "Let me think again.", next: "quiz" }],
  },
  {
    id: "right",
    // VERIFY: stelae associated with tombs / burials of Aksumite rulers and elites
    line: "Yes! A grand house in stone, so that the memory of the person stays standing. The master scribe will be glad of your record.",
    choices: [{ label: "Thank you, Zeway.", next: null }],
  },
  {
    id: "done",
    line: "Your record is complete, young scribe. Go on, take a look at what you have gathered.",
    choices: [{ label: "I will.", next: null }],
  },
];

export function startNodeFor(stage: number): string {
  return ["start", "again", "quiz", "done"][Math.min(stage, 3)];
}