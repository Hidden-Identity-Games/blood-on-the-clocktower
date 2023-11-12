import { Flex, Heading, Text, TextArea } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import { CharacterName } from "../shared/RoleIcon";
import {
  PlayerMessageScreenMessage,
  Reveal,
} from "../types/PlayerMessageScreen";
import { alignmentColorMap, colorMap } from "../shared/CharacterTypes";

export function PlayerMessagePage() {
  const [searchParams] = useSearchParams();
  const unparsed = searchParams.get("playerMessage") ?? "";
  const parsedMessage = JSON.parse(unparsed) as PlayerMessageScreenMessage;
  const { message, reveal } = parsedMessage;

  return <PlayerMessage message={message} reveal={reveal} />;
}

interface PlayerMessageProps {
  message: string;
  reveal?: Record<string, Reveal[]>;
  onMessageChange?: (
    newMessage: string,
    newReveal: Record<string, Reveal[]>,
  ) => void;
}
export function PlayerMessage({
  reveal = {},
  message,
  onMessageChange = () => {},
}: PlayerMessageProps) {
  return (
    <Flex direction="column" gap="2" className="h-full" p="2">
      {Object.keys(reveal).map((section) => (
        <Flex direction="column" gap="1" key={section}>
          <Heading className="uppercase">{section}</Heading>
          {reveal![section].map((revealItem) => (
            <Flex gap="1" key={`${revealItem.character}/${revealItem.player}`}>
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
            </Flex>
          ))}
        </Flex>
      ))}
      <TextArea
        value={message}
        className="flex-1 text-6xl"
        style={{
          fontSize: "3rem",
          lineHeight: 1,
        }}
        onChange={(e) => onMessageChange(e.currentTarget.value, reveal)}
      />
    </Flex>
  );
}
