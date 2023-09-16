import { Flex, Heading, TextArea } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import { CharacterName } from "../shared/RoleIcon";
import { NotesScreenNote } from "@hidden-identity/server";

export function PlayerNotePage() {
  const [queryParams] = useSearchParams();
  const unparsed = queryParams.get("playerMessage") ?? "";
  console.log(unparsed);
  const parsedMessage = JSON.parse(unparsed) as NotesScreenNote;
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
