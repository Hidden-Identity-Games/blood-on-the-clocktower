import { Button } from "@design-system/components/button";
import { Checkbox } from "@design-system/components/ui/checkbox";
import { Dialog } from "@design-system/components/ui/dialog";
import { Input } from "@design-system/components/ui/input";
import { Switch } from "@design-system/components/ui/switch";
import { getScript, type Script } from "@hidden-identity/shared";
import { Callout } from "@radix-ui/themes";
import { type ComponentProps, useState } from "react";

import { ScriptSelect } from "../GMRoute/GMSetup/ScriptSelect";
import { useCreateGame, useGame } from "../store/useStore";

export interface NewGameButtonProps extends ComponentProps<typeof Button> {}
export function NewGameButton({
  children,
  ...buttonProps
}: NewGameButtonProps) {
  const { gameId } = useGame();
  const [isTestGame, setIsTestGame] = useState(false);
  const [isFillRoles, setIsFillRoles] = useState(true);
  const [playerCount, setPlayerCount] = useState(15);
  const [script, setScript] = useState<Script | null>(
    getScript("Trouble Brewing"),
  );
  const [newGameError, newGameLoading, , newGame] = useCreateGame();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </Dialog.Trigger>
      <Dialog.Content className="flex min-w-[75vw] flex-col gap-1 p-2">
        <Dialog.Header>Create a new game</Dialog.Header>
        <form
          className="flex flex-col gap-3 overflow-y-auto p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void newGame({
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
          <label className="flex items-center gap-2">
            <Switch
              // className="rounded-full"
              checked={isTestGame}
              onCheckedChange={(e) => setIsTestGame(!!e)}
            />
            Create test game
          </label>

          {isTestGame && (
            <div className="flex flex-col gap-3 ">
              <Input
                placeholder="number of players"
                type="number"
                onChange={(e) => setPlayerCount(Number(e.target.value))}
                // stop the wheel from changing this input
                onWheel={(e) => e.preventDefault()}
                value={playerCount}
                autoFocus
              />
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={isFillRoles}
                  onCheckedChange={(e) => setIsFillRoles(!!e)}
                />
                Assign roles
              </label>
            </div>
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
      </Dialog.Content>
    </Dialog.Root>
  );
}
