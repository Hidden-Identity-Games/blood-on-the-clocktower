import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Flex } from "@radix-ui/themes";
import { useCallback } from "react";

import backgroundImg from "../assets/hidden_identity_cover.png";
import title from "../assets/title_banner.png";
import { GameSelectModal } from "../shared/GameSelect";
import { useSafeNavigate } from "../store/url";
import { useLocalStorage } from "../store/useLocalStorage";
import { NewGameButton } from "./NewGameButton";

export function NewGameLanding() {
  const [hasSeenPleaseSupportGame, setHasSeenPleaseSupportGame] =
    useLocalStorage("hasSeenPleaseSupportGame");

  const navigate = useSafeNavigate();
  const handleJoinGame = useCallback(
    (gameId: string) => {
      navigate("game", { gameId: gameId });
    },
    [navigate],
  );

  return (
    <Flex
      className="h-screen min-h-0 flex-col px-4"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 0 40px 40px var(--color-page-background) inset",
      }}
    >
      <Dialog.Root defaultOpen={!hasSeenPleaseSupportGame}>
        <Dialog.Content>
          <Dialog.Header>Please support the official release.</Dialog.Header>
          <Dialog.Description>
            This is a fan created application that is meant to help you run the
            game, but please only use if you have purchased the game!{" "}
            <strong>Please</strong>
            support the game by buying the{" "}
            <a
              href="https://bloodontheclocktower.com/products/blood-on-the-clocktower-the-game"
              target="_blank"
            >
              physical game
            </a>
            , and/or{" "}
            <a
              target="_blank"
              href="https://www.kickstarter.com/projects/pandemoniuminstitute/blood-on-the-clocktower"
            >
              supporting the kickstarter.
            </a>
          </Dialog.Description>
          <Dialog.Footer className="p-1">
            <Dialog.Close asChild>
              <Button onClick={() => setHasSeenPleaseSupportGame("yes")}>
                I supported the creators!
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
      <img src={title} className="mx-auto mt-6" />
      <Flex
        className="mx-auto mb-6 mt-auto w-full min-w-[300px] max-w-[450px] self-end opacity-[80%]"
        direction="column"
        align="center"
        gap="2"
      >
        <GameSelectModal onSubmit={handleJoinGame} title="Join game">
          <Button className="w-full">Join Game</Button>
        </GameSelectModal>
        <NewGameButton className="w-full">Create game</NewGameButton>
        <GameSelectModal
          onSubmit={(gameId) => navigate("spectator", { gameId }, true)}
          title="Spectate game"
        >
          <Button variant="outline" className="w-full">
            Spectate
          </Button>
        </GameSelectModal>
      </Flex>
    </Flex>
  );
}
