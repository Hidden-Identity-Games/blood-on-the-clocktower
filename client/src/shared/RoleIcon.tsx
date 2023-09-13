import { getRole, roles } from "../assets/game_data/gameData";
import DefaultRoleImageSrc from "../assets/default_role.svg";
import { colorMap } from "./CharacterTypes";
import { Text } from "@radix-ui/themes";
import { Role } from "@hidden-identity/server";
import classNames from "classnames";
import { GiSkullCrossedBones } from "react-icons/gi";

export interface RoleIconProps extends React.HTMLAttributes<HTMLImageElement> {
  role: string;
  dead?: boolean;
}
export function RoleIcon({ role, dead, ...props }: RoleIconProps) {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        "bg-center bg-contain h-4 w-4 flex items-center justify-center",
      )}
      style={{
        backgroundImage: `url(${roles[role]?.imageSrc ?? DefaultRoleImageSrc})`,
      }}
    >
      {dead && <GiSkullCrossedBones className="h-2 fill-red-600" />}
    </div>
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
