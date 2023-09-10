import { Dialog, IconButton } from "@radix-ui/themes";

type ColorProp = React.ComponentProps<typeof IconButton>["color"];
interface MeaningfulIconProps {
  explanation: React.ReactNode;
  children: React.ReactNode;
  color?: ColorProp;
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
      <Dialog.Content>{props.explanation}</Dialog.Content>
    </Dialog.Root>
  );
}
