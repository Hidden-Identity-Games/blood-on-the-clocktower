import { useState } from "react";
import { useDefiniteGame } from "../store/GameContext";
import { getRole, getRoleExtension } from "../assets/game_data/gameData";
import { RoleIcon, RoleName, RoleText } from "../shared/RoleIcon";
import { Button, Checkbox, Flex, IconButton } from "@radix-ui/themes";
import { MeaningfulIcon } from "../PlayerLanding/PlayerWaiting/MeaningfulIcon";
import { useDecideFate } from "../store/useStore";
import { GiRaiseZombie } from "react-icons/gi";
import { PiKnifeBold } from "react-icons/pi";
import classNames from "classnames";

export function NightOrder() {
  const { game } = useDefiniteGame();
  const [checkedPlayers, setCheckedPlayers] = useState<Record<string, boolean>>(
    {},
  );
  const [nightTime, setNightTime] = useState<null | "first" | "other">(null);
  const [, decideFateLoading, , handleDecideFate] = useDecideFate();

  const playerOrder = Object.entries(game.playersToRoles)
    .map(([player, role]) => ({
      player,
      role,
      ...getRole(role),
      ...getRoleExtension(role),
    }))
    .sort((a, b) =>
      nightTime === "first"
        ? a.firstNight - b.firstNight
        : a.otherNight - b.otherNight,
    );

  const startNight = (startingFirstNight: boolean) => {
    setNightTime(startingFirstNight ? "first" : "other");
    setCheckedPlayers(
      Object.fromEntries(
        playerOrder
          .filter(({ player }) => !game.deadPlayers[player])
          .filter(({ firstNight, otherNight }) =>
            startingFirstNight ? firstNight !== 0 : otherNight !== 0,
          )
          .map(({ player }) => [player, true]),
      ),
    );
  };

  return (
    <Flex gap="2" direction="column" p="2" className="w-full">
      {!nightTime && (
        <Button onClick={() => startNight(true)}>Start first night</Button>
      )}
      {!nightTime && (
        <Button onClick={() => startNight(false)}>Start other night</Button>
      )}
      {playerOrder.map(({ role, player: player, ...rowData }) => (
        <Flex
          gap="2"
          justify="between"
          className={classNames(game.deadPlayers[player] && "line-through")}
        >
          {nightTime && (
            <Checkbox
              id={`${player}-done`}
              checked={checkedPlayers[player]}
              onClick={() =>
                setCheckedPlayers({
                  ...checkedPlayers,
                  [player]: !checkedPlayers[player],
                })
              }
            />
          )}
          <label className="h-6" htmlFor={`${player}-done`}>
            <RoleText role={role}>{player}</RoleText>
          </label>
          <MeaningfulIcon
            size="1"
            color="amber"
            title={
              <div className="flex items-center justify-center gap-1">
                <RoleIcon role={role} />
                {RoleName(role)}
              </div>
            }
            explanation={(() => {
              switch (nightTime) {
                case null:
                  return rowData.ability;
                case "first":
                  return (
                    <div>
                      <div>
                        {!rowData.firstNightReminder && "DOES NOT ACT TONIGHT"}
                      </div>
                      {rowData.firstNightReminder || rowData.ability}
                    </div>
                  );
                case "other":
                  <div>
                    <div>
                      {!rowData.otherNightReminder && "DOES NOT ACT TONIGHT"}
                    </div>
                    {rowData.otherNightReminder || rowData.ability}
                  </div>;
              }
            })()}
          >
            <RoleIcon role={role} />
          </MeaningfulIcon>
          <IconButton
            color="amber"
            variant="surface"
            size="1"
            onClick={() => {
              if (decideFateLoading) {
                return;
              }
              handleDecideFate(player, !game.deadPlayers[player]);
            }}
          >
            {game.deadPlayers[player] ? <GiRaiseZombie /> : <PiKnifeBold />}
          </IconButton>
        </Flex>
      ))}
      {nightTime && (
        <Button
          onClick={() => {
            setNightTime(null);
            setCheckedPlayers({});
          }}
        >
          Day time
        </Button>
      )}
    </Flex>
  );
}
