import { Button, Flex } from "@radix-ui/themes";
import "./PlayerRole.css";
import tokenBack from "../assets/token_logo.png";
import tokenBlank from "../assets/token_blank.png";
import fingerprintImage from "../assets/fingerprint.png";
import { getCharacter } from "../assets/game_data/gameData";
import { Role } from "@hidden-identity/server";
import { useState } from "react";
import { AlignmentText } from "../shared/RoleIcon";
import { usePlayer } from "../store/secretKey";
import { useSetPlayerSeenRole } from "../store/actions/playerActions";
import classNames from "classnames";

interface PlayerRoleProps {
  role: Role;
}

function PlayerRole({ role }: PlayerRoleProps) {
  const [player] = usePlayer();
  const [hasSeenRole, setHasSeenRole] = useState(false);
  const [, , , setPlayerRoleSeen] = useSetPlayerSeenRole();

  return (
    <Flex
      direction="column-reverse"
      align="center"
      justify="between"
      className=" flex-1 bg-transparent"
    >
      <Flex direction="column" justify="center">
        <button
          data-flipper="true"
          className={classNames(
            "mb-2 flex w-full flex-col items-center justify-center py-6 text-red-700",
            hasSeenRole && "opacity-0",
          )}
          disabled={hasSeenRole}
          onClick={() => {
            setHasSeenRole(true);
          }}
        >
          <img
            className="h-[110px] w-[85px]"
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            src={fingerprintImage}
          />
          <div className="select-none">Reveal Role</div>
        </button>
        <Button
          className="mb-6"
          disabled={!hasSeenRole}
          onClick={() => setPlayerRoleSeen(player!)}
        >
          I Know My Role
        </Button>
      </Flex>

      <div
        className="perspective aspect-square h-1/2 p-4"
        data-flipped={hasSeenRole ? "true" : "false"}
      >
        <div className="relative h-full w-full" data-card="true">
          <div data-card-side="front" className="h-full w-full">
            <img
              className="h-full w-full"
              src={tokenBack}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          {/* token background */}
          <div data-card-side="back" className="h-full w-full">
            <img
              className="h-full w-full"
              src={tokenBlank}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          {/* Role icon */}
          <div data-card-side="back" className="h-full w-full text-center">
            <img
              className="mt-3 h-full w-full"
              src={getCharacter(role).imageSrc}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
            <AlignmentText player={player!}>
              {getCharacter(role).name}
            </AlignmentText>
          </div>
        </div>
      </div>
    </Flex>
  );
}

export default PlayerRole;
