// Connects the root-level voice assistant to the game screen.
export type GameSnapshot = Record<string, string | number | boolean | string[] | null>;

export type GameActions = {
  openMezgeb?: () => void;
  closeOverlay?: () => void;
  interact?: () => string;
};

let snapshot: GameSnapshot = {};
let actions: GameActions = {};
let language = "English";

export const setGameSnapshot = (s: GameSnapshot) => {
  snapshot = s;
};
export const getGameSnapshot = () => snapshot;

export const setGameActions = (a: GameActions) => {
  actions = a;
};
export const getGameActions = () => actions;

export const setLanguageName = (l: string) => {
  language = l;
};
export const getLanguageName = () => language;