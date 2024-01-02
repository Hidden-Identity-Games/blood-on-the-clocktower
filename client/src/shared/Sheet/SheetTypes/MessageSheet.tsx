import { groupBy, type PlayerMessage } from "@hidden-identity/shared";
import { Button, Heading, Text, TextArea } from "@radix-ui/themes";
import { CgMail } from "react-icons/cg";

import { PlayerName } from "../../../GMRoute/GMShared/PlayerListComponents/PlayerName";
import { useDefiniteGame } from "../../../store/GameContext";
import { useIsHiddenView } from "../../../store/url";
import { alignmentColorMap, colorMap } from "../../CharacterTypes";
import { CharacterName } from "../../RoleIcon";
import {
  LockedSheetHeader,
  SheetBody,
  SheetContent,
  SheetHeader,
} from "../SheetBody";

interface MessageSheetPiecesProps {
  message: PlayerMessage;
}

function Header({ message }: MessageSheetPiecesProps) {
  const [hiddenView] = useIsHiddenView();

  return hiddenView ? (
    <LockedSheetHeader />
  ) : (
    <div className="flex h-full grow-0 items-center justify-between px-2 text-3xl font-bold">
      <CgMail className="inline-block pr-1" size="1em" />
      <PlayerName className="flex-1 text-left" player={message.player} />
    </div>
  );
}
function Body({ message }: MessageSheetPiecesProps) {
  const messagesByGroup = groupBy(message.messages, "group");
  const [hiddenView, setIsHiddenView] = useIsHiddenView();

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <Heading className="capitalize">{message.player}</Heading>

      {Object.keys(messagesByGroup).map((section) => (
        <div className="flex flex-col gap-1 px-2" key={section}>
          <Text>{section}:</Text>
          {messagesByGroup[section].map((revealItem, UNSAFE_INDEX_KEY) => (
            <div className="flex gap-1 px-1" key={UNSAFE_INDEX_KEY}>
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
      {!hiddenView && message.showState === "needs to be shown" && (
        <Button onClick={() => setIsHiddenView(true)}>Show to player</Button>
      )}
    </div>
  );
}

export interface MessageSheetProps {
  messageId: string;
}

export function MessageSheet({ messageId }: MessageSheetProps) {
  const { game } = useDefiniteGame();

  const message = game.messages.find(({ id }) => id === messageId);
  if (!message) {
    console.error(`message not found not found ${messageId}`);
    return null;
  }
  return (
    <SheetBody>
      <SheetContent>
        <Body message={message} />
      </SheetContent>
      <SheetHeader>
        <Header message={message} />
      </SheetHeader>
    </SheetBody>
  );
}
