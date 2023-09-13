import { Cross1Icon } from "@radix-ui/react-icons";
import { Dialog, Flex, IconButton } from "@radix-ui/themes";

export function DialogHeader(props: { children: React.ReactNode }) {
  return (
    <Flex className="w-full" justify={props.children ? "between" : "end"}>
      {props.children && <Dialog.Title>{props.children}</Dialog.Title>}
      <Dialog.Close>
        <IconButton variant="ghost" radius="full" size="1" className="w-fit">
          <Cross1Icon />
        </IconButton>
      </Dialog.Close>
    </Flex>
  );
}
