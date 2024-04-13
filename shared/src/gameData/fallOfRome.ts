import { type CharacterDefinition } from "../index.ts";

function abilitySpent(character: string) {
  return {
    name: `${character} spent`,
    type: "abilitySpent",
    target: "self",
  } as const;
}
export const ROME_CHARACTERS: CharacterDefinition[] = [
  {
    id: "sculptor_fall_of_rome",
    name: "Sculptor",
    ability:
      "You start knowing a player. Each night*, you learn the alignment of their most recent nomination.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/sculptor_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Sculpture",
        type: "info",
        dayReminder: true,
      },
      {
        name: "Nominated",
        type: "info",
      },
    ],
    firstNight: {
      reminder:
        "Point to a player. Place the SCULPTURE token next to that player.",
      setReminders: ["Sculpture"],
      order: 18,
    },
    otherNight: {
      reminder:
        "If the player with the SCULPTURE token nominated today. Show the Sculptor an evil thumbs down sign if the nominated player is evil. Otherwise: show the Sculptor a good thumbs up sign. Remove the NOMINATED token (if any).",
      order: 19,
    },
  },
  {
    id: "vestalvirgin_fall_of_rome",
    name: "Vestal Virgin",
    ability:
      "You start knowing 1 good & 1 evil character, 1 of which is in-play. When they die, that night you learn 1 good & 1 evil character, 1 of which is in-play.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/vestalvirgin_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Learns",
        type: "info",
      },
    ],
    firstNight: {
      reminder:
        "Show 1 good and 1 evil character token: one of these is in play. Place the LEARNS next to the in-play character. ",
      order: 19,
      setReminders: ["Learns"],
    },
    otherNight: {
      reminder:
        "If the player with the LEARNS token died today, remove the token. Show 1 good and 1 evil character token: one of these is in play. Place the LEARNS next to the in-play character. ",
      order: 20,
    },
  },
  {
    id: "physician_fall_of_rome",
    name: "Physician",
    ability:
      "Each night, choose two players (not yourself): they are sober, healthy & get true info tonight. The 1st time the Demon kills one, you learn the Demon type.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/physician_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Patient",
        type: "info",
      },
      {
        name: "1st Demon",
        type: "info",
      },
    ],
    firstNight: {
      reminder:
        "The Physician points to two players not themselves. Mark both players with the PATIENT token.",
      order: 17,
      setReminders: ["Patient"],
    },
    otherNight: {
      reminder:
        "Remove all PATIENT tokens. The Physician points to two players not themselves. Mark both players with the PATIENT token. If a player with a PATIENT token was killed by the Demon, place the 1ST DEMON token next to the Physician and wake the Physician and show them Demon token.",
      order: 11,
      setReminders: ["Patient"],
    },
  },
  {
    id: "legionary_fall_of_rome",
    name: "Legionary",
    ability:
      "Each night, you learn how many living evil players are sat clockwise between yourself and a living Legionary. [+0 to +2 Legionary]",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/legionary_fall_of_rome.png",
    setup: true,
    team: "Townsfolk",
    reminders: [],
    firstNight: {
      reminder:
        "Show the hand signal for the number (0, 1, 2, etc.) of living evil players between the Legionary and the next clockwise Legionary (exclusive).",
      order: 20,
    },
    otherNight: {
      reminder:
        "Show the hand signal for the number (0, 1, 2, etc.) of living evil players between the Legionary and the next clockwise Legionary (exclusive).",
      order: 21,
    },
  },
  {
    id: "trumpeter_fall_of_rome",
    name: "Trumpeter",
    ability:
      "Each night*, you learn how many evil players publicly claimed to be Spartacus today.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/trumpeter_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Evil Claim",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "Show the hand signal for the number (0, 1, 2, etc.) of evil players who publicly claimed to be Spartacus today.",
      order: 22,
      setReminders: ["Evil Claim"],
    },
  },
  {
    id: "mortician_fall_of_rome",
    name: "Mortician",
    ability:
      "Each night*, if a player died by execution today you learn if either of their living neighbours are evil.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/mortician_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Recently Executed",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If a player was executed today: Show the head signal (nod 'yes', shake 'no') for whether one of the neighbours is evil.",
      order: 23,
      setReminders: ["Recently Executed"],
    },
  },
  {
    id: "standardbearer_fall_of_rome",
    name: "Standard Bearer",
    ability:
      "When you are nominated, you may make a unique public statement about the nominator (not yourself). Tonight, you learn if the statement was true.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/standardbearer_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "True",
        type: "info",
      },
      {
        name: "False",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If the Standard Bearer's public statement was true: show the head signal (nod 'true'). Otherwise: show the head signal (shake 'false').",
      order: 24,
    },
  },
  {
    id: "centurion1_fall_of_rome",
    name: "Centurion",
    ability:
      "If you nominate & execute a living player, their team loses. You are safe from the Demon. If you publicly claimed to be Spartacus today, you are drunk until dawn.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/centurion1_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Drunk",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: null,
  },
  {
    id: "merchant_fall_of_rome",
    name: "Merchant",
    ability:
      "Once per game, at night, choose to learn the characters of players that have nominated you.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/merchant_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Nominated",
        type: "info",
      },
      abilitySpent("Merchant"),
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If the Merchant has not yet used their ability: the Merchant either shows a shake 'no' head signal, or a nod 'yes' head signal. If the Merchant chose 'yes', show the character tokens of players with a NOMINATED token (in any order). Place the NO ABILITY token.",
      order: 26,
      setReminders: ["Nominated", abilitySpent("Merchant").name],
    },
  },
  {
    id: "gladiator_fall_of_rome",
    name: "Gladiator",
    ability:
      "Once per game, during the day, publicly choose a living player. Tonight, you and they wake & silently play roshambo: whoever loses dies (someone must lose).",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/gladiator_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Duel",
        type: "info",
      },
      abilitySpent("Gladiator"),
    ],
    firstNight: null,
    otherNight: {
      reminder:
        'If the Gladiator used their ability today wake the Gladiator and the player they chose: both players silently play roshambo (rock "fist", scissors "two fingers" or paper "flat hand"). If they both chose the same, play again. Play until someone wins. The loser dies.',
      order: 18,
      setReminders: [abilitySpent("Gladiator").name],
    },
  },
  {
    id: "actor_fall_of_rome",
    name: "Actor",
    ability:
      "Once per game, during the day, publicly guess 3 players' character types (not yourself, 1 guess per type). That night, you learn how many you got correct. ",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/actor_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Correct",
        type: "info",
      },
      abilitySpent("Actor"),
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If the Actor used their ability today: Show the hand signal for the number (0, 1, 2, or 3) of CORRECT markers. Place the NO ABILITY marker.",
      order: 25,
      setReminders: [abilitySpent("Actor").name],
    },
  },
  {
    id: "blacksmith_fall_of_rome",
    name: "Blacksmith",
    ability:
      "The 1st time the Demon kills you, you live & gain a not-in-play Townsfolk ability.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/blacksmith_fall_of_rome.png",
    setup: false,
    team: "Townsfolk",
    reminders: [
      {
        name: "Is the Blacksmith",
        type: "info",
        persistOnDeath: true,
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If the Blacksmith was killed by a Demon. Show the Blacksmith a not-in-play Townsfolk character token. Swap the not-in-play character token with the Blacksmith token. Place the IS THE BLACKSMITH token next to the not-in-play character token. Wake the Blacksmith and show 'You are', then their new character ability.",
      order: 17,
    },
  },
  {
    id: "scholar_fall_of_rome",
    name: "Scholar",
    ability:
      "The 1st time you nominate a living Outsider, they immediately become a not-in-play Townsfolk. [+1 Outsider]",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/scholar_fall_of_rome.png",
    setup: true,
    team: "Townsfolk",
    reminders: [
      {
        name: "Lectured",
        type: "info",
      },
      abilitySpent("Scholar"),
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If the Scholar nominated an Outsider today, place the NO ABILITY token. Wake the nominated player. Show 'You are', then their new character token.",
      order: 2,
      setReminders: [abilitySpent("Scholar").name],
    },
  },
  {
    id: "thetwins_fall_of_rome",
    name: "The Twins",
    ability:
      "You start knowing a player: if either of you are executed, all Townsfolk are drunk until dusk tomorrow.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/thetwins_fall_of_rome.png",
    setup: false,
    team: "Outsider",
    reminders: [
      {
        name: "Remus",
        type: "info",
      },
      {
        name: "Townsfolk Drunk",
        type: "info",
      },
    ],
    firstNight: {
      reminder: "Point to a player. Place the REMUS token next to that player.",
      order: 16,
      setReminders: ["Remus"],
    },
    otherNight: {
      reminder:
        "If The Twins has a TOWNSFOLK DRUNK token, all Townsfolk are drunk until dusk.",
      order: 10,
      setReminders: ["Townsfolk Drunk"],
    },
  },
  {
    id: "winemaker_fall_of_rome",
    name: "Winemaker",
    ability:
      "Your Townsfolk neighbours are drunk, but every other night, you are drunk until dusk, even if you are dead.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/winemaker_fall_of_rome.png",
    setup: false,
    team: "Outsider",
    reminders: [
      {
        name: "Odd",
        type: "info",
      },
      {
        name: "Even",
        type: "info",
      },
      {
        name: "Drunk",
        type: "info",
      },
    ],
    firstNight: {
      reminder:
        "Place either the ODD or EVEN token. If ODD, the Winemaker is drunk on the 1st night and every other night after. Otherwise: the Winemaker is drunk on the 2nd night and every other night after.",
      order: 15,
      setReminders: ["Even", "Odd"],
    },
    otherNight: {
      reminder:
        "Check which ODD or EVEN token is placed. If an odd night and the ODD token is placed, the Winemaker is drunk until dusk. If an even night and the EVEN token is placed, the Winemaker is drunk until dusk. Otherwise their Townsfolk neighbours are drunk until dusk.",
      order: 9,
      setReminders: ["Drunk"],
    },
  },
  {
    id: "spartacus_fall_of_rome",
    name: "Spartacus",
    ability:
      "If an evil player guesses you (once), your team loses. You might register as a Townsfolk; each day, if you did not publicly claim to be Spartacus, you don't.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/spartacus_fall_of_rome.png",
    setup: false,
    team: "Outsider",
    reminders: [
      {
        name: "Guess Used",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: null,
  },
  {
    id: "badomen_fall_of_rome",
    name: "Bad Omen",
    ability:
      "You do not know you are a Bad Omen. You think you are a Townsfolk, but you receive false information. You might register as evil, even if dead.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/badomen_fall_of_rome.png",
    setup: true,
    team: "Outsider",
    reminders: [
      {
        name: "Is a Bad Omen",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: null,
  },
  {
    id: "temptress_fall_of_rome",
    name: "Temptress",
    ability:
      "On your 1st night choose two players: they learn that they were chosen. The 1st time one of them dies by execution, the other becomes evil that night.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/temptress_fall_of_rome.png",
    setup: false,
    team: "Minion",
    reminders: [
      {
        name: "Seduced",
        type: "info",
      },
      {
        name: "Evil",
        type: "info",
      },
    ],
    firstNight: {
      reminder:
        "The Temptress points to two players. Place the SEDUCED token next to the two players. Wake the two players separately. Show the 'This character selected you' card, then the Temptress token. ",
      order: 12,
      setReminders: ["Seduced"],
    },
    otherNight: {
      reminder:
        "If a player with a SEDUCED token is executed and dies, remove their SEDUCED token. The player with the remaining SEDUCED turns evil. Remove their SEDUCED token and replace it with the EVIL token. Wake the evil player and show them the 'You are' card and the thumbs down evil signal.",
      order: 3,
      setReminders: ["Seduced"],
    },
  },
  {
    id: "haruspex_fall_of_rome",
    name: "Haruspex",
    ability:
      "Each night, choose a player: you learn their character. The 1st player you choose twice in this way, dies. [+ Spartacus]",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/haruspex_fall_of_rome.png",
    setup: true,
    team: "Minion",
    reminders: [
      {
        name: "Foretold",
        type: "info",
      },
      abilitySpent("Haruspex"),
    ],
    firstNight: {
      reminder:
        "The Haruspex points to a player. Show that player’s character token. Place a FORETOLD token next that player. ",
      order: 14,
      setReminders: ["Foretold"],
    },
    otherNight: {
      reminder:
        "The Haruspex points to a player. Show that player’s character token. Place a FORETOLD token next that player: if that player already has a FORETOLD token. That player dies, also place the CAN'T KILL token next to the Haruspex.",
      order: 16,
      setReminders: ["ForeTold", abilitySpent("Haruspex").name],
    },
  },
  {
    id: "glykon1_fall_of_rome",
    name: "Glykon",
    ability:
      "You might register as good. Until dawn, players you nominate register as the opposing alignment & if a Townsfolk, are also poisoned.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/glykon1_fall_of_rome.png",
    setup: false,
    team: "Minion",
    reminders: [
      {
        name: "Snake Bite",
        type: "poison",
      },
    ],
    firstNight: null,
    otherNight: null,
  },
  {
    id: "augur_fall_of_rome",
    name: "Augur",
    ability:
      "If a Townsfolk nominates you, they immediately become a Bad Omen.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/augur_fall_of_rome.png",
    setup: false,
    team: "Minion",
    reminders: [],
    firstNight: null,
    otherNight: null,
  },
  {
    id: "cleopatra_fall_of_rome",
    name: "Cleopatra",
    ability:
      "Each night, choose two players: if they nominate tomorrow, they die that night. Each day, if a good player (Travellers don't count) does not nominate, evil wins. ",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/cleopatra_fall_of_rome.png",
    setup: false,
    team: "Demon",
    reminders: [
      {
        name: "Cleo chosen",
        type: "info",
      },
    ],
    firstNight: {
      reminder: "Cleopatra points to two players. ",
      order: 13,
      setReminders: ["Cleo chosen"],
    },
    otherNight: {
      reminder:
        "If a previously chosen player nominated today they die. Remove all CHOSEN tokens. Cleopatra points to two players. Place the CHOSEN token next to both players.",
      order: 12,
      setReminders: ["Cleo chosen"],
    },
  },
  {
    id: "crassus_fall_of_rome",
    name: "Crassus",
    ability:
      "Each night*, choose a player: they die. If the 1st Crassus publicly claims to be Spartacus & dies with 5 or more players alive, an evil player becomes Crassus.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/crassus_fall_of_rome.png",
    setup: false,
    team: "Demon",
    setupReminders: ["OG Crassus"],
    reminders: [
      {
        name: "OG Crassus",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "Crassus points to a player. That player dies. If the 1st Crassus publicly claimed to be Spartacus today and points to themselves (or was executed), with 5 or more players alive, replace the character of 1 evil player with a spare Crassus token. Show the 'You are' card, then the Crassus token. ",
      order: 13,
    },
  },
  {
    id: "hannibal_fall_of_rome",
    name: "Hannibal",
    ability:
      "You think you are a good character, but you are not. Minions learn 3 bluffs. Each night*, a player might die. The 1st Hannibal to die, becomes good. [+1 Hannibal] ",
    attribution:
      'Hannibal was awarded the 4th place trophy in the Unofficial\'s "Custom Demon Contest".',
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/hannibal_fall_of_rome.png",
    setup: true,
    team: "Demon",
    reminders: [
      {
        name: "Hannibal",
        type: "info",
      },
    ],
    firstNight: {
      reminder:
        "Select 2 good players and place the IS HANNIBAL reminder tokens. Wake all Minions together, show them the Hannibals and show them three not-in-play character tokens (these must be the same).",
      order: 11,
      setReminders: ["Hannibal"],
    },
    otherNight: {
      reminder:
        "Choose a player, that player dies. If a Hannibal died today, wake that player and show them the 'You are' card, the Hannibal token and then the thumbs up good signal.",
      order: 14,
    },
  },
  {
    id: "caesar_fall_of_rome",
    name: "Caesar",
    ability:
      "Each night*, choose a player: they die. The 1st time an evil player dies by execution, that night, choose an additional player: they die.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/caesar_fall_of_rome.png",
    setup: false,
    team: "Demon",
    reminders: [abilitySpent("Caesar")],
    firstNight: null,
    otherNight: {
      reminder:
        "If an evil player was executed today, Caesar points to two players. Otherwise: Caesar points to a player. Chosen players die.",
      order: 15,
      setReminders: [abilitySpent("Caesar").name],
    },
  },
  {
    id: "mercenary_fall_of_rome",
    name: "Mercenary",
    ability:
      "Each night*, gain the ability of a player who publicly claimed Spartacus today. If a Mercenary is exiled, you are exiled too. [+1 Mercenary of opposing alignment]",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/mercenary_fall_of_rome.png",
    setup: false,
    team: "Traveler",
    reminders: [
      {
        name: "Mercenary",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "Show the Mercenary a character that publicly claimed to be Spartacus today, they have that ability tonight and tomorrow until dusk. ",
      order: 4,
      setReminders: ["Mercenary"],
    },
  },
  {
    id: "architect_fall_of_rome",
    name: "Architect",
    ability:
      "Each night*, choose a player: 1) they become a not-in-play character of the same type, or 2) they swap characters with a player of the same type.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/architect_fall_of_rome.png",
    setup: false,
    team: "Traveler",
    reminders: [
      {
        name: "Redesigned",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "The Architect points to a player. Choose which ability will effect the chosen player. Treat them accordingly (not-in-play character or character swap). Wake affected players individually. Show 'You are', then their new character token.",
      order: 7,
      setReminders: ["Redesigned"],
    },
  },
  {
    id: "sibyl_fall_of_rome",
    name: "Sibyl",
    ability:
      "Each day, after the 1st execution, you may publicly choose a dead player: they may nominate. If the majority of the dead and yourself agree, they are executed.",
    attribution:
      "Original Character concept by Kohav. Many thanks to them for giving the green light to bringing it to Fall of Rome!",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/sibyl_fall_of_rome.png",
    setup: false,
    team: "Traveler",
    reminders: [],
    firstNight: null,
    otherNight: null,
  },
  {
    id: "highpriest1_fall_of_rome",
    name: "High Priest",
    ability:
      "Each day, publicly choose a unique living player to bless: if a majority of players agree, something good happens to them.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/highpriest1_fall_of_rome.png",
    setup: false,
    team: "Traveler",
    reminders: [
      {
        name: "Blessed",
        type: "info",
      },
      {
        name: "Failed",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If the High Priest successfully blessed a player today, something good happens to that player and/or their team.",
      order: 5,
    },
  },
  {
    id: "highpriest2_fall_of_rome",
    name: "High Priest",
    ability:
      "Each day, publicly choose a unique living player to bless: if a majority of players agree, tomorrow they may learn a statement. Tonight, choose if it’s true.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/highpriest2_fall_of_rome.png",
    setup: false,
    team: "Traveler",
    reminders: [
      {
        name: "Blessed",
        type: "info",
      },
      {
        name: "Failed",
        type: "info",
      },
      {
        name: "True",
        type: "info",
      },
      {
        name: "False",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        'If the High Priest successfully blessed a player today, wake the High Priest. The High Priest chooses whether the statement is true tomorrow with a hand signal (true "thumbs up", false "thumbs down").',
      order: 6,
    },
  },
  {
    id: "emperor_fall_of_rome",
    name: "Emperor",
    ability:
      "Each day, choose the 1st execution's outcome. If you choose to protect today's execution: they survive. Otherwise, tonight you learn their alignment.",
    edition: "fall of rome",
    imageSrc:
      "https://www.bloodstar.xyz/p/AlexS/Fall_of_Rome/emperor_fall_of_rome.png",
    setup: false,
    team: "Traveler",
    reminders: [
      {
        name: "Emperor Executed",
        type: "info",
      },
    ],
    firstNight: null,
    otherNight: {
      reminder:
        "If a player was executed today and the outcome was not overturned by the Emperor: Show the hand signal (thumbs down 'evil', thumbs up 'good') for the players alignment.",
      order: 8,
    },
  },
];
