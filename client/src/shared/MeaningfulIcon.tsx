import { Dialog, IconButton, Text } from "@radix-ui/themes";
import { DialogHeader } from "./DialogHeader";

type ColorProp = React.ComponentProps<typeof IconButton>["color"];
interface MeaningfulIconProps extends React.HTMLAttributes<HTMLButtonElement> {
  explanation: React.ReactNode;
  children: React.ReactNode;
  color?: ColorProp;
  header: React.ReactNode;
  size?: "1" | "2" | "3" | "4";
}
export function MeaningfulIcon(props: MeaningfulIconProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={props.className}>
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
        <DialogHeader>{props.header}</DialogHeader>
        <Text as="div" className="mt-3">
          {props.explanation}
        </Text>
      </Dialog.Content>
    </Dialog.Root>
  );
}
export function MeaningfulStatusIcon(props: MeaningfulIconProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={props.className}>
        <IconButton
          variant="soft"
          color={props.color}
          radius="full"
          size={props.size}
        >
          {props.children}
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <DialogHeader>{props.header}</DialogHeader>
        <Text as="div" className="mt-3">
          {props.explanation}
        </Text>
      </Dialog.Content>
    </Dialog.Root>
  );
}
