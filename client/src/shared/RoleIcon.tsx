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
  return roles[roleId]?.name ?? capitalize(roleId);
}

function capitalize(toCap: string = "") {
  return toCap
    .split(/[_ ]/)
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
}
