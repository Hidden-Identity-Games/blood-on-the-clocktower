import { Flex } from "@radix-ui/themes";
import "./PlayerRole.css";
import { Character } from "../types/script";
import { Self } from "../store/Game";
import tokenBack from "../assets/token_logo.png";
import tokenBlank from "../assets/token_blank.png";
import defaultRoleImage from "../assets/default_role.svg";
import fingerprintImage from "../assets/fingerprint.png";

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
              src={tokenBack}
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
              src={tokenBlank}
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
                characters.find(({ id }) => id === self.role)?.imageSrc ??
                defaultRoleImage
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
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          src={fingerprintImage}
        />
        <div>Hold to reveal role</div>
      </div>
    </Flex>
  );
}

export default PlayerRole;
