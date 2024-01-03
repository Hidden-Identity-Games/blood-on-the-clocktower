import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { type Alignment } from "@hidden-identity/shared";

import { alignmentColorMap } from "../../../../shared/CharacterTypes";
import { ALIGNMENTS } from "../../../../types/script";

interface AlignmentSelectProps {
  currentAlignment: Alignment;
  onSelect: (nextrole: Alignment | null) => void;
}

export function AlignmentSelect({
  currentAlignment,
  onSelect,
}: AlignmentSelectProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
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
      <Dialog.Content className="flex flex-col gap-1">
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
      </Dialog.Content>
    </Dialog.Root>
  );
}
