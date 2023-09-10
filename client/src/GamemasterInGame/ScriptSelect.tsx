import {
  Grid,
  Flex,
  Button,
  Heading,
  TextArea,
  Callout,
  Dialog,
  DialogClose,
} from "@radix-ui/themes";
import React, { ReactNode } from "react";
import { Script, ScriptItem } from "../types/script";
import scriptIcon from "../assets/icon/feather.svg";
import {
  getScript,
  getScriptImg,
  getScriptNames,
} from "../assets/game_data/gameData";
import { DialogHeader } from "../shared/DialogHeader";

interface ScriptSelectProps {
  handleSubmit: (script: ScriptItem[]) => void;
}

function ScriptOption({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: React.MouseEventHandler;
}) {
  return (
    <button
      className="aspect-square max-h-[25vh] rounded-[10%] border-2 border-red-800 bg-transparent p-3"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export function ScriptSelect({ handleSubmit }: ScriptSelectProps) {
  return (
    <Flex
      gap="1"
      direction={"column"}
      align={"center"}
      className="flex-1 overflow-y-auto"
    >
      <Heading color="tomato">Select a Script</Heading>
      <Grid columns="2" align={"center"} gap="4" p="4">
        {getScriptNames().map((name) => (
          <ScriptOption
            key={name}
            onClick={() => {
              handleSubmit(getScript(name)!);
            }}
          >
            <img className="h-full w-full" src={getScriptImg(name)} />
          </ScriptOption>
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
        <ScriptOption>
          <div className="relative flex h-full w-full items-center justify-center">
            <img className="absolute left-0 top-0" src={scriptIcon} />
            <Heading mb="1" color="ruby" className="relative z-10">
              CUSTOM
            </Heading>
          </div>
        </ScriptOption>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <DialogHeader>Custom Script Input</DialogHeader>

        <TextArea
          id="custom-input"
          className=" h-[50vh] rounded-l"
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
        {errorMsg && (
          <div className="relative h-0 w-full">
            <Callout.Root className="absolute bottom-0">
              <Callout.Text>{errorMsg}</Callout.Text>
            </Callout.Root>
          </div>
        )}
        <Flex justify="between" mt="1">
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button onClick={handleCustomScriptImport}>Use this script</Button>
          </DialogClose>
        </Flex>
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
