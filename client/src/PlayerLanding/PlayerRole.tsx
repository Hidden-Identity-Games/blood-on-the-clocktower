import { Flex } from "@radix-ui/themes";
import "./PlayerRole.css";
import { Character } from "../types/script";
import { Self } from "../store/Game";

interface PlayerRoleProps {
  self: Self;
  characters: Character[];
}

function PlayerRole({ self, characters }: PlayerRoleProps) {
  return (
    <Flex direction="column" align="center" className="role">
      <Flex direction="column" align="center">
        <div className="role-inner">
          <div className="role-hidden">
            <img
              width={"300px"}
              height={"300px"}
              src="./src/assets/token_logo.png"
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          <div className="role-shown">
            <img
              width={"300px"}
              height={"300px"}
              src="./src/assets/token_blank.png"
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          <div className="role-shown">
            <img
              width={"300px"}
              height={"300px"}
              src={
                characters.find(({ name }) => name === self.role)?.imageSrc ??
                "./src/assets/default_role.svg"
              }
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
            <div>{self.role}</div>
          </div>
        </div>
      </Flex>
      <div className="fingerprint">
        <img
          width={"85px"}
          height={"110px"}
          //style={{ paddingTop: "100%" }}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          src="./src/assets/fingerprint.png"
        />
        <div>Hold to reveal role</div>
      </div>
    </Flex>
  );
}

export default PlayerRole;
