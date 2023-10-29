import {
  Button,
  Callout,
  Dialog,
  DialogClose,
  Flex,
  TextField,
} from "@radix-ui/themes";
import { useCreateGame } from "../store/useStore";
import React from "react";
import { useNavigate } from "react-router-dom";
import title from "../assets/title_banner.png";
import backgroundImg from "../assets/hidden_identity_cover.png";

export function NewGameLanding() {
  const [error, isLoading, , createGame] = useCreateGame();
  const [joinCode, setJoinCode] = React.useState("");
  const navigate = useNavigate();

  return (
    <Flex
      className="h-screen min-h-0 flex-col bg-contain bg-bottom"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "bottom",
        boxShadow: "0 0 40px 40px var(--color-page-background) inset",
      }}
    >
      <div>Header</div>
      <Flex className="mt-6" justify="center" align="center">
        <img src={title} />
      </Flex>
      {error && (
        <div className="h-0 w-full">
          <Callout.Root className="absolute bottom-0">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        </div>
      )}
      <Flex
        className="mb-3 mt-auto w-full self-end"
        direction="row"
        align="center"
        gap="6"
        justify={"center"}
      >
        <Button onClick={() => createGame()} disabled={isLoading}>
          Create Game
        </Button>

        <Dialog.Root>
          <Dialog.Trigger>
            <Button disabled={isLoading}>Join Game</Button>
          </Dialog.Trigger>
          <Dialog.Content className="m-2">
            <Dialog.Title align="center">
              <label htmlFor="game-code-input">Game code:</label>
            </Dialog.Title>

            <TextField.Input
              id="game-code-input"
              className="rounded"
              value={joinCode}
              onChange={(event) =>
                setJoinCode(event.currentTarget.value.toUpperCase())
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate(`/${joinCode.toUpperCase()}`);
                }
              }}
            />

            <Flex justify="between" mt="3">
              <DialogClose>
                <Button variant="soft">Cancel</Button>
              </DialogClose>
              <DialogClose>
                <Button
                  onClick={() => {
                    navigate(`/${joinCode.toUpperCase()}`);
                  }}
                >
                  Join
                </Button>
              </DialogClose>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Flex>
  );
}
