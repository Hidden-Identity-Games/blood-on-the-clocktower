import {
  Box,
  Grid,
  Flex,
  Button,
  Heading,
  TextArea,
  Callout,
} from "@radix-ui/themes";
import GameData from "../assets/game_data/scripts.json";
import React from "react";
import { CharacterId } from "../types/script";
import "./ScriptSelect.css";

interface ScriptSelectProps {
  handleSubmit: (script: string, customScript?: CharacterId[]) => void;
  enableCustom?: boolean;
}

function ScriptSelect({
  handleSubmit,
  enableCustom = true,
}: ScriptSelectProps) {
  const [customScript, setCustomScript] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleCustomScriptClick = () => {
    try {
      const parsedCustomScript = ValidateCustomScript(customScript);
      handleSubmit("custom-script", parsedCustomScript);
      setErrorMsg("");
    } catch (e) {
      const error = e as Error;
      setErrorMsg(error.message);
    }
  };

  return (
    <Flex gap="4" direction={"column"} align={"center"}>
      <Grid gap="3" columns="1" align={"center"}>
        {GameData.scripts.map(({ name, imageSrc }) => (
          <Box
            key={name}
            className="border"
            onClick={() => {
              handleSubmit(name);
            }}
          >
            <img width="300px" src={imageSrc} />
          </Box>
        ))}
        {enableCustom && (
          <Box key="custom-script" className="border">
            <label htmlFor="custom-input">
              <Heading as="h1">CUSTOM</Heading>
            </label>
            <TextArea
              id="custom-input"
              placeholder="[ { 'id': 'Washerwoman' }, ... ]"
              value={customScript}
              onChange={(event) => {
                setCustomScript(event.currentTarget.value);
              }}
              onPaste={(event) => {
                setCustomScript(
                  JSON.stringify(
                    JSON.parse(event.currentTarget.value),
                    null,
                    4,
                  ),
                );
              }}
            />
            <Button onClick={handleCustomScriptClick}>Use Custom Script</Button>
          </Box>
        )}
      </Grid>
      {errorMsg && (
        <Callout.Root>
          <Callout.Text>{errorMsg}</Callout.Text>
        </Callout.Root>
      )}
    </Flex>
  );
}

function ValidateCustomScript(script: string) {
  const parsed = JSON.parse(script);
  if (!Array.isArray(parsed)) {
    throw new Error("JSON is not an array.");
  }
  const badCharacters = parsed.filter((obj) => !obj["id"]);
  if (badCharacters.length > 0) {
    throw new Error(
      `"Role element ${JSON.stringify(
        badCharacters[0],
      )} is invalid.  Should match { 'id': '<role_name>' }"`,
    );
  }
  return parsed;
}

export { ScriptSelect };
