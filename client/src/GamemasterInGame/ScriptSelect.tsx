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
  const [selectedScript, setSelectedScript] = React.useState("");
  const [customScript, setCustomScript] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  return (
    <Flex gap="4" direction={"column"} align={"center"}>
      <Grid gap="3" columns="1" align={"center"}>
        {GameData.scripts.map(({ name, imageSrc }) => (
          <Box
            key={name}
            className={name === selectedScript ? "border" : undefined}
            onClick={() => {
              setSelectedScript(name);
            }}
          >
            <img width="300px" src={imageSrc} />
          </Box>
        ))}
        {enableCustom && (
          <Box
            key="custom-script"
            className={
              "custom-script" === selectedScript ? "border" : undefined
            }
            onClick={() => {
              setSelectedScript("custom-script");
            }}
          >
            <label htmlFor="custom-input">
              <Heading as="h1">CUSTOM</Heading>
            </label>
            {"custom-script" === selectedScript && (
              <TextArea
                id="custom-input"
                placeholder="[ { 'id': 'Washerwoman' }, ... ]"
                value={customScript}
                onChange={(event) => {
                  setCustomScript(event.currentTarget.value);
                }}
              ></TextArea>
            )}
          </Box>
        )}
      </Grid>
      {errorMsg && (
        <Callout.Root>
          <Callout.Text>{errorMsg}</Callout.Text>
        </Callout.Root>
      )}
      <Button
        onClick={(event) => {
          event.preventDefault();
          if (selectedScript === "custom-script") {
            try {
              const parsedCustomScript = ValidateCustomScript(customScript);
              handleSubmit(selectedScript, parsedCustomScript);
              setErrorMsg("");
            } catch (e) {
              const error = e as Error;
              setErrorMsg(error.message);
            }
          } else {
            handleSubmit(selectedScript);
          }
        }}
        onPaste={(event) =>
          JSON.stringify(JSON.parse(event.currentTarget.value), null, 4)
        }
        disabled={!selectedScript}
      >
        Select Script
      </Button>
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
