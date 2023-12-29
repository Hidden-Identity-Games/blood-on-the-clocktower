import { Flex, IconButton } from "@radix-ui/themes";

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
    <Flex className="items-center text-xl" gap="3">
      <IconButton
        id={id}
        variant="soft"
        size="4"
        {...props}
        className="p-[14px]"
      >
        {children}
      </IconButton>
      <label htmlFor={id} className="flex-1 cursor-pointer p-1">
        {label}
      </label>
    </Flex>
  );
}
