import { type PlayerStatus } from "@hidden-identity/shared";
import { Flex, IconButton } from "@radix-ui/themes";
import { type IconBaseProps } from "react-icons";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsFillGearFill, BsShieldShaded } from "react-icons/bs";
import { FaVial } from "react-icons/fa6";
import { IoIosBeer } from "react-icons/io";
import { LiaVoteYeaSolid } from "react-icons/lia";

import { MeaningfulStatusIcon } from "../../shared/MeaningfulIcon";
import { useDeadVote } from "../../store/actions/gmActions";
import { usePlayerStatuses } from "../../store/actions/gmPlayerActions";
import { useDefiniteGame } from "../../store/GameContext";
import { type ExtnesionProps } from "../../types/radixTypes";

const StatusIconMap: Record<
  PlayerStatus["type"],
  React.ComponentType<IconBaseProps>
> = {
  poison: FaVial,
  drunk: IoIosBeer,
  protected: BsShieldShaded,
  characterAbility: BsFillGearFill,
  dead: () => null,
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

export function PlayerStatusIconList({
  playerStatuses,
  player,
  ...radixButtonProps
}: {
  player: string;
  playerStatuses: PlayerStatus[];
} & Omit<ExtnesionProps["IconButton"], "color">) {
  const className = "h-2";

  const [, , , updatePlayerStatus] = usePlayerStatuses();

  return [...playerStatuses]
    .sort((a, b) => (a.type > b.type ? -1 : 1))
    .map((status) => {
      const buttonProps = {
        ...radixButtonProps,
        radius: "full",
        variant: "soft",
        color: "violet",
      } as const;
      return (
        <IconButton
          key={status.id}
          {...buttonProps}
          onClick={() => {
            void updatePlayerStatus(player, "remove", status);
          }}
        >
          <PlayerStatusIcon statusType={status.type} className={className} />
        </IconButton>
      );
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
              void clearDeadVote(player, true);
            }
          }}
        >
          <LiaVoteYeaSolid className="h-2" />
        </IconButton>
      )}
    </div>
  );
}
