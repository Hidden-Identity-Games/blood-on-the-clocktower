import { Button, Dialog, DialogClose, Flex, TextField } from "@radix-ui/themes";
import {
  ComponentProps,
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from "react";
import { DialogHeader } from "./DialogHeader";

type StringContextState = {
  value: string;
  setValue: (nextValue: string) => void;
  submit: () => void;
};

const GameSelectContext = createContext<StringContextState>({
  value: "",
  setValue: () => {},
  submit: () => {},
});

function GameSelectInput() {
  const { value, setValue, submit } = useContext(GameSelectContext);

  return (
    <TextField.Input
      id="game-code-input"
      className="rounded"
      placeholder="Game code, e.g. XLBTV"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value.toUpperCase())}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          submit();
        }
      }}
    />
  );
}

interface GameSelectButonProps extends ComponentProps<typeof Button> {}
const GameSelectButton = forwardRef<HTMLButtonElement, GameSelectButonProps>(
  function GameSelectButton({ onClick, ...buttonProps }, ref) {
    const { submit } = useContext(GameSelectContext);
    return (
      <Button
        ref={ref}
        {...buttonProps}
        onClick={(e) => {
          onClick?.(e);
          submit();
        }}
      >
        Join Game
      </Button>
    );
  },
);

export interface GameSelectRootProps {
  children: React.ReactNode;
  onSubmit: (value: string) => void;
  initialValue?: string;
}

function GameSelectRoot({
  children,
  onSubmit,
  initialValue = "",
}: GameSelectRootProps) {
  const [value, setValue] = useState(initialValue);
  const contextValue = useMemo(
    () => ({
      value,
      setValue: (nextValue: string) => setValue(nextValue.toUpperCase()),
      submit: () => onSubmit(value),
    }),
    [value, setValue, onSubmit],
  );

  return (
    <GameSelectContext.Provider value={contextValue}>
      {children}
    </GameSelectContext.Provider>
  );
}

export interface GameSelectModalProps {
  onSubmit: (value: string) => void;
  title: string;
  children: React.ReactNode;
}

export function GameSelectModal({
  onSubmit,
  children,
  title,
}: GameSelectModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <DialogHeader>{title}</DialogHeader>
        <GameSelect.Root onSubmit={onSubmit}>
          <GameSelect.Input />
          <Flex justify="between" mt="3">
            <DialogClose>
              <Button variant="soft">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <GameSelect.SubmitButton />
            </DialogClose>
          </Flex>
        </GameSelect.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export const GameSelect = {
  SubmitButton: GameSelectButton,
  Input: GameSelectInput,
  Root: GameSelectRoot,
};
