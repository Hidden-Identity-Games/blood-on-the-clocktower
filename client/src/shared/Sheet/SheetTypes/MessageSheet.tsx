import { PlayerMessage, groupBy } from "@hidden-identity/shared";
import { Heading, IconButton, Text, TextArea } from "@radix-ui/themes";
import { CharacterName } from "../../RoleIcon";
import { alignmentColorMap, colorMap } from "../../CharacterTypes";
import { useDefiniteGame } from "../../../store/GameContext";
import { SheetBody, SheetContent, SheetHeader } from "../SheetBody";
import { PlayerName } from "../../../GamemasterInGame/PlayerListComponents/PlayerName";
import { CgMail } from "react-icons/cg";
import { useIsHiddenView } from "../../../store/url";
import { LockOpen1Icon } from "@radix-ui/react-icons";

interface MessageSheetPiecesProps {
  message: PlayerMessage;
}

function Header({ message }: MessageSheetPiecesProps) {
  const [hiddenView, setIsHiddenView] = useIsHiddenView();

  return (
    <Heading className="flex h-full items-center justify-between px-2">
      {hiddenView ? (
        <>
          <div className="text-base font-bold">Only unlock if Storyteller</div>
          <IconButton
            variant="surface"
            onClick={() => setIsHiddenView(false)}
            size="1"
          >
            <LockOpen1Icon />
          </IconButton>
        </>
      ) : (
        <>
          <CgMail className="inline-block pr-1" size="1em" />
          <PlayerName player={message.player} />
        </>
      )}
    </Heading>
  );
}
function Body({ message }: MessageSheetPiecesProps) {
  const messagesByGroup = groupBy(message.messages, "group");
  const [hiddenView, setIsHiddenView] = useIsHiddenView();
  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex w-full">
        <Heading className="flex-1 p-1 capitalize">{message.player}</Heading>
        {!hiddenView && (
          <IconButton
            variant="surface"
            onClick={() => setIsHiddenView(true)}
            size="1"
          >
            <LockOpen1Icon />
          </IconButton>
        )}
      </div>

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
