import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Input } from "@design-system/components/ui/input";
import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useRef } from "react";
import { type ReactNode } from "react";
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
}: SetCountProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);
  return (
    <>
      <Button
        className="rounded-full px-3"
        variant="secondary"
        onClick={() => setCount((curr) => Math.max(curr - 1, min))}
      >
        <AiOutlineMinus />
      </Button>
      <Input
        className="mx-4 flex w-16 text-center"
        type="number"
        inputMode="decimal"
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
        ref={inputRef}
        onFocus={(e) => e.target.select()}
      />
      <Button
        type="button"
        variant="secondary"
        className="rounded-full px-3"
        onClick={() => setCount((curr) => Math.min(curr + 1, max))}
      >
        <AiOutlinePlus />
      </Button>
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
  const [isOpen, setOpen] = React.useState(false);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(isNowOpen) => {
        setOpen(isNowOpen);
        setCount(defaultValue);
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content
        className="mx-3"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSet(count);
            setOpen(false);
          }
        }}
      >
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Description className="my-8">
          <Text size="8">
            <Flex justify="center" align="center" gap="7">
              <SetCount count={count} setCount={setCount} min={min} max={max} />
            </Flex>
          </Text>
        </Dialog.Description>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button onClick={() => onSet(count)}>Confirm</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
