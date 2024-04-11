import { Button } from "@design-system/components/button";
import { Textarea } from "@design-system/components/ui/textarea";
import { groupBy, type PlayerMessage } from "@hidden-identity/shared";
import { Heading, Text } from "@radix-ui/themes";
import { useState } from "react";

import { useDefiniteGame } from "../../../store/GameContext";
import { useIsHiddenView, useSheetView } from "../../../store/url";
import { colorMap, radixAlignmentColorMap } from "../../CharacterTypes";
import { CharacterName } from "../../RoleIcon";
import {
  LockedSheetHeader,
  SheetBody,
  SheetContent,
  SheetHeader,
} from "../SheetBody";
import { Mail } from "lucide-react";

interface MessageSheetPiecesProps {
  message?: PlayerMessage;
}

function Header() {
  const [hiddenView] = useIsHiddenView();

  return hiddenView ? (
    <LockedSheetHeader />
  ) : (
    <div className="flex h-full items-center px-2 text-3xl font-bold">
      <Mail className="inline-block pr-1" size="1em" />
      <div className="flex-1 pl-2 text-left">Messages</div>
    </div>
  );
}
function Body({ message }: MessageSheetPiecesProps) {
  const messagesByGroup = groupBy(message ? message.messages : [], "group");
  const [hiddenView, setIsHiddenView] = useIsHiddenView();
  const [, setSheet] = useSheetView();
  const [plainTextMessage, setPlainTextMessage] = useState("");

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex items-center justify-between">
        <Heading className="capitalize">Message</Heading>{" "}
        {!hiddenView && (
          <Button
            onClick={() => {
              setSheet({ id: "", isOpen: "open", type: "message" });
              setPlainTextMessage("");
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {Object.keys(messagesByGroup).map((section) => (
        <div className="flex flex-col gap-1 px-2" key={section}>
          <h1 className="text-4xl font-bold">{section}:</h1>
          {messagesByGroup[section].map((revealItem, UNSAFE_INDEX_KEY) => (
            <div
              className="columns-3 gap-3 pl-3 *:text-clip *:truncate"
              key={UNSAFE_INDEX_KEY}
            >
              {revealItem.message && (
                <div className="text-xl font-semibold">
                  {revealItem.message}
                </div>
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
                  color={radixAlignmentColorMap[revealItem.alignment]}
                  className="uppercase"
                >
                  {revealItem.alignment}
                </Text>
              )}
            </div>
          ))}
        </div>
      ))}
      <Textarea
        readOnly={hiddenView}
        value={plainTextMessage}
        onChange={(e) => setPlainTextMessage(e.target.value)}
        placeholder={
          hiddenView ? "" : "This text won't be saved to the server."
        }
        className="min-h-[25%] flex-1"
      />
      {!hiddenView && (
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

  const message = game.messages?.find(({ id }) => id === messageId);
  return (
    <SheetBody>
      <SheetContent>
        <Body message={message} />
      </SheetContent>
      <SheetHeader>
        <Header />
      </SheetHeader>
    </SheetBody>
  );
}
