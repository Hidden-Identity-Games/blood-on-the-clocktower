import { getRole, roles } from "../assets/game_data/gameData";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import { colorMap } from "./CharacterTypes";
import { Text } from "@radix-ui/themes";
import { Role } from "@hidden-identity/server";
import classNames from "classnames";

export interface RoleIconProps extends React.HTMLAttributes<HTMLImageElement> {
  role: string;
}
export function RoleIcon({ role, ...props }: RoleIconProps) {
  return (
    <img
      src={roles[role]?.imageSrc ?? DefaultRoleImageSrc}
      style={{
        objectFit: "contain",
        maxHeight: "100%",
        ...(props.style ?? {}),
      }}
      {...props}
    />
  );
}
export function RoleName(role: string) {
  return roles[role]?.name ?? role;
}

export interface RoleTextProps {
  role: Role;
  children?: React.ReactNode;
  className?: string;
}

export function RoleText({ role, children, className }: RoleTextProps) {
  const charType = roles[role]?.team;
  return (
    <Text
      color={colorMap[charType] ?? undefined}
      className={classNames("capitalize", className)}
    >
      {children ?? getRole(role).name ?? role}
    </Text>
  );
}
