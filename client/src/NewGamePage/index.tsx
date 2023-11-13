import { Button, Flex } from "@radix-ui/themes";
import { useCallback } from "react";
import title from "../assets/title_banner.png";
import backgroundImg from "../assets/hidden_identity_cover.png";
import { NewGameButton } from "./NewGameButton";
import { useSafeNavigate } from "../store/url";
import { GameSelectModal } from "../shared/GameSelect";

export function NewGameLanding() {
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
          onSubmit={() => navigate("spectator")}
          title="Spectate game"
        >
          <Button variant="surface" className="w-full">
            Spectate
          </Button>
        </GameSelectModal>
      </Flex>
    </Flex>
  );
}
