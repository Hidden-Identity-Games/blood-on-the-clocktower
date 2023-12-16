import { PlayerActions } from "./PlayerActions";
import { PlayerName } from "./PlayerName";
import { PlayerNightReminder } from "./NightReminder";
import { PlayerRoleIcon } from "./PlayerRole";
import { PlayerNoteInput } from "./PlayerNoteInput";
import { PlayerMenuItem } from "./PlayerMenuItem";
import { PlayerMessageFlow } from "./PlayerMessage";
import { PlayerControls } from "./PlayerControls";

export const PlayerList = {
  RoleIcon: PlayerRoleIcon,
  Name: PlayerName,
  NightReminder: PlayerNightReminder,
  Actions: PlayerActions,
  MenuItem: PlayerMenuItem,
  NoteInputModal: PlayerNoteInput,
  PlayerMessage: PlayerMessageFlow,
  // TODO: Route PlayerControls through here. SpectatorControls to route elsewhere in another PR.
  PlayerControls: PlayerControls,
};
