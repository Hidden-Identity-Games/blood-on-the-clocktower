import { PlayerMessage, groupBy } from "@hidden-identity/shared";
import { Heading, Text, TextArea } from "@radix-ui/themes";
import { CharacterName } from "../../RoleIcon";
import { alignmentColorMap, colorMap } from "../../CharacterTypes";
import { useDefiniteGame } from "../../../store/GameContext";
import { SheetBody } from "../SheetBody";
import classNames from "classnames";
import { GlobalSheetContext } from "../SheetContext";
import { useContext } from "react";

interface MessageSheetPiecesProps {
  message: PlayerMessage;
}

function Header({ message }: MessageSheetPiecesProps) {
  return <Heading>Message for {message.player}</Heading>;
}
function Body({ message }: MessageSheetPiecesProps) {
  const messagesByGroup = groupBy(message.messages, "group");
  return (
    <div className="flex h-full flex-col gap-2 p-2">
      {Object.keys(messagesByGroup).map((section) => (
        <div className="flex flex-col gap-1" key={section}>
          <Heading className="uppercase">{section}</Heading>
          {messagesByGroup[section].map((revealItem) => (
            <div
              className="flex gap-1"
              key={`${revealItem.character}/${revealItem.player}`}
            >
              {revealItem.message && (
                <TextArea
                  // TODO: support changing the message
                  readOnly
                  value={revealItem.message}
                  className="flex-1 text-6xl"
                  style={{
                    fontSize: "3rem",
                    lineHeight: 1,
                  }}
                />
              )}
              {revealItem.character && (
                <CharacterName role={revealItem.character} />
              )}
              {revealItem.player && (
                <div className="capitalize">{revealItem.player}</div>
              )}
              {revealItem.team && (
                <Text
                  as="div"
                  color={colorMap[revealItem.team]}
                  className="capitalize"
                >
                  {revealItem.team}
                </Text>
              )}
              {revealItem.alignment && (
                <Text
                  size="8"
                  as="div"
                  color={alignmentColorMap[revealItem.alignment]}
                  className="uppercase"
                >
                  {revealItem.alignment}
                </Text>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export interface MessageSheetProps {
  messageId: string;
}

export function MessageSheet({ messageId }: MessageSheetProps) {
  const { game } = useDefiniteGame();
  const { sheetExpanded } = useContext(GlobalSheetContext);

  const message = game.messages.find(({ id }) => id === messageId);
  if (!message) {
    console.error(`message not found not found ${messageId}`);
    return null;
  }
  return (
    <SheetBody>
      <Header message={message} />
      <div
        className={classNames(
          "pointer-events-auto w-full flex-1 overflow-y-auto bg-[--color-background] px-2",
          // eslint-disable-next-line prettier/prettier
          { "hidden": !sheetExpanded },
        )}
      >
        <Body message={message} />
      </div>
    </SheetBody>
  );
}
