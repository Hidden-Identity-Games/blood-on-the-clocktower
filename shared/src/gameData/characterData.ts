import { type Character, type Reminder } from "../shapes/index.ts";

export type ReminderType =
  | "info"
  | "mad"
  | "drunk"
  | "poison"
  | "dead"
  | "protected"
  | "triggerOnDeath"
  | "reveal-role"
  | "counter";
export type TargetType = "self" | "other";
type CharacterDefinition = Omit<Character, "id"> & {
  id: string;
  edition: unknown;
  reminders: Reminder[];
};

const ABILITY_SPENT = {
  name: "ability spent",
  type: "drunk",
  target: "self",
} as const;

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: "unassigned",
    name: "Unassigned",
    edition: "",
    team: "Traveler",
    reminders: [],
    setup: true,
    delusional: false,
    ability: "Please see the storyteller for a role!",
    imageSrc: "",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "artist",
    name: "Artist",
    edition: "snv",
    team: "Townsfolk",
    reminders: [{ name: "lost ability", type: "drunk", dayTrigger: true }],
    setup: false,
    delusional: false,
    ability:
      "Once per game, during the day, privately ask the Storyteller any yes/no question.",
    imageSrc: "artist.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "assassin",
    name: "Assassin",
    edition: "bmr",
    team: "Minion",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night*, choose a player: they die, even if for some reason they could not.",
    imageSrc: "assassin.png",
    firstNight: null,
    otherNight: {
      setReminders: [ABILITY_SPENT.name],
      reminder:
        "If the Assassin has not yet used their ability: The Assassin either shows the 'no' head signal, or points to a player. That player dies.",
      order: 36,
    },
  },
  {
    id: "barber",
    name: "Barber",
    edition: "snv",
    team: "Outsider",
    reminders: [
      {
        name: "haircuts tonight",
        type: "info",
        duration: 1,
        causedByDeath: true,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters.",
    imageSrc: "barber.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If the Barber died today: Wake the Demon. Show the 'This character selected you' card, then Barber token. The Demon either shows a 'no' head signal, or points to 2 players. If they chose players: Swap the character tokens. Wake each player. Show 'You are', then their new character token.",
      order: 40,
      setReminders: ["haircuts tonight"],
      playerMessage: {
        type: "character-selected-you",
        restriction: {
          role: ["barber"],
        },
      },
    },
  },
  {
    id: "baron",
    name: "Baron",
    edition: "tb",
    team: "Minion",
    reminders: [],
    setup: true,
    delusional: false,
    ability: "There are extra Outsiders in play. [+2 Outsiders]",
    imageSrc: "baron.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "butler",
    name: "Butler",
    edition: "tb",
    team: "Outsider",
    reminders: [
      {
        name: "master",
        type: "info",
        duration: 1,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.",
    imageSrc: "butler.png",
    firstNight: {
      setReminders: ["master"],
      reminder: "The Butler points to a player. Mark that player as 'Master'.",
      order: 39,
    },
    otherNight: {
      setReminders: ["master"],
      reminder: "The Butler points to a player. Mark that player as 'Master'.",
      order: 67,
    },
  },
  {
    id: "cerenovus",
    name: "Cerenovus",
    edition: "snv",
    team: "Minion",
    reminders: [
      {
        name: "gone mad",
        type: "mad",
        duration: 1,
        causedByDeath: true,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player & a good character: they are “mad” they are this character tomorrow, or might be executed.",
    imageSrc: "cerenovus.png",
    firstNight: {
      reminder:
        "The Cerenovus points to a player, then to a character on their sheet. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
      order: 25,
      setReminders: ["gone mad"],
      playerMessage: {
        type: "madness",
      },
    },
    otherNight: {
      reminder:
        "The Cerenovus points to a player, then to a character on their sheet. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
      order: 15,
      playerMessage: {
        type: "madness",
      },
    },
  },
  {
    id: "chambermaid",
    name: "Chambermaid",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability.",
    imageSrc: "chambermaid.png",
    firstNight: {
      reminder:
        "The Chambermaid points to two players. Show the number signal (0, 1, 2, …) for how many of those players wake tonight for their ability.",
      order: 51,
    },
    otherNight: {
      reminder:
        "The Chambermaid points to two players. Show the number signal (0, 1, 2, …) for how many of those players wake tonight for their ability.",
      order: 70,
    },
  },
  {
    id: "chef",
    name: "Chef",
    edition: "tb",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "You start knowing how many pairs of evil players there are.",
    imageSrc: "chef.png",
    firstNight: {
      reminder:
        "Show the finger signal (0, 1, 2, …) for the number of pairs of neighbouring evil players.",
      order: 36,
    },
    otherNight: null,
  },
  {
    id: "clockmaker",
    name: "Clockmaker",
    edition: "snv",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "You start knowing how many steps from the Demon to its nearest Minion.",
    imageSrc: "clockmaker.png",
    firstNight: {
      reminder:
        "Show the hand signal for the number (1, 2, 3, etc.) of places from Demon to closest Minion.",
      order: 41,
    },
    otherNight: null,
  },
  {
    id: "courtier",
    name: "Courtier",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [
      {
        name: "entertain",
        type: "drunk",
        duration: 3,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night, choose a character: they are drunk for 3 nights & 3 days.",
    imageSrc: "courtier.png",
    firstNight: {
      reminder:
        "The Courtier either shows a 'no' head signal, or points to a character on the sheet. If the Courtier used their ability: If that character is in play, that player is drunk.",
      order: 19,
      setReminders: ["entertain"],
    },
    otherNight: {
      reminder:
        "Reduce the remaining number of days the marked player is poisoned. If the Courtier has not yet used their ability: The Courtier either shows a 'no' head signal, or points to a character on the sheet. If the Courtier used their ability: If that character is in play, that player is drunk.",
      order: 8,
      setReminders: ["entertain"],
    },
  },
  {
    id: "devils_advocate",
    name: "Devil's Advocate",
    edition: "bmr",
    team: "Minion",
    reminders: [
      {
        name: "advocate",
        type: "protected",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a living player (different to last night): if executed tomorrow, they don't die.",
    imageSrc: "devilsadvocate.png",
    firstNight: {
      reminder:
        "The Devil’s Advocate points to a living player. That player survives execution tomorrow.",
      order: 22,
      setReminders: ["advocate"],
    },
    otherNight: {
      reminder:
        "The Devil’s Advocate points to a living player, different from the previous night. That player survives execution tomorrow.",
      order: 13,
      setReminders: ["advocate"],
    },
  },
  {
    id: "dreamer",
    name: "Dreamer",
    edition: "snv",
    team: "Townsfolk",
    reminders: [{ name: "dream", type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player (not yourself or Travelers): you learn 1 good and 1 evil character, 1 of which is correct.",
    imageSrc: "dreamer.png",
    firstNight: {
      reminder:
        "The Dreamer points to a player. Show 1 good and 1 evil character token; one of these is correct.",
      order: 42,
      setReminders: ["dream"],
      playerMessage: {
        type: "reveal-character",
        count: 2,
      },
    },
    otherNight: {
      reminder:
        "The Dreamer points to a player. Show 1 good and 1 evil character token; one of these is correct.",
      order: 56,
      setReminders: ["dream"],
      playerMessage: {
        type: "reveal-character",
        count: 2,
      },
    },
  },
  {
    id: "drunk",
    name: "Drunk",
    edition: "tb",
    team: "Outsider",
    reminders: [],
    setup: true,
    delusional: true,
    ability:
      "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.",
    imageSrc: "drunk.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "empath",
    name: "Empath",
    edition: "tb",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night, you learn how many of your 2 alive neighbours are evil.",
    imageSrc: "empath.png",
    firstNight: {
      reminder:
        "Show the finger signal (0, 1, 2) for the number of evil alive neighbours of the Empath.",
      order: 37,
    },
    otherNight: {
      reminder:
        "Show the finger signal (0, 1, 2) for the number of evil neighbours.",
      order: 53,
    },
  },
  {
    id: "evil_twin",
    name: "Evil Twin",
    edition: "snv",
    team: "Minion",
    reminders: [
      {
        name: "twinsies",
        type: "reveal-role",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "You & an opposing player know each other. If the good player is executed, evil wins. Good can't win if you both live.",
    imageSrc: "eviltwin.png",

    firstNight: {
      reminder:
        "Wake the Evil Twin and their twin. Confirm that they have acknowledged each other. Point to the Evil Twin. Show their Evil Twin token to the twin player. Point to the twin. Show their character token to the Evil Twin player.",
      order: 23,
      setReminders: ["twinsies"],
    },
    otherNight: null,
  },
  {
    id: "exorcist",
    name: "Exorcist",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [{ name: "exorcise", duration: 1, type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn't wake tonight.",
    imageSrc: "exorcist.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The Exorcist points to a player, different from the previous night. If that player is the Demon: Wake the Demon. Show the Exorcist token. Point to the Exorcist. The Demon does not act tonight.",
      order: 21,
      setReminders: ["exorcise"],
    },
  },
  {
    id: "fang_gu",
    name: "Fang Gu",
    edition: "snv",
    team: "Demon",
    reminders: [{ name: "jumped", type: "info" }],
    setup: true,
    delusional: false,
    ability:
      "Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider]",
    imageSrc: "fanggu.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The Fang Gu points to a player. That player dies. Or, if that player was an Outsider and there are no other Fang Gu in play: The Fang Gu dies instead of the chosen player. The chosen player is now an evil Fang Gu. Wake the new Fang Gu. Show the 'You are' card, then the Fang Gu token. Show the 'You are' card, then the thumb-down 'evil' hand sign.",
      order: 29,
      playerMessage: {
        type: "role-change",
        alignmentChange: true,
      },
      setReminders: ["jumped"],
    },
  },
  {
    id: "flowergirl",
    name: "Flowergirl",
    edition: "snv",
    team: "Townsfolk",
    reminders: [
      { name: "demon voted", type: "info", duration: 1, dayTrigger: true },
    ],
    setup: false,
    delusional: false,
    ability: "Each night*, you learn if a Demon voted today.",
    imageSrc: "flowergirl.png",
    firstNight: null,
    otherNight: {
      reminder:
        "Nod 'yes' or shake head 'no' for whether the Demon voted today. Place the 'Demon not voted' marker (remove 'Demon voted', if any).",
      order: 57,
    },
  },
  {
    id: "fool",
    name: "Fool",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability: "The first time you die, you don't.",
    imageSrc: "fool.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "fortune_teller",
    name: "Fortune Teller",
    edition: "tb",
    team: "Townsfolk",
    reminders: [{ name: "red herring", type: "info" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.",
    imageSrc: "fortuneteller.png",
    firstNight: {
      reminder:
        "The Fortune Teller points to two players. Give the head signal (nod yes, shake no) for whether one of those players is the Demon. ",
      order: 38,
      setReminders: ["red herring"],
    },
    otherNight: {
      reminder:
        "The Fortune Teller points to two players. Show the head signal (nod 'yes', shake 'no') for whether one of those players is the Demon.",
      order: 54,
    },
  },
  {
    id: "gambler",
    name: "Gambler",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player & guess their character: if you guess wrong, you die.",
    imageSrc: "gambler.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The Gambler points to a player, and a character on their sheet. If incorrect, the Gambler dies.",
      order: 10,
    },
  },
  {
    id: "godfather",
    name: "Godfather",
    edition: "bmr",
    team: "Minion",
    reminders: [{ name: "see the targets", type: "reveal-role" }],
    setup: true,
    delusional: false,
    ability:
      "You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [−1 or +1 Outsider]",
    imageSrc: "godfather.png",
    firstNight: {
      reminder: "Show each of the Outsider tokens in play.",
      order: 21,
      setReminders: ["see the targets"],
      playerMessage: {
        type: "reveal-role",
        count: 1,
        restriction: {
          team: ["Outsider"],
        },
      },
    },
    otherNight: {
      reminder:
        "If an Outsider died today: The Godfather points to a player. That player dies.",
      order: 37,
    },
  },
  {
    id: "goon",
    name: "Goon",
    edition: "bmr",
    team: "Outsider",
    reminders: [{ name: "gooned", type: "drunk", duration: 1 }],
    setup: false,
    delusional: false,
    ability:
      "Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment.",
    imageSrc: "goon.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "gossip",
    name: "Gossip",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [
      { name: "gossiped", type: "info", dayTrigger: true, duration: 1 },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each day, you may make a public statement. Tonight, if it was true, a player dies.",
    imageSrc: "gossip.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If the Gossip’s public statement was true: Choose a player not protected from dying tonight. That player dies.",
      order: 38,
    },
  },
  {
    id: "grandmother",
    name: "Grandmother",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [{ name: "grandchild", type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability:
      "You start knowing a good player & their character. If the Demon kills them, you die too.",
    imageSrc: "grandmother.png",
    firstNight: {
      reminder: "Show the marked character token. Point to the marked player.",
      order: 40,
      setReminders: ["grandchild"],
      playerMessage: {
        type: "reveal-role",
        count: 2,
        restriction: {
          team: ["Townsfolk", "Outsider"],
        },
      },
    },
    otherNight: {
      reminder:
        "If the Grandmother’s grandchild was killed by the Demon tonight: The Grandmother dies.",
      order: 51,
    },
  },
  {
    id: "imp",
    name: "Imp",
    edition: "tb",
    team: "Demon",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
    imageSrc: "imp.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The Imp points to a player. That player dies. If the Imp chose themselves: Replace the character of 1 alive minion with a spare Imp token. Show the 'You are' card, then the Imp token.",
      order: 24,
    },
  },
  {
    id: "innkeeper",
    name: "Innkeeper",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [
      { name: "resting", type: "protected", duration: 1 },
      { name: "resting too much", type: "drunk", duration: 1 },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose 2 players: they can't die tonight, but 1 is drunk until dusk.",
    imageSrc: "innkeeper.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The previously protected and drunk players lose those markers. The Innkeeper points to two players. Those players are protected. One is drunk.",
      order: 9,
      setReminders: ["resting", "resting", "resting too much"],
    },
  },
  {
    id: "investigator",
    name: "Investigator",
    edition: "tb",
    team: "Townsfolk",
    reminders: [{ name: "lead", type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability: "You start knowing that 1 of 2 players is a particular Minion.",
    imageSrc: "investigator.png",
    firstNight: {
      reminder:
        "Show the character token of a Minion in play. Point to two players, one of which is that character.",
      order: 35,
      setReminders: ["lead", "lead"],
      playerMessage: {
        type: "reveal-role",
        count: 2,
        restriction: {
          team: ["Minion"],
        },
      },
    },
    otherNight: null,
  },
  {
    id: "juggler",
    name: "Juggler",
    edition: "snv",
    team: "Townsfolk",
    reminders: [{ name: "juggled correct", type: "counter" }],
    setup: false,
    delusional: false,
    ability:
      "On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct.",
    imageSrc: "juggler.png",
    firstNight: null,
    otherNight: {
      setReminders: ["juggled correct"],
      reminder:
        "If today was the Juggler’s first day: Show the hand signal for the number (0, 1, 2, etc.) of 'Correct' markers. Remove markers.",
      order: 61,
    },
  },
  {
    id: "klutz",
    name: "Klutz",
    edition: "snv",
    team: "Outsider",
    reminders: [
      { name: "klutz", type: "triggerOnDeath" },
      {
        name: "slipped on a banana",
        type: "info",
        causedByDeath: true,
        dayReminder: true,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.",
    imageSrc: "klutz.png",
    firstNight: {
      reminder: "Apply the klutz status to the klutz",
      order: 0,
      setReminders: ["klutz"],
    },
    otherNight: null,
  },
  {
    id: "librarian",
    name: "Librarian",
    edition: "tb",
    team: "Townsfolk",
    reminders: [{ name: "potential outsider", type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability:
      "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)",
    imageSrc: "librarian.png",
    firstNight: {
      reminder:
        "Show the character token of an Outsider in play. Point to two players, one of which is that character.",
      order: 34,
      setReminders: ["potential outsider"],
      playerMessage: {
        type: "reveal-role",
        count: 2,
        restriction: {
          team: ["Outsider"],
        },
      },
    },
    otherNight: null,
  },
  {
    id: "mastermind",
    name: "Mastermind",
    edition: "bmr",
    team: "Minion",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.",
    imageSrc: "mastermind.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "mathematician",
    name: "Mathematician",
    edition: "snv",
    team: "Townsfolk",
    reminders: [{ name: "abnormal", type: "counter" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character's ability.",
    imageSrc: "mathematician.png",
    firstNight: {
      setReminders: ["abnormal"],
      reminder:
        "Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.",
      order: 52,
    },
    otherNight: {
      setReminders: ["abnormal"],
      reminder:
        "Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.",
      order: 71,
    },
  },
  {
    id: "mayor",
    name: "Mayor",
    edition: "tb",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.",
    imageSrc: "mayor.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "minstrel",
    name: "Minstrel",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [
      { name: "minstrel", type: "triggerOnDeath" },
      { name: "listening", type: "poison", duration: 1 },
    ],
    setup: false,
    delusional: false,
    ability:
      "When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.",
    imageSrc: "minstrel.png",
    firstNight: {
      reminder: "Apply the minstrel token to all minions",
      setReminders: ["minstrel"],
      order: 0,
    },
    otherNight: null,
  },
  {
    id: "monk",
    name: "Monk",
    edition: "tb",
    team: "Townsfolk",
    reminders: [{ name: "holy protection", type: "protected", duration: 1 }],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player (not yourself): they are safe from the Demon tonight.",
    imageSrc: "monk.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The previously protected player is no longer protected. The Monk points to a player not themself. Mark that player 'Protected'.",
      order: 12,
      setReminders: ["holy protection"],
    },
  },
  {
    id: "moonchild",
    name: "Moonchild",
    edition: "bmr",
    team: "Outsider",
    reminders: [
      {
        name: "moonchild",
        type: "triggerOnDeath",
      },
      { name: "moonchild died", type: "info", dayReminder: true, duration: 1 },
    ],
    setup: false,
    delusional: false,
    ability:
      "When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.",
    imageSrc: "moonchild.png",
    firstNight: {
      setReminders: ["moonchild"],
      reminder: "Set the moonchild status on the moonchild.",
      order: 0,
    },
    otherNight: {
      setReminders: ["moonchild died"],
      reminder:
        "If the Moonchild used their ability to target a player today: If that player is good, they die.",
      order: 50,
    },
  },
  {
    id: "mutant",
    name: "Mutant",
    edition: "snv",
    team: "Outsider",
    reminders: [
      {
        name: "mutant",
        type: "mad",
      },
    ],
    setup: false,
    delusional: false,
    ability: "If you are “mad” about being an Outsider, you might be executed.",
    imageSrc: "mutant.png",
    firstNight: {
      order: 0,
      reminder: "Apply the Mad reminder to the mutant",
      setReminders: ["mutant"],
    },
    otherNight: null,
  },
  {
    id: "no_dashii",
    name: "No Dashii",
    edition: "snv",
    team: "Demon",
    reminders: [{ name: "gross", type: "poison" }],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player: they die. Your 2 Townsfolk neighbours are poisoned.",
    imageSrc: "nodashii.png",
    firstNight: null,
    otherNight: {
      setReminders: ["gross"],
      reminder: "The No Dashii points to a player. That player dies.",
      order: 30,
    },
  },
  {
    id: "oracle",
    name: "Oracle",
    edition: "snv",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "Each night*, you learn how many dead players are evil.",
    imageSrc: "oracle.png",
    firstNight: null,
    otherNight: {
      reminder:
        "Show the hand signal for the number (0, 1, 2, etc.) of dead evil players.",
      order: 59,
    },
  },
  {
    id: "pacifist",
    name: "Pacifist",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "Executed good players might not die.",
    imageSrc: "pacifist.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "philosopher",
    name: "Philosopher",
    edition: "snv",
    team: "Townsfolk",
    reminders: [{ name: "dumbfounded", type: "drunk" }],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk.",
    imageSrc: "philosopher.png",
    firstNight: {
      reminder:
        "The Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token and add the 'Is the Philosopher' reminder. If the character is in play, place the drunk marker by that player.",
      order: 2,
    },
    otherNight: {
      reminder:
        "If the Philosopher has not used their ability: the Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token and add the 'Is the Philosopher' reminder. If the character is in play, place the drunk marker by that player.",
      order: 2,
    },
  },
  {
    id: "pit-hag",
    name: "Pit-Hag",
    edition: "snv",
    team: "Minion",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player & a character they become (if not-in-play). If a Demon is made, deaths tonight are arbitrary.",
    imageSrc: "pithag.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The Pit-Hag points to a player and a character on the sheet. If this character is not in play, wake that player and show them the 'You are' card and the relevant character token. If the character is in play, nothing happens.",
      order: 16,
      playerMessage: {
        type: "role-change",
        alignmentChange: false,
      },
    },
  },
  {
    id: "po",
    name: "Po",
    edition: "bmr",
    team: "Demon",
    reminders: [{ name: "charged", type: "info" }],
    setup: false,
    delusional: false,
    ability:
      "Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.",
    imageSrc: "po.png",
    firstNight: null,
    otherNight: {
      setReminders: ["charged"],
      reminder:
        "If the Po chose no-one the previous night: The Po points to three players. Otherwise: The Po either shows the 'no' head signal , or points to a player. Chosen players die",
      order: 28,
    },
  },
  {
    id: "poisoner",
    name: "Poisoner",
    edition: "tb",
    team: "Minion",
    reminders: [{ name: "poisoned", type: "poison" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player: they are poisoned tonight and tomorrow day.",
    imageSrc: "poisoner.png",
    firstNight: {
      setReminders: ["poisoned"],
      reminder: "The Poisoner points to a player. That player is poisoned.",
      order: 17,
    },
    otherNight: {
      setReminders: ["poisoned"],
      reminder:
        "The previously poisoned player is no longer poisoned. The Poisoner points to a player. That player is poisoned.",
      order: 7,
    },
  },
  {
    id: "professor",
    name: "Professor",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.",
    imageSrc: "professor.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If the Professor has not used their ability: The Professor either shakes their head no, or points to a player. If that player is a Townsfolk, they are now alive.",
      order: 43,
      setReminders: [ABILITY_SPENT.name],
      playerMessage: {
        type: "revived",
      },
    },
  },
  {
    id: "pukka",
    name: "Pukka",
    edition: "bmr",
    team: "Demon",
    reminders: [{ name: "marked for death", type: "poison" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.",
    imageSrc: "pukka.png",
    firstNight: {
      setReminders: ["marked for death"],
      reminder: "The Pukka points to a player. That player is poisoned.",
      order: 28,
    },
    otherNight: {
      setReminders: ["marked for death"],
      reminder:
        "The Pukka points to a player. That player is poisoned. The previously poisoned player dies. ",
      order: 26,
    },
  },
  {
    id: "ravenkeeper",
    name: "Ravenkeeper",
    edition: "tb",
    team: "Townsfolk",
    reminders: [
      {
        name: "ravenkeeper",
        type: "triggerOnDeath",
        causedByDeath: true,
        duration: 1,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "If you die at night, you are woken to choose a player: you learn their character.",
    imageSrc: "ravenkeeper.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If the Ravenkeeper died tonight: The Ravenkeeper points to a player. Show that player’s character token.",
      order: 52,
      playerMessage: {
        type: "reveal-character",
        count: 1,
      },
    },
  },
  {
    id: "recluse",
    name: "Recluse",
    edition: "tb",
    team: "Outsider",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "You might register as evil & as a Minion or Demon, even if dead.",
    imageSrc: "recluse.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "sage",
    name: "Sage",
    edition: "snv",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "If the Demon kills you, you learn that it is 1 of 2 players.",
    imageSrc: "sage.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If the Sage was killed by a Demon: Point to two players, one of which is that Demon.",
      order: 42,
      playerMessage: {
        type: "reveal-team",
        count: 2,
        restriction: {
          team: ["Demon"],
        },
      },
    },
  },
  {
    id: "sailor",
    name: "Sailor",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [{ name: "hammered", type: "drunk" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose an alive player: either you or they are drunk until dusk. You can't die.",
    imageSrc: "sailor.png",
    firstNight: {
      setReminders: ["hammered"],
      reminder:
        "The Sailor points to a living player. Either the Sailor, or the chosen player, is drunk.",
      order: 11,
    },
    otherNight: {
      setReminders: ["hammered"],
      reminder:
        "The previously drunk player is no longer drunk. The Sailor points to a living player. Either the Sailor, or the chosen player, is drunk.",
      order: 4,
    },
  },
  {
    id: "saint",
    name: "Saint",
    edition: "tb",
    team: "Outsider",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "If you die by execution, your team loses.",
    imageSrc: "saint.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "savant",
    name: "Savant",
    edition: "snv",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false.",
    imageSrc: "savant.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "scarlet_woman",
    name: "Scarlet Woman",
    edition: "tb",
    team: "Minion",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don’t count)",
    imageSrc: "scarletwoman.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If the Scarlet Woman became the Demon today: Show the 'You are' card, then the demon token.",
      order: 19,
      playerMessage: {
        type: "role-change",
        alignmentChange: true,
      },
    },
  },
  {
    id: "seamstress",
    name: "Seamstress",
    edition: "snv",
    team: "Townsfolk",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment.",
    imageSrc: "seamstress.png",
    firstNight: {
      reminder:
        "The Seamstress either shows a 'no' head signal, or points to two other players. If the Seamstress chose players , nod 'yes' or shake 'no' for whether they are of same alignment.",
      order: 43,
    },
    otherNight: {
      reminder:
        "If the Seamstress has not yet used their ability: the Seamstress either shows a 'no' head signal, or points to two other players. If the Seamstress chose players , nod 'yes' or shake 'no' for whether they are of same alignment.",
      order: 60,
    },
  },
  {
    id: "shabaloth",
    name: "Shabaloth",
    edition: "bmr",
    team: "Demon",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.",
    imageSrc: "shabaloth.png",
    firstNight: null,
    otherNight: {
      reminder:
        "One player that the Shabaloth chose the previous night might be resurrected. The Shabaloth points to two players. Those players die.",
      order: 27,
      playerMessage: {
        type: "revived",
      },
    },
  },
  {
    id: "slayer",
    name: "Slayer",
    edition: "tb",
    team: "Townsfolk",
    reminders: [{ ...ABILITY_SPENT, dayTrigger: true }],
    setup: false,
    delusional: false,
    ability:
      "Once per game, during the day, publicly choose a player: if they are the Demon, they die.",
    imageSrc: "slayer.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "snake_charmer",
    name: "Snake Charmer",
    edition: "snv",
    team: "Townsfolk",
    reminders: [{ name: "charmed", type: "poison" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned.",
    imageSrc: "snakecharmer.png",
    firstNight: {
      setReminders: ["charmed"],
      reminder:
        "The Snake Charmer points to a player. If that player is the Demon: swap the Demon and Snake Charmer character and alignments. Wake each player to inform them of their new role and alignment. The new Snake Charmer is poisoned.",
      order: 20,
      playerMessage: {
        type: "role-change",
        alignmentChange: true,
      },
    },
    otherNight: {
      setReminders: ["charmed"],
      reminder:
        "The Snake Charmer points to a player. If that player is the Demon: swap the Demon and Snake Charmer character and alignments. Wake each player to inform them of their new role and alignment. The new Snake Charmer is poisoned.",
      order: 11,
      playerMessage: {
        type: "role-change",
        alignmentChange: true,
      },
    },
  },
  {
    id: "soldier",
    name: "Soldier",
    edition: "tb",
    team: "Townsfolk",
    reminders: [{ name: "sturdy", type: "protected" }],
    setup: false,
    delusional: false,
    ability: "You are safe from the Demon.",
    imageSrc: "soldier.png",
    firstNight: {
      reminder: "Set the sturdy token on the soldier",
      setReminders: ["sturdy"],
      order: 0,
    },
    otherNight: null,
  },
  {
    id: "spy",
    name: "Spy",
    edition: "tb",
    team: "Minion",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.",
    imageSrc: "spy.png",
    firstNight: {
      reminder: "Show the Grimoire to the Spy for as long as they need.",
      order: 49,
    },
    otherNight: {
      reminder: "Show the Grimoire to the Spy for as long as they need.",
      order: 68,
    },
  },
  {
    id: "sweetheart",
    name: "Sweetheart",
    edition: "snv",
    team: "Outsider",
    reminders: [
      { name: "loveable", type: "triggerOnDeath" },
      { name: "in love", type: "poison" },
    ],
    setup: false,
    delusional: false,
    ability: "When you die, 1 player is drunk from now on.",
    imageSrc: "sweetheart.png",
    firstNight: {
      order: 0,
      setReminders: ["loveable"],
      reminder: "Set the loveable token on the sweetheart",
    },
    otherNight: {
      setReminders: ["in love"],
      reminder: "Choose a player that is drunk.",
      order: 41,
    },
  },
  {
    id: "tea_lady",
    name: "Tea Lady",
    edition: "bmr",
    team: "Townsfolk",
    reminders: [{ name: "rested", type: "protected" }],
    setup: false,
    delusional: false,
    ability: "If both your alive neighbours are good, they can't die.",
    imageSrc: "tealady.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "tinker",
    name: "Tinker",
    edition: "bmr",
    team: "Outsider",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "You might die at any time.",
    imageSrc: "tinker.png",
    firstNight: null,
    otherNight: {
      reminder: "The Tinker might die.",
      order: 49,
    },
  },
  {
    id: "town_crier",
    name: "Town Crier",
    edition: "snv",
    team: "Townsfolk",
    reminders: [
      {
        name: "minions nominated today",
        type: "info",
        dayTrigger: true,
        duration: 1,
      },
    ],
    setup: false,
    delusional: false,
    ability: "Each night*, you learn if a Minion nominated today.",
    imageSrc: "towncrier.png",
    firstNight: null,
    otherNight: {
      reminder:
        "Nod 'yes' or shake head 'no' for whether a Minion nominated today. Place the 'Minion not nominated' marker (remove 'Minion nominated', if any).",
      order: 58,
    },
  },
  {
    id: "undertaker",
    name: "Undertaker",
    edition: "tb",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "Each night*, you learn which character died by execution today.",
    imageSrc: "undertaker.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If a player was executed today: Show that player’s character token.",
      order: 55,
      playerMessage: {
        type: "reveal-character",
        count: 1,
      },
    },
  },
  {
    id: "vigormortis",
    name: "Vigormortis",
    edition: "snv",
    team: "Demon",
    reminders: [
      { name: "poisoned", type: "poison" },
      { name: "has ability", type: "info" },
    ],
    setup: true,
    delusional: false,
    ability:
      "Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbour. [−1 Outsider]",
    imageSrc: "vigormortis.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The Vigormortis points to a player. That player dies. If a Minion, they keep their ability and one of their Townsfolk neighbours is poisoned.",
      order: 32,
    },
  },
  {
    id: "virgin",
    name: "Virgin",
    edition: "tb",
    team: "Townsfolk",
    reminders: [
      {
        name: "virgin",
        type: "protected",
        dayReminder: true,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.",
    imageSrc: "virgin.png",
    firstNight: {
      order: 0,
      reminder: "Add the virgin token to the virgin",
      setReminders: ["virgin"],
    },
    otherNight: null,
  },
  {
    id: "vortox",
    name: "Vortox",
    edition: "snv",
    team: "Demon",
    reminders: [{ name: "vortox", type: "info" }],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins.",
    imageSrc: "vortox.png",
    firstNight: null,
    otherNight: {
      reminder: "The Vortox points to a player. That player dies.",
      order: 31,
    },
  },
  {
    id: "washerwoman",
    name: "Washerwoman",
    edition: "tb",
    team: "Townsfolk",
    reminders: [{ name: "customer", type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability: "You start knowing that 1 of 2 players is a particular Townsfolk.",
    imageSrc: "washerwoman.png",
    firstNight: {
      reminder:
        "Show the character token of a Townsfolk in play. Point to two players, one of which is that character.",
      order: 33,
      setReminders: ["customer", "customer"],
      playerMessage: {
        type: "reveal-role",
        count: 2,
        restriction: { team: ["Townsfolk"] },
      },
    },
    otherNight: null,
  },
  {
    id: "witch",
    name: "Witch",
    edition: "snv",
    team: "Minion",
    reminders: [{ name: "cursed", type: "info", dayReminder: true }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability.",
    imageSrc: "witch.png",
    firstNight: {
      setReminders: ["cursed"],
      reminder:
        "The Witch points to a player. If that player nominates tomorrow they die immediately.",
      order: 24,
    },
    otherNight: {
      setReminders: ["cursed"],
      reminder:
        "If there are 4 or more players alive: The Witch points to a player. If that player nominates tomorrow they die immediately.",
      order: 14,
    },
  },
  {
    id: "zombuul",
    name: "Zombuul",
    edition: "bmr",
    team: "Demon",
    reminders: [{ name: "zombie", type: "info", persistOnDeath: true }],
    setup: false,
    delusional: false,
    ability:
      "Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.",
    imageSrc: "zombuul.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If no-one died during the day: The Zombuul points to a player. That player dies.",
      order: 25,
    },
  },
  {
    id: "alchemist",
    name: "Alchemist",
    edition: "",
    team: "Townsfolk",
    reminders: [{ type: "info", name: "alchemist" }],
    setup: false,
    delusional: false,
    ability: "You have a not-in-play Minion ability.",
    imageSrc: "alchemist.png",
    firstNight: {
      setReminders: ["alchemist"],
      reminder: "Show the Alchemist a not-in-play Minion token",
      order: 3,
      playerMessage: {
        type: "reveal-role",
        count: 0,
        restriction: {
          inPlay: true,
        },
      },
    },
    otherNight: null,
  },
  {
    id: "amnesiac",
    name: "Amnesiac",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are.",
    imageSrc: "amnesiac.png",
    firstNight: {
      reminder:
        "Decide the Amnesiac's entire ability. If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
      order: 32,
    },
    otherNight: {
      reminder:
        "If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
      order: 47,
    },
  },
  {
    id: "atheist",
    name: "Atheist",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: true,
    delusional: false,
    ability:
      "The Storyteller can break the game rules & if executed, good wins, even if you are dead. [No evil characters]",
    imageSrc: "atheist.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "balloonist",
    name: "Balloonist",
    edition: "",
    team: "Townsfolk",
    reminders: [
      { name: "seen townsfolk", type: "info" },
      { name: "seen outsider", type: "info" },
      { name: "seen minion", type: "info" },
      { name: "seen demon", type: "info" },
      { name: "seen traveler", type: "info" },
    ],
    setup: true,
    delusional: false,
    ability:
      "Each night, you learn 1 player of each character type, until there are no more types to learn. [+1 Outsider]",
    imageSrc: "balloonist.png",
    firstNight: {
      reminder:
        "Choose a character type. Point to a player whose character is of that type. Place the Balloonist's Seen reminder next to that character.",
      order: 45,
      playerMessage: {
        type: "reveal-team",
        count: 1,
      },
    },
    otherNight: {
      reminder:
        "Choose a character type that does not yet have a Seen reminder next to a character of that type. Point to a player whose character is of that type, if there are any. Place the Balloonist's Seen reminder next to that character.",
      order: 62,
      playerMessage: {
        type: "reveal-team",
        count: 1,
      },
    },
  },
  {
    id: "bounty_hunter",
    name: "Bounty Hunter",
    edition: "",
    team: "Townsfolk",
    reminders: [
      { name: "bounty", type: "triggerOnDeath" },
      { name: "turned", type: "info" },
    ],
    setup: true,
    delusional: false,
    ability:
      "You start knowing 1 evil player. If the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]",
    imageSrc: "bountyhunter.png",
    firstNight: {
      reminder:
        "Choose a townsfolk, they are evil. Wake this townsfolk and show them the 'You are' card and the thumbs down evil sign.",
      order: 46,
      playerMessage: {
        type: "alignment-change",
        restriction: {
          alignment: "Evil",
        },
      },
    },
    otherNight: {
      reminder:
        "If the known evil player has died, point to another evil player. ",
      order: 64,
    },
  },
  {
    id: "cannibal",
    name: "Cannibal",
    edition: "",
    team: "Townsfolk",
    reminders: [
      { name: "poisoned", type: "poison", causedByDeath: true, target: "self" },
      { name: "died today", type: "info", causedByDeath: true },
    ],
    setup: false,
    delusional: false,
    ability:
      "You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution.",
    imageSrc: "cannibal.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "choirboy",
    name: "Choirboy",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: true,
    delusional: false,
    ability:
      "If the Demon kills the King, you learn which player is the Demon. [+ the King]",
    imageSrc: "choirboy.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If the King was killed by the Demon, wake the Choirboy and point to the Demon player.",
      order: 44,
      playerMessage: {
        type: "reveal-team",
        count: 1,
        restriction: {
          team: ["Demon"],
        },
      },
    },
  },
  {
    id: "cult_leader",
    name: "Cult Leader",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night, you become the alignment of an alive neighbour. If all good players choose to join your cult, your team wins.",
    imageSrc: "cultleader.png",
    firstNight: {
      reminder:
        "If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly.",
      order: 48,
      playerMessage: {
        type: "alignment-change",
      },
    },
    otherNight: {
      reminder:
        "If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly.",
      order: 66,
      playerMessage: {
        type: "alignment-change",
      },
    },
  },
  {
    id: "engineer",
    name: "Engineer",
    edition: "",
    team: "Townsfolk",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night, choose which Minions or which Demon is in play.",
    imageSrc: "engineer.png",
    firstNight: {
      setReminders: ["ability spent"],
      reminder:
        "The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions. If the Engineer chose characters, replace the Demon or Minions with the choices, then wake the relevant players and show them the You are card and the relevant character tokens.",
      order: 13,
      playerMessage: {
        type: "role-change",
        alignmentChange: false,
      },
    },
    otherNight: {
      setReminders: ["ability spent"],
      reminder:
        "The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions. If the Engineer chose characters, replace the Demon or Minions with the choices, then wake the relevant players and show them the 'You are' card and the relevant character tokens.",
      order: 5,
      playerMessage: {
        type: "role-change",
        alignmentChange: false,
      },
    },
  },
  {
    id: "farmer",
    name: "Farmer",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "If you die at night, an alive good player becomes a Farmer.",
    imageSrc: "farmer.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If a Farmer died tonight, choose another good player and make them the Farmer. Wake this player, show them the 'You are' card and the Farmer character token.",
      order: 48,
      playerMessage: {
        type: "role-change",
        alignmentChange: false,
      },
    },
  },
  {
    id: "fisherman",
    name: "Fisherman",
    edition: "",
    team: "Townsfolk",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "Once per game, during the day, visit the Storyteller for some advice to help you win.",
    imageSrc: "fisherman.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "general",
    name: "General",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night, you learn which alignment the Storyteller believes is winning: good, evil, or neither.",
    imageSrc: "general.png",
    firstNight: {
      reminder:
        "Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither.",
      order: 50,
    },
    otherNight: {
      reminder:
        "Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither.",
      order: 69,
    },
  },
  {
    id: "huntsman",
    name: "Huntsman",
    edition: "",
    team: "Townsfolk",
    reminders: [ABILITY_SPENT],
    setup: true,
    delusional: false,
    ability:
      "Once per game, at night, choose a living player: the Damsel, if chosen, becomes a not-in-play Townsfolk. [+the Damsel]",
    imageSrc: "huntsman.png",
    firstNight: {
      setReminders: ["ability spent"],
      reminder:
        "The Huntsman shakes their head 'no' or points to a player. If they point to the Damsel, wake that player, show the 'You are' card and a not-in-play character token.",
      order: 30,
      playerMessage: {
        type: "role-change",
        alignmentChange: false,
        restriction: {
          inPlay: false,
          team: ["Townsfolk"],
        },
      },
    },
    otherNight: {
      setReminders: ["ability spent"],
      reminder:
        "The Huntsman shakes their head 'no' or points to a player. If they point to the Damsel, wake that player, show the 'You are' card and a not-in-play character token.",
      order: 45,
      playerMessage: {
        alignmentChange: false,
        type: "role-change",
        restriction: {
          inPlay: false,
          team: ["Townsfolk"],
        },
      },
    },
  },
  {
    id: "king",
    name: "King",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night, if the dead outnumber the living, you learn 1 alive character. The Demon knows who you are.",
    imageSrc: "king.png",
    firstNight: {
      reminder:
        "Wake the Demon, show them the 'This character selected you' card, show the King token and point to the King player.",
      order: 10,
      playerMessage: {
        type: "character-selected-you",
        restriction: {
          role: ["king"],
        },
      },
    },
    otherNight: {
      reminder:
        "If there are more dead than living, show the King a character token of a living player.",
      order: 63,
      playerMessage: {
        type: "reveal-role",
        count: 0,
      },
    },
  },
  {
    id: "lycanthrope",
    name: "Lycanthrope",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a living player: if good, they die, but they are the only player that can die tonight.",
    imageSrc: "lycanthrope.png",
    firstNight: null,
    otherNight: {
      reminder:
        "The Lycanthrope points to a living player: if good, they die and no one else can die tonight.",
      order: 22,
    },
  },
  {
    id: "magician",
    name: "Magician",
    edition: "",
    team: "Townsfolk",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "The Demon thinks you are a Minion. Minions think you are a Demon.",
    imageSrc: "magician.png",
    firstNight: {
      reminder:
        "When you wake the minions, show them both the magician and the demon.  When you wake the Demon, show them all minions and the magician",
      order: 5,
    },
    otherNight: null,
  },
  {
    id: "nightwatchman",
    name: "Nightwatchman",
    edition: "",
    team: "Townsfolk",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night, choose a player: they learn who you are.",
    imageSrc: "nightwatchman.png",
    firstNight: {
      setReminders: ["ability spent"],
      reminder:
        "The Nightwatchman may point to a player. Wake that player, show the 'This character selected you' card and the Nightwatchman token, then point to the Nightwatchman player.",
      order: 47,
    },
    otherNight: {
      setReminders: ["ability spent"],
      reminder:
        "The Nightwatchman may point to a player. Wake that player, show the 'This character selected you' card and the Nightwatchman token, then point to the Nightwatchman player.",
      order: 65,
      playerMessage: {
        type: "reveal-role",
        count: 1,
        restriction: {
          role: ["nightwatchman"],
        },
      },
    },
  },
  {
    id: "noble",
    name: "Noble",
    edition: "",
    team: "Townsfolk",
    reminders: [{ name: "seen", type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability: "You start knowing 3 players, 1 and only 1 of which is evil.",
    imageSrc: "noble.png",
    firstNight: {
      setReminders: ["seen", "seen", "seen"],
      reminder:
        "Point to 3 players including one evil player, in no particular order.",
      order: 44,
      playerMessage: {
        type: "reveal-team",
        count: 3,
        restriction: {
          alignment: "Evil",
          guess: false,
        },
      },
    },
    otherNight: null,
  },
  {
    id: "pixie",
    name: "Pixie",
    edition: "",
    team: "Townsfolk",
    reminders: [
      { name: "mad", type: "mad" },
      { name: "has ability", type: "info", causedByDeath: true },
    ],
    setup: false,
    delusional: false,
    ability:
      "You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die.",
    imageSrc: "pixie.png",
    firstNight: {
      setReminders: ["mad", "has ability"],
      reminder: "Show the Pixie 1 in-play Townsfolk character token.",
      order: 29,
      playerMessage: {
        type: "reveal-role",
        count: 1,
        restriction: {
          team: ["Townsfolk"],
        },
      },
    },
    otherNight: null,
  },
  {
    id: "poppy_grower",
    name: "Poppy Grower",
    edition: "",
    team: "Townsfolk",
    reminders: [{ name: "evil wakes", type: "info", causedByDeath: true }],
    setup: false,
    delusional: false,
    ability:
      "Minions & Demons do not know each other. If you die, they learn who each other are that night.",
    imageSrc: "poppygrower.png",
    firstNight: {
      reminder: "Do not inform the Demon/Minions who each other are",
      order: 4,
    },
    otherNight: {
      setReminders: ["evil wakes"],
      reminder:
        "If the Poppy Grower has died, show the Minions/Demon who each other are.",
      order: 3,
      playerMessage: {
        type: "demon-first-night",
      },
    },
  },
  {
    id: "preacher",
    name: "Preacher",
    edition: "",
    team: "Townsfolk",
    reminders: [{ name: "no ability", type: "reveal-role" }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability.",
    imageSrc: "preacher.png",
    firstNight: {
      setReminders: ["no ability"],
      reminder:
        "The Preacher chooses a player. If a Minion is chosen, wake the Minion and show the 'This character selected you' card and then the Preacher token.",
      order: 14,
      playerMessage: {
        type: "character-selected-you",
      },
    },
    otherNight: {
      setReminders: ["no ability"],
      reminder:
        "The Preacher chooses a player. If a Minion is chosen, wake the Minion and show the 'This character selected you' card and then the Preacher token.",
      order: 6,
      playerMessage: {
        type: "character-selected-you",
      },
    },
  },
  {
    id: "acrobat",
    name: "Acrobat",
    edition: "",
    team: "Outsider",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night*, if either good living neighbour is drunk or poisoned, you die.",
    imageSrc: "acrobat.png",
    firstNight: null,
    otherNight: {
      reminder:
        "If a good living neighbour is drunk or poisoned, the Acrobat player dies.",
      order: 39,
    },
  },
  {
    id: "damsel",
    name: "Damsel",
    edition: "",
    team: "Outsider",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "All Minions know you are in play. If a Minion publicly guesses you (once), your team loses.",
    imageSrc: "damsel.png",
    firstNight: {
      setReminders: ["ability spent"],
      reminder:
        "Wake all the Minions, show them the 'This character selected you' card and the Damsel token.",
      order: 31,
      playerMessage: {
        type: "character-selected-you",
      },
    },
    otherNight: {
      setReminders: ["ability spent"],
      reminder:
        "If selected by the Huntsman, wake the Damsel, show 'You are' card and a not-in-play Townsfolk token.",
      order: 46,
      playerMessage: {
        type: "role-change",
        alignmentChange: false,
        restriction: {
          inPlay: false,
          team: ["Townsfolk"],
        },
      },
    },
  },
  {
    id: "golem",
    name: "Golem",
    edition: "",
    team: "Outsider",
    reminders: [
      {
        name: "can not nominate",
        type: "info",
        persistOnDeath: true,
        dayReminder: true,
        target: "self",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "You may only nominate once per game. When you do, if the nominee is not the Demon, they die.",
    imageSrc: "golem.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "heretic",
    name: "Heretic",
    edition: "",
    team: "Outsider",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "Whoever wins, loses & whoever loses, wins, even if you are dead.",
    imageSrc: "heretic.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "politician",
    name: "Politician",
    edition: "",
    team: "Outsider",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "If you were the player most responsible for your team losing, you change alignment & win, even if dead.",
    imageSrc: "politician.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "puzzlemaster",
    name: "Puzzlemaster",
    edition: "",
    team: "Outsider",
    reminders: [
      { name: "drunk", type: "drunk", persistOnDeath: true },
      ABILITY_SPENT,
    ],
    setup: false,
    delusional: false,
    ability:
      "1 player is drunk, even if you die. If you guess (once) who it is, learn the Demon player, but guess wrong & get false info.",
    imageSrc: "puzzlemaster.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "snitch",
    name: "Snitch",
    edition: "",
    team: "Outsider",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "Minions start knowing 3 not-in-play characters.",
    imageSrc: "snitch.png",
    firstNight: {
      reminder:
        "After Minion info wake each Minion and show them three not-in-play character tokens. These may be the same or different to each other and the ones shown to the Demon.",
      order: 7,
      playerMessage: {
        type: "demon-first-night",
      },
    },
    otherNight: null,
  },
  {
    id: "boomdandy",
    name: "Boomdandy",
    edition: "",
    team: "Minion",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "If you are executed, all but 3 players die. 1 minute later, the player with the most players pointing at them dies.",
    imageSrc: "boomdandy.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "fearmonger",
    name: "Fearmonger",
    edition: "",
    team: "Minion",
    reminders: [{ name: "fear", type: "info", causedByDeath: true }],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player. If you nominate & execute them, their team loses. All players know if you choose a new player.",
    imageSrc: "fearmonger.png",
    firstNight: {
      setReminders: ["fear"],
      reminder:
        "The Fearmonger points to a player. Place the Fear token next to that player and announce that a new player has been selected with the Fearmonger ability.",
      order: 26,
    },
    otherNight: {
      setReminders: ["fear"],
      reminder:
        "The Fearmonger points to a player. If different from the previous night, place the Fear token next to that player and announce that a new player has been selected with the Fearmonger ability.",
      order: 17,
    },
  },
  {
    id: "goblin",
    name: "Goblin",
    edition: "",
    team: "Minion",
    reminders: [{ name: "claimed", type: "info", dayReminder: true }],
    setup: false,
    delusional: false,
    ability:
      "If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.",
    imageSrc: "goblin.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "legion",
    name: "Legion",
    edition: "",
    team: "Demon",
    reminders: [],
    setup: true,
    delusional: false,
    ability:
      "Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]",
    imageSrc: "legion.png",
    firstNight: null,
    otherNight: {
      reminder: "Choose a player, that player dies.",
      order: 23,
    },
  },
  {
    id: "leviathan",
    name: "Leviathan",
    edition: "",
    team: "Demon",
    reminders: [
      {
        name: "good player executed",
        type: "info",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "If more than 1 good player is executed, you win. All players know you are in play. After day 5, evil wins.",
    imageSrc: "leviathan.png",
    firstNight: {
      reminder:
        "Place the Leviathan 'Day 1' marker. Announce 'The Leviathan is in play; this is Day 1.'",
      order: 54,
    },
    otherNight: {
      setReminders: ["good player executed"],
      reminder: "Change the Leviathan Day reminder for the next day.",
      order: 73,
    },
  },
  {
    id: "lunatic",
    name: "Lunatic",
    edition: "bmr",
    team: "Outsider",
    reminders: [],
    setup: true,
    delusional: true,
    ability:
      "You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.",
    imageSrc: "lunatic.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "marionette",
    name: "Marionette",
    edition: "",
    team: "Minion",
    reminders: [],
    setup: true,
    delusional: true,
    ability:
      "You think you are a good character but you are not. The Demon knows who you are. [You neighbour the Demon]",
    imageSrc: "marionette.png",
    firstNight: {
      reminder:
        "Select one of the good players next to the Demon and place the Is the Marionette reminder token. Wake the Demon and show them the Marionette.",
      order: 12,
      playerMessage: {
        type: "reveal-role",
        count: 1,
        restriction: {
          role: ["marionette"],
        },
      },
    },
    otherNight: null,
  },
  {
    id: "mezepheles",
    name: "Mezepheles",
    edition: "",
    team: "Minion",
    reminders: [
      {
        name: "turns evil",
        type: "info",
        dayTrigger: true,
        dayReminder: true,
        target: "other",
      },
      ABILITY_SPENT,
    ],
    setup: false,
    delusional: false,
    ability:
      "You start knowing a secret word. The 1st good player to say this word becomes evil that night.",
    imageSrc: "mezepheles.png",
    firstNight: {
      setReminders: ["turns evil", "ability spent"],
      reminder: "Show the Mezepheles their secret word.",
      order: 27,
    },
    otherNight: {
      setReminders: ["turns evil", "ability spent"],
      reminder:
        "Wake the 1st good player that said the Mezepheles' secret word and show them the 'You are' card and the thumbs down evil signal.",
      order: 18,
      playerMessage: {
        type: "alignment-change",
        restriction: {
          alignment: "Evil",
        },
      },
    },
  },
  {
    id: "psychopath",
    name: "Psychopath",
    edition: "",
    team: "Minion",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each day, before nominations, you may publicly choose a player: they die. If executed, you only die if you lose roshambo.",
    imageSrc: "psychopath.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "lleech",
    name: "Lleech",
    edition: "",
    team: "Demon",
    reminders: [
      {
        name: "poisoned",
        type: "poison",
      },
      {
        name: "lleech dies",
        type: "info",
        causedByDeath: true,
      },
      {
        name: "protected",
        type: "protected",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a player: they die. You start by choosing an alive player: they are poisoned - you die if & only if they die.",
    imageSrc: "lleech.png",
    firstNight: {
      setReminders: ["poisoned"],
      reminder:
        "The Lleech points to a player. Place the Poisoned reminder token.",
      order: 16,
    },
    otherNight: {
      reminder: "The Lleech points to a player. That player dies.",
      order: 34,
    },
  },
  {
    id: "riot",
    name: "Riot",
    edition: "",
    team: "Demon",
    reminders: [],
    setup: true,
    delusional: false,
    ability:
      "Nominees die, but may nominate again immediately (on day 3, they must). After day 3, evil wins. [All Minions are Riot]",
    imageSrc: "riot.png",
    firstNight: null,
    otherNight: null,
  },
  {
    id: "widow",
    name: "Widow",
    edition: "",
    team: "Demon",
    reminders: [
      {
        name: "poisoned",
        type: "poison",
        duration: 1,
      },
      {
        name: "knows widow in game",
        type: "reveal-role",
        persistOnDeath: true,
        target: "other",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "On your 1st night, look at the Grimoire and choose a player: they are poisoned. 1 good player knows a Widow is in play.",
    imageSrc: "widow.png",
    firstNight: {
      setReminders: ["knows widow in game", "poisoned"],
      reminder:
        "Show the Grimoire to the Widow for as long as they need. The Widow points to a player. That player is poisoned. Wake a good player. Show the 'These characters are in play' card, then the Widow character token.",
      order: 18,
      playerMessage: {
        type: "character-selected-you",
        restriction: {
          role: ["widow"],
        },
      },
    },
    otherNight: null,
  },

  {
    id: "bureaucrat",
    name: "Bureaucrat",
    edition: "tb",
    team: "Traveler",
    reminders: [
      {
        name: "3 votes",
        type: "info",
        duration: 1,
        dayReminder: true,
        target: "other",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.",
    firstNight: {
      setReminders: ["3 votes"],
      reminder:
        "The Bureaucrat points to a player. Put the Bureaucrat's '3 votes' reminder by the chosen player's character token.",
      order: 1,
    },
    otherNight: {
      setReminders: ["3 votes"],
      reminder:
        "The Bureaucrat points to a player. Put the Bureaucrat's '3 votes' reminder by the chosen player's character token.",
      order: 1,
    },
    imageSrc: "bureaucrat.png",
  },
  {
    id: "thief",
    name: "Thief",
    edition: "tb",
    team: "Traveler",
    reminders: [
      {
        name: "negative vote",
        type: "info",
        duration: 1,
        dayReminder: true,
        target: "other",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night, choose a player (not yourself): their vote counts negatively tomorrow.",
    firstNight: {
      setReminders: ["negative vote"],
      reminder:
        "The Thief points to a player. Put the Thief's 'Negative vote' reminder by the chosen player's character token.",
      order: 1,
    },
    otherNight: {
      setReminders: ["negative vote"],
      reminder:
        "The Thief points to a player. Put the Thief's 'Negative vote' reminder by the chosen player's character token.",
      order: 1,
    },
    imageSrc: "thief.png",
  },
  {
    id: "gunslinger",
    name: "Gunslinger",
    edition: "tb",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.",
    firstNight: null,
    otherNight: null,
    imageSrc: "gunslinger.png",
  },
  {
    id: "scapegoat",
    name: "Scapegoat",
    edition: "tb",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "If a player of your alignment is executed, you might be executed instead.",
    firstNight: null,
    otherNight: null,
    imageSrc: "scapegoat.png",
  },
  {
    id: "beggar",
    name: "Beggar",
    edition: "tb",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "You must use a vote token to vote. Dead players may choose to give you theirs. If so, you learn their alignment. You are sober & healthy.",
    firstNight: null,
    otherNight: null,
    imageSrc: "beggar.png",
  },
  {
    id: "apprentice",
    name: "Apprentice",
    edition: "bmr",
    team: "Traveler",
    reminders: [
      {
        name: "is the apprentice",
        type: "info",
        persistOnDeath: true,
        target: "self",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "On your 1st night, you gain a Townsfolk ability (if good), or a Minion ability (if evil).",
    firstNight: {
      setReminders: ["is the apprentice"],
      reminder:
        "Show the Apprentice the 'You are' card, then a Townsfolk or Minion token. In the Grimoire, replace the Apprentice token with that character token, and put the Apprentice's 'Is the Apprentice' reminder by that character token.",
      order: 1,
    },
    otherNight: null,
    imageSrc: "apprentice.png",
  },
  {
    id: "matron",
    name: "Matron",
    edition: "bmr",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private.",
    firstNight: null,
    otherNight: null,
    imageSrc: "matron.png",
  },
  {
    id: "judge",
    name: "Judge",
    edition: "bmr",
    team: "Traveler",
    reminders: [ABILITY_SPENT],
    setup: false,
    delusional: false,
    ability:
      "Once per game, if another player nominated, you may choose to force the current execution to pass or fail.",
    firstNight: null,
    otherNight: null,
    imageSrc: "judge.png",
  },
  {
    id: "bishop",
    name: "Bishop",
    edition: "bmr",
    team: "Traveler",
    reminders: [
      {
        name: "nominate good",
        type: "info",
        dayTrigger: true,
      },
      {
        name: "nominate evil",
        type: "info",
        dayTrigger: true,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Only the Storyteller can nominate. At least 1 opposite player must be nominated each day.",
    firstNight: null,
    otherNight: null,
    imageSrc: "bishop.png",
  },
  {
    id: "voudon",
    name: "Voudon",
    edition: "bmr",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Only you and the dead can vote. They don't need a vote token to do so. A 50% majority is not required.",
    firstNight: null,
    otherNight: null,
    imageSrc: "voudon.png",
  },
  {
    id: "barista",
    name: "Barista",
    edition: "snv",
    team: "Traveler",
    reminders: [
      {
        name: "sober & healthy",
        type: "info",
        duration: 1,
      },
      {
        name: "ability twice",
        type: "info",
        duration: 1,
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Each night, until dusk, 1) a player becomes sober, healthy and gets true info, or 2) their ability works twice. They learn which.",
    firstNight: {
      setReminders: ["sober & healthy", "ability twice"],
      reminder:
        "Choose a player, wake them and tell them which Barista power is affecting them. Treat them accordingly (sober/healthy/true info or activate their ability twice).",
      order: 1,
    },
    otherNight: {
      setReminders: ["sober & healthy", "ability twice"],
      reminder:
        "Choose a player, wake them and tell them which Barista power is affecting them. Treat them accordingly (sober/healthy/true info or activate their ability twice).",
      order: 1,
    },
    imageSrc: "barista.png",
  },
  {
    id: "harlot",
    name: "Harlot",
    edition: "snv",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Each night*, choose a living player: if they agree, you learn their character, but you both might die.",
    firstNight: null,
    otherNight: {
      reminder:
        "The Harlot points at any player. Then, put the Harlot to sleep. Wake the chosen player, show them the 'This character selected you' token, then the Harlot token. That player either nods their head yes or shakes their head no. If they nodded their head yes, wake the Harlot and show them the chosen player's character token. Then, you may decide that both players die.",
      order: 1,
    },
    imageSrc: "harlot.png",
  },
  {
    id: "butcher",
    name: "Butcher",
    edition: "snv",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "Each day, after the 1st execution, you may nominate again.",
    firstNight: null,
    otherNight: null,
    imageSrc: "butcher.png",
  },
  {
    id: "bonecollector",
    name: "Bone Collector",
    edition: "snv",
    team: "Traveler",
    reminders: [
      ABILITY_SPENT,
      {
        name: "has ability",
        type: "info",
        duration: 1,
        target: "other",
      },
    ],
    setup: false,
    delusional: false,
    ability:
      "Once per game, at night, choose a dead player: they regain their ability until dusk.",
    firstNight: null,
    otherNight: {
      setReminders: ["has ability", "ability spent"],
      reminder:
        "The Bone Collector either shakes their head no or points at any dead player. If they pointed at any dead player, put the Bone Collector's 'Has Ability' reminder by the chosen player's character token. (They may need to be woken tonight to use it.)",
      order: 1,
    },
    imageSrc: "bonecollector.png",
  },
  {
    id: "deviant",
    name: "Deviant",
    edition: "snv",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability: "If you were funny today, you cannot die by exile.",
    firstNight: null,
    otherNight: null,
    imageSrc: "deviant.png",
  },
  {
    id: "gangster",
    name: "Gangster",
    edition: "",
    team: "Traveler",
    reminders: [],
    setup: false,
    delusional: false,
    ability:
      "Once per day, you may choose to kill an alive neighbour, if your other alive neighbour agrees.",
    firstNight: null,
    otherNight: null,
    imageSrc: "gangster.png",
  },
  {
    id: "lil_monsta",
    name: "Lil' Monsta",
    edition: "",
    team: "Demon",
    reminders: [],
    setup: true,
    ability:
      "Each night, Minions choose who babysits Lil' Monsta's token & \"is the Demon\". A player dies each night*. [+1 Minion]",
    firstNight: {
      order: 15,
      reminder:
        "Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta.",
    },
    otherNight: {
      order: 15,
      reminder:
        "Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta. Choose a player, that player dies.",
    },
    imageSrc: "lilmonsta.png",
  },
];
