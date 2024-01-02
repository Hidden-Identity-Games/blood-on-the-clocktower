import {
  getScript,
  getScriptImg,
  getScriptNames,
  type ScriptName,
} from "@hidden-identity/shared";
import {
  Button,
  Callout,
  Dialog,
  DialogClose,
  Flex,
  Heading,
  TextArea,
} from "@radix-ui/themes";
import classNames from "classnames";
import React, { type ReactNode } from "react";

import scriptIcon from "../../assets/icon/feather.svg";
import { DialogHeader } from "../../shared/DialogHeader";
import { type Script, type ScriptItem } from "../../types/script";

interface ScriptSelectProps {
  onScriptChange: (script: ScriptItem[]) => void;
}

export const ScriptOption = React.forwardRef(function ScriptOption(
  {
    children,
    onClick,
    name,
    selected,
    bgImageUrl,
  }: {
    children?: ReactNode;
    onClick?: React.MouseEventHandler;
    name: string;
    selected?: boolean;
    bgImageUrl?: string;
  },
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      className={classNames(
        "aspect-square max-h-[25vh] h-[200px] rounded-[10%] border-2 border-purple-800 bg-transparent p-3",
        selected && "border-red-500 outline outline-red-500",
      )}
      onClick={onClick}
      aria-label={name}
      type="button"
      style={{
        ...(bgImageUrl && {
          backgroundImage: `url('${bgImageUrl}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
      }}
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
      <div className="flex flex-wrap items-center justify-center gap-4 gap-y-2 p-4">
        {getScriptNames().map((name) => (
          <ScriptOption
            key={name}
            selected={name === selectedScript}
            onClick={() => {
              handleScriptChange(name, getScript(name));
            }}
            name={name}
            bgImageUrl={getScriptImg(name)}
          >
            {getScriptImg(name) ? null : <Heading>{name}</Heading>}
          </ScriptOption>
        ))}
        <CustomScriptInputDialog
          handleSubmit={(script) => handleScriptChange("custom", script)}
          selected={"custom" === selectedScript}
        />
      </div>
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
        <ScriptOption name="custom" selected={selected} bgImageUrl={scriptIcon}>
          <Heading>CUSTOM</Heading>
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
  return parsedWithoutMeta as Script;
}
