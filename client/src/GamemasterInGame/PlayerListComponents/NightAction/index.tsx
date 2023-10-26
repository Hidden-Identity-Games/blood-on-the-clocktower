import { CharacterNightData, PlayerStatusMap } from "@hidden-identity/server";
import { PoisonActon } from "./PoisonNightAction";

type PlayeractionMap = PlayerStatusMap & {
  dead: { type: "dead" };
};
type NightActionPossibility = PlayeractionMap[keyof PlayeractionMap]["type"];
const NightActionComponents: {
  [K in NightActionPossibility]: React.ComponentType<{
    status: PlayeractionMap[K];
  }>;
} = {
  poison: PoisonActon,
  custom: () => null,
  drunk: () => null,
  dead: () => null,
};

interface NightActionProps {
  nightData: CharacterNightData;
}
export function NightAction({ nightData }: NightActionProps) {
  if (!nightData.status) {
    return null;
  }
  const Component = NightActionComponents[
    nightData.status.type
  ] as React.ComponentType<{
    status: Omit<PlayerStatusMap[typeof nightData.status.type], "id">;
  }>;

  return <Component status={nightData.status} />;
}
