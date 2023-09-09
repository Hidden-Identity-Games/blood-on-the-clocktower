import { getRole, roles } from "../assets/game_data/gameData";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import { colorMap } from "./CharacterTypes";
import { Text } from "@radix-ui/themes";
import { Role } from "@hidden-identity/server";

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
}

export function RoleText({ role, children }: RoleTextProps) {
  const charType = roles[role]?.team;
  return (
    <Text color={colorMap[charType] ?? undefined} className="capitalize">
      {children ?? getRole(role).name ?? role}
    </Text>
  );
}
