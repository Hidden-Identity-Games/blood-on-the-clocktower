export interface Game {
  players: string[];
}

export interface PlayerSet {
  [s: string]: string;
}

export interface Self {
  name: string | undefined;
  role: string | undefined;
}
