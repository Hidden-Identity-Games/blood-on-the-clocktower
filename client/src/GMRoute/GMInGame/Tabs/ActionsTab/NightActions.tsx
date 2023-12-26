import { getCharacter } from "@hidden-identity/shared";
import { Button, Checkbox, Flex, IconButton, Text } from "@radix-ui/themes";
import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

import { useDefiniteGame } from "../../../../store/GameContext";
import { useSheetView } from "../../../../store/url";
import { PlayerList } from "../../../GMShared/PlayerListComponents";
import { PlayerNotes } from "../../../GMShared/PlayerListComponents/PlayerNotes";
import { ProgressTimeButton } from "./ProgressTimeButton";

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
    { type: "game-action", name: "MINIONS", order: 7 },
    { type: "game-action", name: "DEMON", order: 8 },
  ] as Action[],
  otherNight: [] as Action[],
};

interface NightActionsProps {}
export function NightActions(_props: NightActionsProps) {
  const { game } = useDefiniteGame();
  const [_, triggerSheet] = useSheetView();

  const firstNight = game.time.count === 1;
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

  return (
    <>
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
                <Button
                  variant="soft"
                  className="flex-1 capitalize"
                  onClick={() =>
                    triggerSheet({
                      type: "action",
                      id: action.name,
                      isOpen: "open",
                    })
                  }
                >
                  {action.name}
                </Button>
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
      <ProgressTimeButton
        confirmationText={
          Object.values(checkedActions).filter(Boolean).length ===
          nightActions.length
            ? "All actions marked complete, end the night?"
            : "There are still actions not yet marked completed.  Are you sure you want to end the night?"
        }
      >
        End night
      </ProgressTimeButton>
    </>
  );
}
