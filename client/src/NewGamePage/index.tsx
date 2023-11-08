import { Button, Dialog, DialogClose, Flex, TextField } from "@radix-ui/themes";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import title from "../assets/title_banner.png";
import backgroundImg from "../assets/hidden_identity_cover.png";
import { NewGameButton } from "./NewGameButton";

export function NewGameLanding() {
  const [joinCode, setJoinCode] = React.useState("");
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const handleJoinGame = () => {
    navigate(
      `/${joinCode.toUpperCase()}/desktop?${search.toString()}&view=night`,
    );
  };

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
        className="mx-auto mb-6 mt-auto w-full min-w-[300px] max-w-[450px] self-end"
        direction="row"
        align="center"
        justify={"between"}
      >
        <NewGameButton fromRoot>Create game</NewGameButton>

        <Dialog.Root>
          <Dialog.Trigger>
            <Button>Join Game</Button>
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
                  handleJoinGame();
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
                    handleJoinGame();
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
