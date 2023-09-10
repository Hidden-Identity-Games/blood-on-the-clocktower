import { Button } from "@radix-ui/themes";
import classNames from "classnames";

interface PlayerNameButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: React.ReactNode;
}
export function PlayerNameButton(props: PlayerNameButtonProps) {
  return (
    <Button
      onClick={props.onClick}
      className={classNames(props.className, "capitalize w-full")}
      color="plum"
      highContrast
      variant="soft"
    >
      {props.children}
    </Button>
  );
}
