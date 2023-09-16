import { getCharacter } from "../assets/game_data/gameData";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import { colorMap } from "./CharacterTypes";
import { Text } from "@radix-ui/themes";
import { Role } from "@hidden-identity/server";
import classNames from "classnames";

export interface RoleIconProps extends React.HTMLAttributes<HTMLImageElement> {
  role: Role;
}
export function RoleIcon({ role, ...props }: RoleIconProps) {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        "bg-center bg-contain h-4 w-4 flex items-center justify-center",
      )}
      style={{
        backgroundImage: `url(${
          getCharacter(role)?.imageSrc ?? DefaultRoleImageSrc
        })`,
      }}
    ></div>
  );
}
export function RoleName(role: Role) {
  return getCharacter(role as Role)?.name ?? role;
}

export interface RoleTextProps {
  role: Role;
  children?: React.ReactNode;
  className?: string;
}

export function RoleText({ role, children, className }: RoleTextProps) {
  const charType = getCharacter(role)?.team;
  return (
    <Text
      color={colorMap[charType] ?? undefined}
      className={classNames("capitalize", className)}
    >
      {children ?? getCharacter(role).name ?? role}
    </Text>
  );
}
