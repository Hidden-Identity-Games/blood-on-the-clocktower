import {
  CharacterNightData,
  PlayerStatus,
  PlayerStatusTypeMap,
} from "@hidden-identity/server";
import { PoisonActon } from "./PoisonNightAction";

type NightActionPossibility = PlayerStatus["type"];
const NightActionComponents: {
  [K in NightActionPossibility]: React.ComponentType<{
    status: PlayerStatusTypeMap[K];
  }>;
} = {
  poison: PoisonActon,
  custom: () => null,
  drunk: () => null,
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
    status: PlayerStatusTypeMap[typeof nightData.status.type];
  }>;

  return <Component status={nightData.status} />;
}
