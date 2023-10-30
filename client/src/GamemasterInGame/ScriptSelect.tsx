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
  ScriptName,
  getScript,
  getScriptImg,
  getScriptNames,
} from "@hidden-identity/shared";
import { DialogHeader } from "../shared/DialogHeader";
import classNames from "classnames";

interface ScriptSelectProps {
  onScriptChange: (script: ScriptItem[]) => void;
}

export const ScriptOption = React.forwardRef(function ScriptOption(
  {
    children,
    onClick,
    name,
    selected,
  }: {
    children: ReactNode;
    onClick?: React.MouseEventHandler;
    name: string;
    selected?: boolean;
  },
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      className={classNames(
        "aspect-square max-h-[25vh] rounded-[10%] border-2 border-purple-800 bg-transparent p-3",
        selected && "border-red-500 outline outline-red-500",
      )}
      onClick={onClick}
      aria-label={name}
      type="button"
    >
      {children}
    </button>
  );
});
export function ScriptSelect({ onScriptChange }: ScriptSelectProps) {
  const [selectedScript, setSelectedScript] = React.useState<
    ScriptName | "custom"
  >("Trouble Brewing");
  const handleScriptChange = (
    scriptName: ScriptName | "custom",
    script: Script,
  ) => {
    onScriptChange(script);
    setSelectedScript(scriptName);
  };
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
            selected={name === selectedScript}
            onClick={() => {
              handleScriptChange(name, getScript(name));
            }}
            name={name}
          >
            <img className="h-full w-full" src={getScriptImg(name)} />
          </ScriptOption>
        ))}
        <CustomScriptInputDialog
          handleSubmit={(script) => handleScriptChange("custom", script)}
          selected={"custom" === selectedScript}
        />
      </Grid>
    </Flex>
  );
}

interface CustomScriptInputDialogProps {
  handleSubmit: (customScript: Script) => void;
  selected?: boolean;
}

function CustomScriptInputDialog({
  handleSubmit,
  selected,
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
        <ScriptOption name="custom" selected={selected}>
          <div
            className={
              "relative flex h-full w-full items-center justify-center"
            }
          >
            <img className="absolute left-0 top-0" src={scriptIcon} />
            <Heading mb="1" color="ruby" className="relative z-10">
              CUSTOM
            </Heading>
          </div>
        </ScriptOption>
      </Dialog.Trigger>
      <Dialog.Content className="m-2">
        <Flex direction="column" gap="3">
          <DialogHeader>Custom Script Input</DialogHeader>
          <Dialog.Description>
            <a
              href="https://bloodontheclocktower.com/custom-scripts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 underline"
            >
              Find custom scripts on the official Blood on the Clocktower
              website
            </a>
          </Dialog.Description>

          <TextArea
            id="custom-input"
            className="h-[30vh] rounded-l"
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
              <Button onClick={handleCustomScriptImport}>
                Use this script
              </Button>
            </DialogClose>
          </Flex>
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
  const parsedWithoutMeta = parsed.filter((char) => char.id[0] !== "_");
  return parsedWithoutMeta;
}
