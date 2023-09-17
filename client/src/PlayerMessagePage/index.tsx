import { Flex, Heading, Text, TextArea } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import { CharacterName } from "../shared/RoleIcon";
import { PlayerMessageScreenMessage } from "@hidden-identity/server";
import { teamColorMap } from "../shared/CharacterTypes";

export function PlayerMessagePage() {
  const [queryParams] = useSearchParams();
  const unparsed = queryParams.get("playerMessage") ?? "";
  console.log(unparsed);
  const parsedMessage = JSON.parse(unparsed) as PlayerMessageScreenMessage;
  const { message, reveal } = parsedMessage;

  return (
    <Flex direction="column" gap="2" className="h-full" p="2">
      {Object.keys(reveal ?? {}).map((section) => (
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
                  color={teamColorMap[revealItem.team]}
                  className="capitalize"
                >
                  {revealItem.team}
                </Text>
              )}
            </Flex>
          ))}
        </Flex>
      ))}
      <TextArea
        defaultValue={message}
        className="flex-1 text-6xl"
        style={{ fontSize: "3rem", lineHeight: 1 }}
      ></TextArea>
    </Flex>
  );
}
