import { Flex, Heading, Text, TextArea } from "@radix-ui/themes";
import { CharacterName } from "../../../../shared/RoleIcon";

import { alignmentColorMap, colorMap } from "../../../../shared/CharacterTypes";
import type { PlayerMessageEntry } from "@hidden-identity/shared";
import { useDefiniteGame } from "../../../../store/GameContext";

interface PlayerMessageProps {
  messageId: string;
}
export function PlayerMessageDisplay({ messageId }: PlayerMessageProps) {
  const { game } = useDefiniteGame();
  const message = game.messages.find((message) => message.id === messageId);
  if (!message) {
    // TODO: make better
    return <div>Message not found.</div>;
  }
  const messagesByGroup = message.messages.reduce<
    Record<string, PlayerMessageEntry[]>
  >(
    (acc, messageEntry) => ({
      ...acc,
      [messageEntry.group]: [...(acc[messageEntry.group] || []), messageEntry],
    }),
    {},
  );
  return (
    <Flex direction="column" gap="2" className="h-full" p="2">
      {Object.keys(messagesByGroup).map((section) => (
        <Flex direction="column" gap="1" key={section}>
          <Heading className="uppercase">{section}</Heading>
          {messagesByGroup[section].map((revealItem) => (
            <Flex gap="1" key={`${revealItem.character}/${revealItem.player}`}>
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
            </Flex>
          ))}
        </Flex>
      ))}
    </Flex>
  );
}
