import { Button } from "@design-system/components/button";
import { Accordion } from "@design-system/components/ui/accordion";
import { Card } from "@design-system/components/ui/card";
import {
  type ActionQueueItem,
  type CharacterActionQueueItem,
  exhaustiveCheck,
  getAbility,
  getCharacter,
  type SpecialActionQueueItem,
} from "@hidden-identity/shared";
import { Trigger as PrimitiveAccordionTrigger } from "@radix-ui/react-accordion";
import classNames from "classnames";
import { MoonIcon } from "lucide-react";

import { ErrorCallout } from "../../../../../shared/ErrorCallout";
import { RoleIcon, RoleText } from "../../../../../shared/RoleIcon";
import { useCompleteAction } from "../../../../../store/actions/gmActions";
import { useDefiniteGame } from "../../../../../store/GameContext";
import { PlayerMessageFlow } from "../../../../GMShared/PlayerListComponents/PlayerMessage";
import { DemonMessage } from "../../../../GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/DemonMessage";
import { MinionsMessages } from "../../../../GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/MinionsMessage";
import { ReminderCreator } from "../../../../GMShared/PlayerListComponents/PlayerMessage/ReminderCreator";
import { PlayerName } from "../../../../GMShared/PlayerListComponents/PlayerName";

export interface ActionQueueRowProps {
  queueItem: ActionQueueItem;
}
export function ActionQueueRow({ queueItem }: ActionQueueRowProps) {
  const { game } = useDefiniteGame();
  const disabled = queueItem.skipped;

  return (
    <Accordion.Item value={queueItem.id}>
      <Accordion.Trigger
        key={queueItem.id}
        className={classNames("h-auto p-3 text-lg", { grayscale: disabled })}
      >
        {queueItem.type === "character" ? (
          <>
            <RoleIcon role={queueItem.role} className="mr-2 h-[2em]" />
            <span className="flex-1 text-left">
              <RoleText role={game.playersToRoles[queueItem.player]} />
            </span>
            <span className="mx-2 flex-1 text-right">
              {queueItem.player ? (
                <PlayerName player={queueItem.player} className="flex-1" />
              ) : (
                "Skip"
              )}
            </span>
          </>
        ) : (
          <>
            <span className="ml-1 mr-3 flex aspect-square h-[1.5em] grow-0 items-center justify-center">
              <MoonIcon />
            </span>
            <span className="flex-1 text-left">{queueItem.actionType}</span>
          </>
        )}
      </Accordion.Trigger>
      <Accordion.Content className="pl-6" forceMount>
        {queueItem.type == "character" && (
          <PlayerActionFlow action={queueItem} />
        )}
        {queueItem.type == "game" && <SpecialActionFlow action={queueItem} />}
      </Accordion.Content>
    </Accordion.Item>
  );
}

export interface PlayerActionFlowProps {
  action: CharacterActionQueueItem;
}

export function PlayerActionFlow({ action }: PlayerActionFlowProps) {
  const { game } = useDefiniteGame();
  const { role } = action;
  const ability = getAbility(role, game.time);

  return (
    <div className="flex flex-col gap-2 py-3 text-xl">
      <div className="px-2">{getCharacter(role).ability}</div>
      {ability?.playerMessage && (
        <Card.Root>
          <Card.Header>Create message for player</Card.Header>
          <Card.Content>
            {ability?.playerMessage && (
              <PlayerMessageFlow
                action={action}
                message={ability.playerMessage}
              />
            )}
          </Card.Content>
        </Card.Root>
      )}
      {(ability?.setReminders?.length ?? 0) > 0 && (
        <Card.Root>
          <Card.Header>Apply Reminders</Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-1">
              {ability?.setReminders?.map((reminderName, index) => (
                <ReminderCreator
                  key={`${reminderName}_${index}`}
                  reminder={reminderName}
                  fromPlayer={action.player}
                />
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      )}

      <CompleteActionButton actionId={action.id} />
    </div>
  );
}

export interface SpecialActionFlowProps {
  action: SpecialActionQueueItem;
}
export function SpecialActionFlow({ action }: SpecialActionFlowProps) {
  switch (action.actionType) {
    case "DEMON":
      return <DemonMessage action={action} />;
    case "MINIONS":
      return <MinionsMessages action={action} />;
    default:
      exhaustiveCheck(action.actionType);
  }
}

interface CompleteActionButtonProps {
  actionId: string;
}
function CompleteActionButton({ actionId }: CompleteActionButtonProps) {
  const [error, loading, , completeAction] = useCompleteAction();
  return (
    <>
      <ErrorCallout error={error} />
      <PrimitiveAccordionTrigger asChild>
        <Button
          disabled={loading}
          onClick={() => {
            void completeAction(actionId);
          }}
        >
          Complete Action
        </Button>
      </PrimitiveAccordionTrigger>
    </>
  );
}
