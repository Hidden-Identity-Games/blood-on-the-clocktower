import { getCharacter } from "../assets/game_data/gameData";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import { colorMap } from "./CharacterTypes";
import { Flex, Text } from "@radix-ui/themes";
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
        "bg-center bg-contain h-[1.5em] aspect-square flex items-center justify-center bg-no-repeat",
        props.className,
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
  size?: "1" | "2" | "3";
}

export function RoleText({ role, children, className, size }: RoleTextProps) {
  const charType = getCharacter(role)?.team;
  return (
    <Text
      size={size}
      color={colorMap[charType] ?? undefined}
      className={classNames("capitalize", className)}
    >
      {children ?? getCharacter(role).name ?? role}
    </Text>
  );
}

export interface CharacterNameProps {
  role: Role;
  size?: "1" | "2" | "3";
}
export function CharacterName({ role, size }: CharacterNameProps) {
  return (
    <Flex gap="1">
      <RoleIcon role={role} />
      <RoleText role={role} size={size}>
        {getCharacter(role).name}
      </RoleText>
    </Flex>
  );
}
