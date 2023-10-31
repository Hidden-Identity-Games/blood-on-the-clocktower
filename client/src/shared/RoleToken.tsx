import { Role, getCharacter } from "@hidden-identity/shared";
import tokenBlank from "../assets/token_blank.png";
import { getRoleIcon } from "./RoleIcon";
import "./roleToken.css";

interface RoleTokenProps {
  role: Role;
  children: React.ReactNode;
}
export function RoleToken({ role, children }: RoleTokenProps) {
  return (
    <div
      className="roleWrapper flex h-full w-full flex-col pt-[10%] hover:z-30"
      style={{
        backgroundImage: `url(${tokenBlank})`,
        backgroundSize: "cover",
      }}
    >
      <img className="mx-auto w-4/5" src={getRoleIcon(getCharacter(role))} />
      <div className="-mt-[25%] overflow-y-visible">
        <div className="playerInfo mt-2  rounded bg-violet-700 bg-opacity-[50%] text-center text-base opacity-[75%]">
          {children}
        </div>
      </div>
    </div>
  );
}
