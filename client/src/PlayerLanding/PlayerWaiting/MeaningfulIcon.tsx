import { Dialog, IconButton, Text } from "@radix-ui/themes";
import { DialogHeader } from "../../shared/DialogHeader";

type ColorProp = React.ComponentProps<typeof IconButton>["color"];
interface MeaningfulIconProps {
  explanation: React.ReactNode;
  children: React.ReactNode;
  color?: ColorProp;
  title: React.ReactNode;
  size?: "1" | "2" | "3" | "4";
}
export function MeaningfulIcon(props: MeaningfulIconProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton
          variant="surface"
          color={props.color}
          radius="full"
          size={props.size}
        >
          {props.children}
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <DialogHeader>{props.title}</DialogHeader>
        <Text as="div" className="mt-3">
          {props.explanation}
        </Text>
      </Dialog.Content>
    </Dialog.Root>
  );
}
