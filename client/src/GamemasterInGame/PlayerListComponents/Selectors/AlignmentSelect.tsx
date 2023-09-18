import { Button, Dialog, Flex } from "@radix-ui/themes";
import { ALIGNMENTS } from "../../../types/script";
import { alignmentColorMap } from "../../../shared/CharacterTypes";
import { Alignment } from "@hidden-identity/server";

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
          variant="soft"
          size="3"
          className="capitalize"
          color={alignmentColorMap[currentAlignment]}
        >
          <Flex className="w-full text-center" align="center" justify="center">
            {currentAlignment}
          </Flex>
        </Button>
      </Dialog.Trigger>
      <Flex direction="column" gap="1" asChild>
        <Dialog.Content>
          {ALIGNMENTS.map((team) => (
            <Dialog.Close key={team}>
              <Button
                className="capitalize"
                size="3"
                color={alignmentColorMap[currentAlignment]}
                variant={team === currentAlignment ? "soft" : "outline"}
                onClick={() => onSelect(team)}
              >
                <Flex
                  className="w-full text-center"
                  align="center"
                  justify="center"
                >
                  {team}
                </Flex>
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}
