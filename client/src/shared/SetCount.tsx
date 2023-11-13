import { Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import React from "react";
import { ReactNode } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface SetCountProps {
  children: ReactNode;
  title: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  onSet: (num: number) => void;
}
export function SetCount({
  children,
  title,
  onSet,
  min = 0,
  max = 99,
  defaultValue = min,
}: SetCountProps) {
  const [count, setCount] = React.useState(defaultValue);

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content className="mx-3">
        <Flex direction="column" gap="9">
          <Dialog.Title>{title}</Dialog.Title>
          <Text size="8">
            <Flex justify="center" align="center" gap="7">
              <IconButton
                variant="soft"
                radius="full"
                size="3"
                onClick={() => setCount((curr) => Math.max(curr - 1, min))}
              >
                <AiOutlineMinus />
              </IconButton>
              <span>{count}</span>
              <IconButton
                variant="soft"
                radius="full"
                size="3"
                onClick={() => setCount((curr) => Math.min(curr + 1, max))}
              >
                <AiOutlinePlus />
              </IconButton>
            </Flex>
          </Text>
          <Flex justify="between">
            <Dialog.Close>
              <Button variant="surface" size="3">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button size="3" onClick={() => onSet(count)}>
                Confirm
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
