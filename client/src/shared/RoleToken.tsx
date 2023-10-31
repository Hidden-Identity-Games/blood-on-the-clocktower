import { Role, getCharacter } from "@hidden-identity/shared";
import tokenBlank from "../assets/token_blank.png";
import { getRoleIcon } from "./RoleIcon";

interface RoleTokenProps {
  role: Role;
}
export function RoleToken({ role }: RoleTokenProps) {
  return (
    <div
      className="flex h-full w-full flex-col pt-[10%]"
      style={{
        backgroundImage: `url(${tokenBlank})`,
        backgroundSize: "cover",
      }}
    >
      <img className="mx-auto w-4/5" src={getRoleIcon(getCharacter(role))} />
    </div>
  );
}
