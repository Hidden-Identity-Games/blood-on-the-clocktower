import { Button, IconButton, Text, ThemeOptions } from "@radix-ui/themes";

export type RadixColor = ThemeOptions["accentColor"];

export type RadixTextProps = Pick<
  React.ComponentProps<typeof Text>,
  "size" | "color"
> & { className?: string };
export type RadixIconButtonProps = Pick<
  React.ComponentProps<typeof IconButton>,
  "size" | "color"
> & { className?: string };
export type RadixButtonProps = Pick<
  React.ComponentProps<typeof Button>,
  "size" | "color"
> & { className?: string };

export type ExtnesionProps = {
  Button: RadixButtonProps;
  IconButton: RadixIconButtonProps;
  Text: RadixTextProps;
};
