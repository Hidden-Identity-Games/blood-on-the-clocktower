import { Checkbox, Flex } from "@radix-ui/themes";

function CharacterSelectList({ scriptJson }) {
  return (
    <Flex gap="2" direction="column">
      {scriptJson.characters.map((role) => (
        <Flex gap="2">
          <Checkbox id={role.name} />
          <label htmlFor={role.name}>{role.name}</label>
        </Flex>
      ))}
    </Flex>
  );
}

export default CharacterSelectList;
