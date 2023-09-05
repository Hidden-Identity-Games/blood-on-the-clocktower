import { roles } from "../assets/game_data/roles";
import DefaultRoleImageSrc from "../assets/default_role.svg";

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
