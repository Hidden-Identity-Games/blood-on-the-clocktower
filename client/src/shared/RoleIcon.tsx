import { roles } from "../assets/game_data/roles";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import { colorMap } from "./CharacterTypes";
import { Text } from "@radix-ui/themes";

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
export function RoleName(roleId: string) {
  return roles[roleId]?.name ?? roleId;
}

export interface RoleTextProps {
  roleId: string;
  children: React.ReactNode;
}

export function RoleText({ roleId, children }: RoleTextProps) {
  const charType = roles[roleId]?.team;
  return <Text color={colorMap[charType] ?? undefined}>{children}</Text>;
}
