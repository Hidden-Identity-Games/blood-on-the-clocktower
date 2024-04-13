import { Dialog } from "@design-system/components/ui/dialog";
import { IconButton, Text } from "@radix-ui/themes";

import { type ExtnesionProps } from "../types/radixTypes";

interface MeaningfulIconProps extends React.HTMLAttributes<HTMLButtonElement> {
  explanation: React.ReactNode;
  children: React.ReactNode;
  header: React.ReactNode;
  color?: ExtnesionProps["IconButton"]["color"];
  size?: ExtnesionProps["IconButton"]["size"];
}
export function MeaningfulIcon(props: MeaningfulIconProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild className={props.className}>
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
        <Dialog.Header>{props.header}</Dialog.Header>
        <Text as="div" className="">
          {props.explanation}
        </Text>
      </Dialog.Content>
    </Dialog.Root>
  );
}
export function MeaningfulStatusIcon(props: MeaningfulIconProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild className={props.className}>
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
        <Dialog.Header>{props.header}</Dialog.Header>
        <Text as="div" className="">
          {props.explanation}
        </Text>
      </Dialog.Content>
    </Dialog.Root>
  );
}
