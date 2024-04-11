import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { type Alignment } from "@hidden-identity/shared";

import { alignmentColorMap } from "../../../../shared/CharacterTypes";
import { ALIGNMENTS } from "../../../../types/script";
import { PlayerName } from "../PlayerName";

interface AlignmentSelectProps {
  currentAlignment: Alignment;
  onSelect: (nextrole: Alignment | null) => void;
  player?: string;
}

export function AlignmentSelect({
  currentAlignment,
  onSelect,
  player,
}: AlignmentSelectProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="select"
          className="w-full capitalize"
          color={alignmentColorMap[currentAlignment]}
        >
          <div className="flex w-full items-center justify-center text-center">
            {currentAlignment}
          </div>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header className="mb-3">
          {player ? (
            <span>
              Set Alignment for <PlayerName player={player} />
            </span>
          ) : (
            <span>Set alignment</span>
          )}
        </Dialog.Header>
        <Dialog.Description className="flex flex-col gap-3">
          {ALIGNMENTS.map((alignment) => (
            <Dialog.Close key={alignment} asChild>
              <Button
                className="capitalize"
                variant="select"
                color={alignmentColorMap[alignment]}
                onClick={() => onSelect(alignment)}
              >
                <div className="flex w-full items-center justify-center text-center">
                  {alignment}
                </div>
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
