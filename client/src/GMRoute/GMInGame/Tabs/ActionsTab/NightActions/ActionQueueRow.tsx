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
import { CheckIcon, MoonIcon } from "lucide-react";

import { ErrorCallout } from "../../../../../shared/ErrorCallout";
import { RoleIcon, RoleText } from "../../../../../shared/RoleIcon";
import { useCompleteAction } from "../../../../../store/actions/gmActions";
import { useDefiniteGame } from "../../../../../store/GameContext";
import { KillAction } from "../../../../GMShared/PlayerListComponents/NightAction/KillAction";
import { PlayerMessageFlow } from "../../../../GMShared/PlayerListComponents/PlayerMessage";
import { DemonMessage } from "../../../../GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/DemonMessage";
import { ExecutionMessage } from "../../../../GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/ExecutionMessage";
import { MinionsMessages } from "../../../../GMShared/PlayerListComponents/PlayerMessage/MessageCreators/SpecialActionMessageCreators/MinionsMessage";
import { SubmitMessage } from "../../../../GMShared/PlayerListComponents/PlayerMessage/messageShared/SubmitMessage";
import { ReminderCreator } from "../../../../GMShared/PlayerListComponents/PlayerMessage/ReminderCreator";
import { PlayerName } from "../../../../GMShared/PlayerListComponents/PlayerName";

export interface ActionQueueRowProps {
  queueItem: ActionQueueItem;
}
export function ActionQueueRow({ queueItem }: ActionQueueRowProps) {
  const disabled = queueItem.status !== "todo";

  return (
    <Accordion.Item value={queueItem.id}>
      <Accordion.Trigger
        key={queueItem.id}
        className={classNames("h-auto p-3 text-lg", { grayscale: disabled })}
      >
        {queueItem.type === "character" && (
          <>
            <ActionQueueRowIcon item={queueItem}>
              <RoleIcon role={queueItem.role} className="mr-2 h-[2em]" />
            </ActionQueueRowIcon>

            <span className="flex-1 text-left">
              <RoleText role={queueItem.role} />
            </span>
            <span className="mx-2 flex-1 text-right">
              {queueItem.player ? (
                <PlayerName player={queueItem.player} className="flex-1" />
              ) : (
                "Skip"
              )}
            </span>
          </>
        )}
        {queueItem.type === "game" && (
          <>
            <ActionQueueRowIcon item={queueItem}>
              <MoonIcon className="mr-2 h-[2em]" />
            </ActionQueueRowIcon>
            <span className="flex-1 text-left">{queueItem.actionType}</span>
          </>
        )}
      </Accordion.Trigger>
      <Accordion.Content
        className="flex flex-col gap-2 py-3 pl-6 text-xl"
        forceMount
      >
        {queueItem.type === "character" && (
          <PlayerActionFlow action={queueItem} />
        )}
        {queueItem.type === "game" && <SpecialActionFlow action={queueItem} />}
        {/* {queueItem.type === "notInGameCharacter" && (
          <>
            <span className="text-lg font-semibold">Not in the game</span>
            <span>{getCharacter(queueItem.role).ability}</span>
          </>
        )} */}
        <CompleteActionButton actionId={queueItem.id} />
      </Accordion.Content>
    </Accordion.Item>
  );
}

interface ActionQueueRowIconProps {
  item: ActionQueueItem;
  children: React.ReactNode;
}
export function ActionQueueRowIcon({
  item,
  children,
}: ActionQueueRowIconProps) {
  switch (item.status) {
    case "done":
      return (
        <CheckIcon
          className="mr-2 h-[2em]"
          style={{ "--tw-rotate": "0" } as Record<string, string>}
        />
      );
    case "skip":
      return children;
    case "notInGame":
      return children;
    case "todo":
      return children;
  }
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
      {ability?.playerMessage ? (
        <Card.Root className="pt-3">
          <Card.Content>
            {ability?.playerMessage && (
              <PlayerMessageFlow
                action={action}
                message={ability.playerMessage}
              />
            )}
          </Card.Content>
        </Card.Root>
      ) : (
        <SubmitMessage player={""} message={[]} />
      )}
      {(ability?.setReminders?.length ?? 0) > 0 && (
        <Card.Root className="pb-2">
          <Card.Header>Reminders</Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-1">
              {ability?.setReminders?.map((reminderName, index) => (
                <ReminderCreator
                  key={`${reminderName}_${index}`}
                  reminder={reminderName}
                  fromPlayer={action.player ?? ""}
                />
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      )}
      {ability?.kills && (
        <Card.Root>
          <Card.Header>Kill a player if applicable</Card.Header>
          <Card.Content>
            <KillAction className="w-full" />
          </Card.Content>
        </Card.Root>
      )}
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
    case "EXECUTION":
      return <ExecutionMessage action={action} />;
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
