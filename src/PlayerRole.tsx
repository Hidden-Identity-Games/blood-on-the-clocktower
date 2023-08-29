import { Flex } from "@radix-ui/themes";
import "./PlayerRole.css";
import { Character } from "./types/script";
import { Self } from "./store/Game";

interface PlayerRoleProps {
  self: Self;
  characters: Character[];
}

function PlayerRole({ self, characters }: PlayerRoleProps) {
  return (
    <Flex direction="column" align="center">
      <span>Tap to reveal your role.</span>
      <Flex direction="column" align="center" className="role">
        <img
          src={
            characters.find(({ name }) => name === self.role)?.imageSrc ??
            "./src/assets/default_role.svg"
          }
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />
        <span>{self.role}</span>
      </Flex>
    </Flex>
  );
}

export default PlayerRole;
