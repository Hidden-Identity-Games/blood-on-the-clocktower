import { Callout } from "@radix-ui/themes";
import "./PlayerRole.css";

interface PlayerRoleProps {
  self;
}

function PlayerRole({ self }: PlayerRoleProps) {
  if (!self.role)
    return (
      <Callout.Root>
        <Callout.Text>Waiting for game to begin...</Callout.Text>
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
