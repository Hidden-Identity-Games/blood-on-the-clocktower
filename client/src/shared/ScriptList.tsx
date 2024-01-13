import {
  type Character,
  type CharacterType,
  type Role,
} from "@hidden-identity/shared";
import { getCharacter } from "@hidden-identity/shared";
import { Flex, Heading, Text } from "@radix-ui/themes";
import React from "react";
import { BsFillMoonFill } from "react-icons/bs";

import { useDefiniteGame } from "../store/GameContext";
import { colorMap } from "./CharacterTypes";
import { CharacterName } from "./RoleIcon";

interface ScriptListProps {
  className?: string;
}
export function ScriptList({ className }: ScriptListProps) {
  const { game } = useDefiniteGame();
  const { script } = game;
  const charactersByType = React.useMemo(() => {
    const charactersFromScript =
      script?.map(({ id }) => getCharacter(id)) ?? [];
    const travelerCharacters = Object.values(game.playersToRoles)
      .map((role) => getCharacter(role))
      .filter(
        (character) =>
          character.team === "Traveler" && character.id !== "unassigned",
      );

    const allCharacters = [...charactersFromScript, ...travelerCharacters];

    return {
      Townsfolk: allCharacters.filter(({ team }) => team === "Townsfolk"),
      Outsider: allCharacters.filter(({ team }) => team === "Outsider"),
      Minion: allCharacters.filter(({ team }) => team === "Minion"),
      Demon: allCharacters.filter(({ team }) => team === "Demon"),
      Traveler: allCharacters.filter(({ team }) => team === "Traveler"),
    } satisfies Record<CharacterType, Character[]>;
  }, [script, game.playersToRoles]);

  return (
    <Flex className={className} direction="column" gap="3">
      {Object.entries(charactersByType)
        .filter(([_, characters]) => characters.length > 0)
        .map(([team, characters]) => (
          <React.Fragment key={team}>
            <Flex justify="end">
              <Heading
                id={team}
                size="3"
                align="right"
                color={colorMap[team as CharacterType]}
                asChild
              >
                <Flex gap="2">
                  <span className="scale-x-[-1]">
                    <BsFillMoonFill />
                  </span>
                  {team === "Townsfolk" ? `${team}` : `${team}s`}
                </Flex>
              </Heading>
            </Flex>
            {characters.map((char) => (
              <ScriptItem key={char.id} role={char.id} />
            ))}
          </React.Fragment>
        ))}
    </Flex>
  );
}

interface ScriptItemProps {
  role: Role;
}
export function ScriptItem({ role }: ScriptItemProps) {
  const char = getCharacter(role);

  return (
    <Flex gap="2">
      <Flex direction="column">
        <Heading size="2" className="flex-1" color={colorMap[char.team]}>
          <CharacterName role={char.id} />
        </Heading>
        <Text size="1" weight="light" className="pl-5">
          {char.ability}
        </Text>
      </Flex>
    </Flex>
  );
}
