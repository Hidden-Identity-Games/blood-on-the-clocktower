import {
  Button,
  Checkbox,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { PlayerNameWithRoleIcon } from "../../shared/RoleIcon";
import { getCharacter } from "@hidden-identity/shared";
import { RxHamburgerMenu } from "react-icons/rx";
import React from "react";
import { useDefiniteGame } from "../../store/GameContext";
import { PlayerList } from "../GMShared/PlayerListComponents";
import { DemonMessage } from "../GMShared/PlayerListComponents/PlayerMessage/MessageCreators/DemonMessage";
import { DialogHeader } from "../../shared/DialogHeader";
import { DestructiveButton } from "../../shared/DestructiveButton";
import { useIsHiddenView } from "../../store/url";
import { PlayerNotes } from "../GMShared/PlayerListComponents/PlayerNotes";

type Action =
  | {
      type: "character";
      name: string;
      player: string;
      order: number;
    }
  | {
      type: "game-action";
      name: string;
      order: number;
    };
const gameActionsByNight = {
  firstNight: [
    { type: "game-action", name: "minions", order: 7 },
    { type: "game-action", name: "demon", order: 8 },
  ] as Action[],
  otherNight: [] as Action[],
};

interface NightPlayerListProps {
  firstNight: boolean;
  endNightCallback?: () => void;
}
export function NightPlayerList({
  firstNight,
  endNightCallback = () => {},
}: NightPlayerListProps) {
  const { game } = useDefiniteGame();
  const [_, setIsHiddenView] = useIsHiddenView();

  const nightKey = firstNight ? "firstNight" : "otherNight";

  const [nightActions, leftoverPlayers] = React.useMemo(() => {
    const playerActions = game.playerList
      .map((player) => ({
        player,
        role: game.playersToRoles[player],
        ...getCharacter(game.playersToRoles[player]),
      }))
      .filter((character) => !!character[nightKey])
      .map<Action>(({ player, id, ...character }) => ({
        type: "character",
        name: `${player}-${id}`,
        player,
        order: character[nightKey]!.order,
      }));
    const gameActions = gameActionsByNight[nightKey];

    const leftoverPlayers = game.playerList
      .filter(
        (player) => !getCharacter(game.playersToRoles[player])[nightKey]?.order,
      )
      .sort()
      .map((player) => ({
        type: "character",
        name: `${player}_undone`,
        player,
        order: 1000,
      }));

    return [
      [...playerActions, ...gameActions].sort((a, b) => a.order - b.order),
      leftoverPlayers,
    ];
  }, [nightKey, game.playersToRoles, game.playerList]);

  const [checkedActions, setCheckedActions] = React.useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(leftoverPlayers.map((player) => [player.name, true])),
  );

  const endNight = () => {
    endNightCallback();
    setIsHiddenView(false);
    setCheckedActions(
      Object.fromEntries(
        nightActions.map((action) => {
          if (action.type === "character" && game.deadPlayers[action.player]) {
            return [action.name, true];
          }
          return [];
        }),
      ),
    );
  };

  return (
    <Flex className="overflow-y-auto" direction="column" py="3" gap="2">
      {[...nightActions, ...leftoverPlayers].map((action) => (
        <React.Fragment key={action.name}>
          <Text size="4" asChild>
            <Flex justify="between" align="center" px="3" gap="3">
              <Checkbox
                id={`${action.name}-done`}
                checked={!!checkedActions[action.name]}
                onClick={() =>
                  setCheckedActions((prev) => ({
                    ...prev,
                    [action.name]: !prev[action.name],
                  }))
                }
              />
              {action.type === "character" && (
                <>
                  <PlayerList.RoleIcon player={action.player}>
                    <PlayerList.NightReminder player={action.player} />
                  </PlayerList.RoleIcon>
                  <PlayerList.NoteInputModal player={action.player}>
                    <button className="flex-1 text-left">
                      <PlayerList.Name player={action.player} />
                    </button>
                  </PlayerList.NoteInputModal>
                  <PlayerList.Actions player={action.player}>
                    <IconButton
                      id={`${action.player}-menu-btn`}
                      variant="ghost"
                    >
                      <RxHamburgerMenu />
                    </IconButton>
                  </PlayerList.Actions>
                </>
              )}
              {action.type === "game-action" && (
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft" className="flex-1 capitalize">
                      {action.name}
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    {action.name === "demon" && (
                      <>
                        <DialogHeader>Demon</DialogHeader>
                        <DemonMessage
                          // TODO: support multiple demons
                          player={
                            game.playerList.find(
                              (player) =>
                                getCharacter(game.playersToRoles[player])
                                  .team === "Demon",
                            )!
                          }
                          // TODO: add back auto-note functionality
                          //   message: string,
                          //   reveal: Record<string, Reveal[]>,
                          // ) => {
                          //   const player = Object.entries(
                          //     game.playersToRoles,
                          //   ).find(
                          //     ([, role]) => getCharacter(role).team === "Demon",
                          //   ) ?? [""];
                          //   const bluffs = `Bluffs:\n${reveal["bluffs"]
                          //     .map(
                          //       ({ character }) =>
                          //         getCharacter(
                          //           character ?? ("unassigned" as Role),
                          //         ).name,
                          //     )
                          //     .join("\n")}`;

                          //   setPlayerNote(player[0], bluffs);
                          // }}
                        />
                      </>
                    )}
                    {action.name === "minions" && (
                      <>
                        <DialogHeader>Minions</DialogHeader>
                        <Text>
                          Wake up the minions, and show them who their demon is.
                        </Text>
                        <Heading>Minions:</Heading>
                        <ul className="pl-2">
                          {Object.entries(game.playersToRoles)
                            .filter(
                              ([_, role]) =>
                                getCharacter(role).team === "Minion",
                            )
                            .map(([player]) => (
                              <li key={player}>
                                <PlayerNameWithRoleIcon player={player} />
                              </li>
                            ))}
                        </ul>
                        <Heading>Demon:</Heading>
                        <ul className="pl-2">
                          {Object.entries(game.playersToRoles)
                            .filter(
                              ([_, role]) =>
                                getCharacter(role).team === "Demon",
                            )
                            .map(([player]) => (
                              <li key={player}>
                                <PlayerNameWithRoleIcon player={player} />
                              </li>
                            ))}
                        </ul>
                      </>
                    )}
                  </Dialog.Content>
                </Dialog.Root>
              )}
            </Flex>
          </Text>

          {action.type === "character" && (
            <PlayerNotes
              className="mt-[-0.5em] px-[5em] py-1"
              player={action.player}
            />
          )}
        </React.Fragment>
      ))}
      {Object.values(checkedActions).filter(Boolean).length ===
      nightActions.length ? (
        <Button m="3" onClick={endNight}>
          End Night
        </Button>
      ) : (
        <DestructiveButton
          m="3"
          confirmationText="There are night actions not yet marked completed."
          onClick={endNight}
        >
          End Night
        </DestructiveButton>
      )}
    </Flex>
  );
}
