import { useDefiniteGame } from "../../../../store/GameContext";
import { DayReminders } from "./DayReminders";
import { NightActions } from "./NightActions";

export interface ActionsTabProps {}

export function ActionsTab() {
  const { game } = useDefiniteGame();

  return game.time.time === "day" ? <DayReminders /> : <NightActions />;
}
