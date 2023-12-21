import { CharacterNightData, PlayerStatusMap } from "@hidden-identity/shared";

import { KillAction } from "./KillAction";
import {
  CharacterAbilityActon,
  DrunkActon,
  PoisonActon,
  ProtectedActon,
} from "./StatusNightAction";

type PlayeractionMap = PlayerStatusMap;
type NightActionPossibility = PlayeractionMap[keyof PlayeractionMap]["type"];
const NightActionComponents: {
  [K in NightActionPossibility]: React.ComponentType<{
    status: PlayeractionMap[K];
  }>;
} = {
  poison: PoisonActon,
  drunk: DrunkActon,
  dead: KillAction,
  protected: ProtectedActon,
  characterAbility: CharacterAbilityActon,
};

interface NightActionProps {
  nightData: CharacterNightData;
}
export function NightAction({ nightData }: NightActionProps) {
  if (!nightData.status) {
    return null;
  }

  return (
    <>
      {nightData.status.map((status) => {
        const Component = NightActionComponents[
          status.type
        ] as React.ComponentType<{
          status: Omit<PlayerStatusMap[typeof status.type], "id">;
        }>;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return <Component key={status.type} status={status} />;
      })}
    </>
  );
}
