// Cards shown on the /game page.
// TEAMMATE: when the main game is ready, change `status` to "playable" and set `href`
// (or set NEXT_PUBLIC_MAIN_GAME_URL in the environment and use the /game/main page).
import { episodes } from "@/lib/data";

export type CardStatus = "playable" | "in-development" | "coming-soon";

export type GameCard = {
  id: string;
  title: string;
  am: string;
  blurb: string;
  tag: string;
  role?: string;
  status: CardStatus;
  href: string;
  image: string;
};

export const MAIN_GAME_CARD: GameCard = {
  id: "main",
  title: "UTOPIA: The Main Game",
  am: "ዋናው ጨዋታ",
  blurb: "The full UTOPIA adventure, being designed by the team.",
  tag: "FEATURED",
  status: "in-development",
  href: "/game/main",
  image: "/encyclopedia/hero.jpg",
};

export const EPISODE_CARDS: GameCard[] = episodes.map((ep) => ({
  id: ep.id,
  title: ep.title,
  am: "",
  blurb: ep.era,
  tag: `EPISODE ${ep.num}`,
  role: ep.role,
  status: ep.status === "available" ? "playable" : "coming-soon",
  href: `/game/${ep.id}`,
  image: ep.image,
}));

export const MINIGAMES_CARD: GameCard = {
  id: "minigames",
  title: "Mini-Games",
  am: "ትናንሽ ጨዋታዎች",
  blurb: "Quick quests about artifacts, Ge'ez, timelines and wildlife.",
  tag: "ARCADE",
  status: "playable",
  href: "/minigames",
  image: "/encyclopedia/simien.jpg",
};
