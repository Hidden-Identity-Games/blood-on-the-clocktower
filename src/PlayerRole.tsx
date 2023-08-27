import { Flex } from "@radix-ui/themes";
import "./PlayerRole.css";
import { Character } from "./types/script";

interface PlayerRoleProps {
  self;
  characters: Character[];
}

function PlayerRole({ self, characters }: PlayerRoleProps) {
  return (
    <>
      <div>Hello {self.name}, welcome to the game!</div>
      <div>Tap to reveal your role.</div>
      <Flex direction="column" align="center" className="role">
        <img
          src={
            characters.filter(({ name }) => name === self.role)[0]?.imageSrc ??
            "./src/assets/default_role.svg"
          }
          onContextMenu={(event) => {
            event.preventDefault;
            event.stopPropagation();
          }}
        />
        <div>{self.role}</div>
      </Flex>
    </>
  );
}

export default PlayerRole;
