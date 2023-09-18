import { getCharacter } from "../assets/game_data/gameData";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import { alignmentColorMap, colorMap } from "./CharacterTypes";
import { Flex, Text } from "@radix-ui/themes";
import { Role } from "@hidden-identity/server";
import classNames from "classnames";
import { useDefiniteGame } from "../store/GameContext";
import { useGetPlayerAlignment } from "../store/useStore";
import { ExtensionProps, RadixTextProps } from "../types/radixTypes";

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
        backgroundPosition: "center 3px",
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

export type AlignmentTextProps = RadixTextProps & {
  player: string;
  children: React.ReactNode;
};
export function AlignmentText({
  player,
  className,
  children,
  ...textProps
}: AlignmentTextProps) {
  const getPlayerAlignment = useGetPlayerAlignment();
  return (
    <Text
      {...textProps}
      color={alignmentColorMap[getPlayerAlignment(player)] ?? undefined}
      className={classNames("capitalize", className)}
    >
      {children}
    </Text>
  );
}

export type RoleTextProps = {
  role: Role;
  children?: React.ReactNode;
} & ExtensionProps["Text"];

export function RoleText({
  role,
  children,
  className,
  size,
  color,
}: RoleTextProps) {
  const charType = getCharacter(role).team;
  return (
    <Text
      size={size}
      color={color ?? colorMap[charType] ?? undefined}
      className={classNames("capitalize", className)}
    >
      {children ?? getCharacter(role).name ?? role}
    </Text>
  );
}

export type CharacterNameProps = {
  role: Role;
  size?: "1" | "2" | "3";
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  className?: string;
} & ExtensionProps["Text"];
export function CharacterName({
  role,
  size,
  gap = "1",
  className,
  color,
}: CharacterNameProps) {
  return (
    <Flex gap={gap} className={className}>
      <RoleIcon role={role} />
      <RoleText role={role} size={size} color={color}>
        {getCharacter(role).name}
      </RoleText>
    </Flex>
  );
}

export type PlayerNameProps = ExtensionProps["Text"] & {
  player: string;
  className?: string;
  children?: React.ReactNode;
};
export function PlayerNameWithRoleIcon({
  className,
  player,
  children,
  ...textProps
}: PlayerNameProps) {
  const { game } = useDefiniteGame();
  const role = game.playersToRoles[player];
  return (
    <Flex gap="1" className={className}>
      {children}
      <RoleText role={role} {...textProps}>
        {player}
      </RoleText>
      <RoleIcon role={role} />
    </Flex>
  );
}
