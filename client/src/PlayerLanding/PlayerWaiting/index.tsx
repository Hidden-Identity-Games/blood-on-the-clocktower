import { Callout, Flex, IconButton, Text } from "@radix-ui/themes";
import { useOrderPlayer } from "../../store/useStore";
import { useDefiniteGame } from "../../store/GameContext";
import { useMe } from "../../store/secretKey";
import { PageLoader } from "../../shared/PageLoader";
import { ImArrowLeft, ImArrowRight } from "react-icons/im";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { SeatingProblem } from "./SeatingProblem";
import { MeaningfulIcon } from "./MeaningfulIcon";
import { PlayerNameButton } from "../../shared/PlayerNameButton";

export function PlayerWaiting() {
  const myName = useMe();
  const { game } = useDefiniteGame();
  const [, handleOrderPlayerLoading, , handleOrderPlayer] = useOrderPlayer();

  const rightPlayer = game.partialPlayerOrdering[myName]?.rightNeighbor;
  const leftPlayer = Object.entries(game.partialPlayerOrdering).find(
    ([_, selected]) => selected?.rightNeighbor === myName,
  )?.[0];

  const hasSeatingProblem =
    game.orderedPlayers.problems && game.orderedPlayers.playerProblems[myName];
  const playersWithSeatingProblems =
    game.orderedPlayers.problems &&
    !hasSeatingProblem &&
    Object.keys(game.orderedPlayers.playerProblems);
  const waitingOnRoles = !hasSeatingProblem && !playersWithSeatingProblems;

  if (handleOrderPlayerLoading) {
    return <PageLoader />;
  }
  if (!rightPlayer) {
    return (
      <Flex
        direction="column"
        align="center"
        gap="2"
        className="w-full flex-1 p-2"
      >
        <Text size="2">
          Please select the player sitting to your right. If they are not listed
          here yet, please make sure they have joined the game!
        </Text>
        {Object.keys(game.playersToRoles)
          .filter((name) => name !== myName)
          .sort()
          .map((player) => (
            <PlayerNameButton
              className="w-full"
              key={player}
              onClick={() => {
                handleOrderPlayer(myName, player);
              }}
            >
              {player}
            </PlayerNameButton>
          ))}
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      align="center"
      gap="4"
      className="flex-1 overflow-y-auto px-1 py-3"
    >
      <Flex
        direction="row"
        gap="2"
        justify="between"
        className="w-full"
        align="center"
      >
        <Flex className="flex-1" gap="2" align="center">
          <ImArrowLeft />
          <Text className="flex-1 capitalize">
            {leftPlayer ?? (
              <MeaningfulIcon explanation="It looks like your left neighbor hasn't finished getting set up.  Check and see if they have joined yet so the game can start!">
                <FaPersonCircleQuestion />
              </MeaningfulIcon>
            )}
          </Text>
        </Flex>

        <Flex className="flex-1" gap="2" justify="end" align="center">
          <IconButton
            size="1"
            radius="full"
            variant="outline"
            color={hasSeatingProblem ? undefined : "grass"}
            onClick={() => handleOrderPlayer(myName, null)}
          >
            <CgArrowsExchangeAlt />
          </IconButton>
          <Text className="capitalize">{rightPlayer}</Text>

          <ImArrowRight />
        </Flex>
      </Flex>

      <Flex
        className="flex-1 px-2"
        direction="column"
        align="center"
        justify="center"
        gap="5"
      >
        <Text as="div" className="mb-5">
          Hello <span className="capitalize">{myName}</span>
        </Text>
        {hasSeatingProblem && (
          <SeatingProblem problem={hasSeatingProblem.type} />
        )}
        {playersWithSeatingProblems && (
          <Callout.Root color="purple">
            <Callout.Icon></Callout.Icon>
            <Callout.Text className="text-center">
              Waiting on
              <Text asChild color="orange">
                <div className="capitalize">
                  {playersWithSeatingProblems.join(", ")}
                </div>
              </Text>
            </Callout.Text>
          </Callout.Root>
        )}
        {waitingOnRoles && (
          <Callout.Root color="grass">
            <Callout.Text>
              All players set. Waiting on the storyteller to start!
            </Callout.Text>
          </Callout.Root>
        )}
      </Flex>
    </Flex>
  );
}