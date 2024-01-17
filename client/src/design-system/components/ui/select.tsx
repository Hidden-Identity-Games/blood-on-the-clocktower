import classNames from "classnames";

import { Button, type ButtonProps } from "../button";
import { Dialog } from "./dialog";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  OptionsList: SelectOptionsList,
  Option: SelectOption,
};

interface SelectRootProps {
  children: React.ReactNode;
}
function SelectRoot({ children }: SelectRootProps) {
  return <Dialog.Root>{children}</Dialog.Root>;
}

interface SelectTriggerProps extends ButtonProps {
  children: React.ReactNode;
}
function SelectTrigger({ children, ...buttonProps }: SelectTriggerProps) {
  return (
    <Dialog.Trigger asChild>
      <Button variant="select" {...buttonProps}>
        {children}
      </Button>
    </Dialog.Trigger>
  );
}

interface SelectOptionsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
function SelectOptionsList({ children, ...divProps }: SelectOptionsListProps) {
  return (
    <Dialog.Content>
      <div className="flex flex-col gap-1" {...divProps}>
        {children}
      </div>
    </Dialog.Content>
  );
}

interface SelectOptionProps extends ButtonProps {
  children: React.ReactNode;
  isCurrentlySelected: boolean;
}
function SelectOption({
  children,
  isCurrentlySelected,
  className,
  ...buttonProps
}: SelectOptionProps) {
  return (
    <Dialog.Close asChild>
      <Button
        variant={isCurrentlySelected ? "soft" : "outline"}
        className={classNames(className, "w-full")}
        {...buttonProps}
      >
        {children}
      </Button>
    </Dialog.Close>
  );
}
