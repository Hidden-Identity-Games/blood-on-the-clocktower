import {
  Grid,
  Flex,
  Button,
  Heading,
  TextArea,
  Callout,
  Dialog,
  Inset,
  DialogClose,
  Separator,
} from "@radix-ui/themes";
import React from "react";
import { Script, ScriptItem } from "../types/script";
import scriptIcon from "../assets/icon/feather.svg";
import "./ScriptSelect.css";
import {
  getScript,
  getScriptImg,
  getScriptNames,
} from "../assets/game_data/gameData";

interface ScriptSelectProps {
  handleSubmit: (script: ScriptItem[]) => void;
}

export function ScriptSelect({ handleSubmit }: ScriptSelectProps) {
  return (
    <Flex
      gap="1"
      direction={"column"}
      align={"center"}
      style={{ overflowY: "scroll", height: "100%" }}
    >
      <Heading color="tomato">Select a Script</Heading>
      <Separator color="ruby" size="4" />
      <Grid columns="2" align={"center"} gap="4" p="4">
        {getScriptNames().map((name) => (
          <button
            key={name}
            className="script"
            onClick={() => {
              handleSubmit(getScript(name)!);
            }}
          >
            <img className="script-image" src={getScriptImg(name)} />
          </button>
        ))}
        <CustomScriptInputDialog handleSubmit={handleSubmit} />
      </Grid>
    </Flex>
  );
}

interface CustomScriptInputDialogProps {
  handleSubmit: (customScript: Script) => void;
}

function CustomScriptInputDialog({
  handleSubmit,
}: CustomScriptInputDialogProps) {
  const [customScript, setCustomScript] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleCustomScriptImport = (event: React.MouseEvent) => {
    try {
      const parsedCustomScript = ValidateCustomScript(customScript);
      handleSubmit(parsedCustomScript);
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
        <button className="script">
          <div className="image-container">
            <img className="custom-script-image" src={scriptIcon} />
            <Heading mb="1" color="ruby" className="custom-text">
              CUSTOM
            </Heading>
          </div>
        </button>
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

function ValidateCustomScript(script: string): Script {
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
