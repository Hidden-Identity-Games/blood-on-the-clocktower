import { Flex, IconButton } from "@radix-ui/themes";

interface PlayerMenuItemProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export function PlayerMenuItem({ id, label, children }: PlayerMenuItemProps) {
  return (
    <Flex className="text-xl" gap="3">
      <IconButton id={id} variant="soft" size="4" asChild>
        {children}
      </IconButton>
      <label htmlFor={id} className="flex-1 p-1">
        {label}
      </label>
    </Flex>
  );
}
