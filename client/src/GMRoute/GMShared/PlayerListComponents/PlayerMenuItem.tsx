import { Button } from "@design-system/components/button";
import { Flex } from "@radix-ui/themes";

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
    <Flex className="w-full items-center text-xl" gap="3">
      <Button id={id} {...props} className="p-[14px]">
        {children}
      </Button>
      <label htmlFor={id} className="flex-1 cursor-pointer p-1">
        {label}
      </label>
    </Flex>
  );
}
