import { IoIosBeer } from "react-icons/io";
import { FaVial } from "react-icons/fa6";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GiFeather } from "react-icons/gi";
import { LiaVoteYeaSolid } from "react-icons/lia";
import { MeaningfulStatusIcon } from "../shared/MeaningfulIcon";
import { useDefiniteGame } from "../store/GameContext";
import { Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import { PlayerStatus } from "@hidden-identity/server";
import { useDeadVote, usePlayerStatuses } from "../store/useStore";
import { IconBaseProps } from "react-icons";

const StatusIconMap: Record<
  PlayerStatus["type"],
  React.ComponentType<IconBaseProps>
> = {
  poison: FaVial,
  drunk: IoIosBeer,
  custom: GiFeather,
};
interface PlayerStatusIconProps extends IconBaseProps {
  statusType: PlayerStatus["type"];
}
export function PlayerStatusIcon({
  statusType,
  ...iconProps
}: PlayerStatusIconProps) {
  const Icon = StatusIconMap[statusType];
  return <Icon {...iconProps} />;
}

function PlayerStatusIconList({
  playerStatuses,
  size,
  player,
}: {
  player: string;
  playerStatuses: PlayerStatus[];
  size: "1" | "2" | "3";
}) {
  const className = "h-2";

  const [, , , updatePlayerStatus] = usePlayerStatuses();

  return [...playerStatuses]
    .sort((a, b) => (a.type > b.type ? -1 : 1))
    .map((status) => {
      const buttonProps = {
        size,
        radius: "full",
        variant: "soft",
        color: "violet",
      } as const;
      switch (status.type) {
        case "drunk":
          return (
            <IconButton
              key={status.id}
              {...buttonProps}
              onClick={() => {
                updatePlayerStatus(player, "remove", status);
              }}
            >
              <PlayerStatusIcon statusType="drunk" className={className} />
            </IconButton>
          );
        case "poison":
          return (
            <IconButton
              key={status.id}
              {...buttonProps}
              onClick={() => {
                updatePlayerStatus(player, "remove", status);
              }}
            >
              <PlayerStatusIcon statusType="poison" className={className} />
            </IconButton>
          );
        case "custom":
          return (
            <MeaningfulStatusIcon
              key={status.id}
              size={size}
              color="violet"
              header={
                <Flex gap="1">
                  <PlayerStatusIcon statusType="custom" className={className} />
                  <div>Custom Status</div>
                </Flex>
              }
              explanation={
                <>
                  <Text as="div">{status.desc}</Text>
                  <Dialog.Close>
                    <Button
                      onClick={() => {
                        updatePlayerStatus(player, "remove", status);
                      }}
                    >
                      Clear Status
                    </Button>
                  </Dialog.Close>
                </>
              }
            >
              <PlayerStatusIcon statusType="custom" className={className} />
            </MeaningfulStatusIcon>
          );
      }
    });
}

export function PlayerStatusIcons({ player }: { player: string }) {
  const { game } = useDefiniteGame();

  const playerStatuses = game.playerPlayerStatuses[player] ?? [];
  if (playerStatuses.length > 3) {
    return (
      <MeaningfulStatusIcon
        size="1"
        header={
          <Flex gap="1">
            <div>Notes</div>
          </Flex>
        }
        explanation={
          <Flex justify="between">
            <PlayerStatusIconList
              playerStatuses={playerStatuses}
              player={player}
              size="3"
            />
          </Flex>
        }
      >
        <BiDotsHorizontalRounded />
      </MeaningfulStatusIcon>
    );
  }
  return (
    <PlayerStatusIconList
      playerStatuses={playerStatuses}
      player={player}
      size="1"
    />
  );
}

export function DeadVoteIcon({ player }: { player: string }) {
  const { game } = useDefiniteGame();
  const [, , , clearDeadVote] = useDeadVote();
  const showVote = !(game.deadPlayers[player] && game.deadVotes[player]);
  return (
    <div className="w-4">
      {showVote && (
        <IconButton
          size="1"
          color={game.deadPlayers[player] ? "grass" : "gray"}
          radius="full"
          variant="surface"
          onClick={() => {
            if (game.deadPlayers[player]) {
              clearDeadVote(player, true);
            }
          }}
        >
          <LiaVoteYeaSolid className="h-2" />
        </IconButton>
      )}
    </div>
  );
}
