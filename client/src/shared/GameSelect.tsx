import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Input } from "@design-system/components/ui/input";
import {
  type ComponentProps,
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from "react";

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
    <Input
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
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <GameSelect.Root onSubmit={onSubmit}>
          <GameSelect.Input />
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <GameSelect.SubmitButton />
            </Dialog.Close>
          </Dialog.Footer>
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
