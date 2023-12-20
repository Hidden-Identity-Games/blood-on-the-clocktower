import { Flex, IconButton } from "@radix-ui/themes";
import { SheetClose } from "../../shared/Sheet/Sheet";

interface PlayerMenuItemProps {
  id: string;
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function PlayerMenuItem({
  id,
  label,
  children,
  ...props
}: PlayerMenuItemProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 p-1 text-xl"
    >
      <IconButton id={id} variant="soft" size="2" {...props} className="p-2">
        {children}
      </IconButton>
      {label}
    </label>
  );
}
