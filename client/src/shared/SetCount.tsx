import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import React from "react";
import { ReactNode } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface SetCountProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  min?: number;
  max?: number;
  autoFocus?: boolean;
}
export function SetCount({
  count,
  setCount,
  min = 0,
  max = 100,
  autoFocus = false,
}: SetCountProps) {
  return (
    <>
      <IconButton
        variant="soft"
        radius="full"
        size="3"
        onClick={() => setCount((curr) => Math.max(curr - 1, min))}
      >
        <AiOutlineMinus />
      </IconButton>
      <TextField.Input
        className="w-6"
        size="3"
        type="number"
        value={count}
        onChange={(e) =>
          setCount(
            Number.parseInt(
              e.currentTarget.value ? e.currentTarget.value : "0",
            ),
          )
        }
        min={min}
        max={max}
        autoFocus={autoFocus}
        onFocus={(e) => e.currentTarget.select()}
      />
      <IconButton
        variant="soft"
        radius="full"
        size="3"
        onClick={() => setCount((curr) => Math.min(curr + 1, max))}
      >
        <AiOutlinePlus />
      </IconButton>
    </>
  );
}

interface SetCountModalProps {
  children: ReactNode;
  title: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  onSet: (num: number) => void;
}
export function SetCountModal({
  children,
  title,
  onSet,
  min = 0,
  max = 99,
  defaultValue = min,
}: SetCountModalProps) {
  const [count, setCount] = React.useState(defaultValue);

  return (
    <Dialog.Root onOpenChange={() => setCount(defaultValue)}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content className="mx-3">
        <Flex direction="column" gap="9">
          <Dialog.Title>{title}</Dialog.Title>
          <Text size="8">
            <Flex justify="center" align="center" gap="7">
              <SetCount
                count={count}
                setCount={setCount}
                min={min}
                max={max}
                autoFocus
              />
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
