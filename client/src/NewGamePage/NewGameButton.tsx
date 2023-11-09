import {
  Button,
  Callout,
  Checkbox,
  Dialog,
  Flex,
  TextFieldInput,
  Switch,
} from "@radix-ui/themes";
import { DialogHeader } from "../shared/DialogHeader";
import { ScriptSelect } from "../GamemasterInGame/ScriptSelect";
import { useState } from "react";
import { Script, getScript } from "@hidden-identity/shared";
import { useCreateGame, useGame } from "../store/useStore";

export function NewGameButton({ children }: { children: React.ReactNode }) {
  const { gameId } = useGame();
  const [isTestGame, setIsTestGame] = useState(false);
  const [isFillRoles, setIsFillRoles] = useState(true);
  const [playerCount, setPlayerCount] = useState("");
  const [script, setScript] = useState<Script | null>(
    getScript("Trouble Brewing"),
  );
  const [newGameError, newGameLoading, , newGame] = useCreateGame();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>{children}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <DialogHeader>Create a new game</DialogHeader>
        <Flex asChild direction="column" gap="3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              newGame({
                oldGameId: gameId ?? undefined,
                script: script!,
                testGameOptions: isTestGame
                  ? {
                      isTestGame: true,
                      players: Number(playerCount),
                      randomRoles: isFillRoles,
                    }
                  : { isTestGame: false },
              });
            }}
          >
            <ScriptSelect onScriptChange={(s) => setScript(s)} />
            <Flex asChild gap="2" align="center">
              <label>
                <Switch
                  checked={isTestGame}
                  onCheckedChange={(e) => setIsTestGame(!!e)}
                  radius="full"
                />
                Create test game
              </label>
            </Flex>

            {isTestGame && (
              <Flex gap="3" px="4" direction="column">
                <TextFieldInput
                  placeholder="number of players"
                  type="number"
                  onChange={(e) => setPlayerCount(e.target.value)}
                  // stop the wheel from changing this input
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <Flex asChild gap="2" align="center">
                  <label>
                    <Checkbox
                      checked={isFillRoles}
                      onCheckedChange={(e) => setIsFillRoles(!!e)}
                    />
                    Assign roles
                  </label>
                </Flex>
              </Flex>
            )}

            <Button disabled={newGameLoading} type="submit">
              {newGameLoading ? "Please wait" : "Create"}
            </Button>
            {newGameError && (
              <Callout.Root>
                <Callout.Text>
                  Sorry there was an error, please try again.
                </Callout.Text>
              </Callout.Root>
            )}
          </form>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
