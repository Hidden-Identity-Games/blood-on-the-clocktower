import { Callout } from "@radix-ui/themes";
import "./PlayerRole.css";

interface PlayerRoleProps {
  self;
}

function PlayerRole({ self }: PlayerRoleProps) {
  if (!self.role)
    return (
      <Callout.Root>
        <Callout.Text>
          Sorry {self.name}, this game has started without you :(
        </Callout.Text>
      </Callout.Root>
    );

  return (
    <>
      <div>
        Hello {self.name}, welcome to the game! Tap the screen to reveal your
        role.
      </div>
      <div className="role">You are the {self.role}</div>
    </>
  );
}

export default PlayerRole;
