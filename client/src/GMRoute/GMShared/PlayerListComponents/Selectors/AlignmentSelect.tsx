import { Button, Dialog, Flex } from "@radix-ui/themes";
import { ALIGNMENTS } from "../../../../types/script";
import { alignmentColorMap } from "../../../../shared/CharacterTypes";
import { Alignment } from "@hidden-identity/shared";

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
          className="w-full capitalize"
          color={alignmentColorMap[currentAlignment]}
        >
          <Flex className="w-full text-center" align="center" justify="center">
            {currentAlignment}
          </Flex>
        </Button>
      </Dialog.Trigger>
      <Flex direction="column" gap="1" asChild>
        <Dialog.Content>
          {ALIGNMENTS.map((alignment) => (
            <Dialog.Close key={alignment}>
              <Button
                className="capitalize"
                size="3"
                variant="surface"
                color={alignmentColorMap[alignment]}
                onClick={() => onSelect(alignment)}
              >
                <Flex
                  className="w-full text-center"
                  align="center"
                  justify="center"
                >
                  {alignment}
                </Flex>
              </Button>
            </Dialog.Close>
          ))}
        </Dialog.Content>
      </Flex>
    </Dialog.Root>
  );
}
