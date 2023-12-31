import "./PlayerRole.css";

import { getCharacter } from "@hidden-identity/shared";
import { type Role } from "@hidden-identity/shared";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";

import fingerprintImage from "../../assets/fingerprint.png";
import tokenBlank from "../../assets/token_blank.png";
import tokenBack from "../../assets/token_logo.png";
import { AlignmentText, getRoleIcon } from "../../shared/RoleIcon";
import { useSetPlayerSeenRole } from "../../store/actions/playerActions";
import { usePlayer } from "../../store/usePlayer";

interface PlayerRoleProps {
  role: Role;
}

export function PlayerRole({ role }: PlayerRoleProps) {
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
        {hasSeenRole ? (
          <>
            <Text className="m-5 text-center">
              <AlignmentText player={player!}>
                {getCharacter(role).name}
              </AlignmentText>
              <span>
                <i>{getCharacter(role).ability}</i>
              </span>
            </Text>
            <Text className="mb-4 text-center" size="1" weight="light">
              You don't need to memorize this ability
            </Text>
          </>
        ) : (
          <RevealRoleButton setHasSeenRole={setHasSeenRole} />
        )}
        <Button
          className="mx-3 mb-[65px]"
          disabled={!hasSeenRole}
          onClick={() => void setPlayerRoleSeen(player!)}
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
              src={getRoleIcon(getCharacter(role))}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
        </div>
      </div>
    </Flex>
  );
}

interface RevealRoleButtonProps {
  setHasSeenRole: React.Dispatch<React.SetStateAction<boolean>>;
}
function RevealRoleButton({ setHasSeenRole }: RevealRoleButtonProps) {
  return (
    <button
      data-flipper="true"
      className="mb-2 flex w-full flex-col items-center justify-center py-6 text-red-700"
      onClick={() => {
        setHasSeenRole(true);
      }}
      aria-label="Reveal role"
    >
      <img
        className="h-[110px] w-[85px]"
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        src={fingerprintImage}
      />
      <div className="select-none">Tap to reveal role</div>
    </button>
  );
}
