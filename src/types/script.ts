export interface Script {
  name: string;
  characters: Character[];
}

export interface Character {
  name: string;
  team: string;
  imageSrc: string;
}
