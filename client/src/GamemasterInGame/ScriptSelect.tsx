import {
  Box,
  Grid,
  Flex,
  Button,
  Heading,
  TextArea,
  Callout,
  Dialog,
  Inset,
  DialogClose,
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
  return (
    <Flex
      direction={"column"}
      align={"center"}
      style={{ overflowY: "scroll", height: "100%" }}
    >
      <Grid columns="2" align={"center"}>
        {GameData.scripts.map(({ name, imageSrc }) => (
          <Box
            key={name}
            className="border"
            onClick={() => {
              handleSubmit(name);
            }}
          >
            <img className="scriptImage" src={imageSrc} />
          </Box>
        ))}
        {enableCustom && (
          <CustomScriptInputDialog handleSubmit={handleSubmit} />
        )}
      </Grid>
    </Flex>
  );
}

interface CustomScriptInputDialogProps {
  handleSubmit: (script: string, customScript?: CharacterId[]) => void;
}

function CustomScriptInputDialog({
  handleSubmit,
}: CustomScriptInputDialogProps) {
  const [customScript, setCustomScript] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleCustomScriptImport = (event: React.MouseEvent) => {
    try {
      const parsedCustomScript = ValidateCustomScript(customScript);
      handleSubmit("custom-script", parsedCustomScript);
      setErrorMsg("");
    } catch (e) {
      event.preventDefault();
      const error = e as Error;
      setErrorMsg(error.message);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Box className="border">
          <Heading as="h1">CUSTOM</Heading>
        </Box>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title align={"center"}>
          <label htmlFor="custom-input">Custom Script Input</label>
        </Dialog.Title>
        <Inset m="5">
          {errorMsg && (
            <Callout.Root>
              <Callout.Text>{errorMsg}</Callout.Text>
            </Callout.Root>
          )}
          <TextArea
            id="custom-input"
            placeholder="[ { 'id': 'Washerwoman' }, ... ]"
            value={customScript}
            onChange={(event) => {
              setCustomScript(event.currentTarget.value);
            }}
            onPaste={(event) => {
              setCustomScript(
                JSON.stringify(JSON.parse(event.currentTarget.value), null, 2),
              );
            }}
          />
          <Flex justify="center">
            <DialogClose>
              <Button onClick={handleCustomScriptImport}>
                Use This Script
              </Button>
            </DialogClose>
          </Flex>
        </Inset>
      </Dialog.Content>
    </Dialog.Root>
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
