import { type Character, getCharacter } from "@hidden-identity/shared";
import { type Role } from "@hidden-identity/shared";
import { Flex, Text } from "@radix-ui/themes";
import classNames from "classnames";

import DefaultRoleImageSrc from "../assets/default_role.svg";
import { useDefiniteGame } from "../store/GameContext";
import { useGetPlayerAlignment } from "../store/useStore";
import { type ExtnesionProps, type RadixTextProps } from "../types/radixTypes";
import { colorMap, radixAlignmentColorMap } from "./CharacterTypes";

function roleUrl(url: string) {
  return url.startsWith("http")
    ? url
    : new URL(`../assets/icon/role/${url}`, import.meta.url).href;
}
export const getRoleIcon = (character: Character) =>
  character.imageSrc ? roleUrl(character.imageSrc) : DefaultRoleImageSrc;

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
        backgroundImage: `url(${getRoleIcon(getCharacter(role))})`,
      }}
    ></div>
  );
}
export function RoleName(role: Role) {
  return getCharacter(role)?.name ?? role;
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
      color={radixAlignmentColorMap[getPlayerAlignment(player)] ?? undefined}
      className={classNames("capitalize", className)}
    >
      {children}
    </Text>
  );
}

export type RoleTextProps = {
  role: Role;
  children?: React.ReactNode;
} & ExtnesionProps["Text"];

export function RoleText({ role, children, className, size }: RoleTextProps) {
  const charType = getCharacter(role).team;
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
  className?: string;
}
export function CharacterName({ role, size, className }: CharacterNameProps) {
  return (
    <Flex gap="1" className={className}>
      <RoleIcon role={role} />
      <RoleText role={role} size={size}>
        {getCharacter(role).name}
      </RoleText>
    </Flex>
  );
}

export type PlayerNameProps = ExtnesionProps["Text"] & {
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
    <div className={classNames(className, "flex items-center gap-1")}>
      {children}
      <RoleText role={role} {...textProps}>
        {player}
      </RoleText>
      <RoleIcon role={role} />
    </div>
  );
}
