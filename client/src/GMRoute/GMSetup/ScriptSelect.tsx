import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import { Input } from "@design-system/components/ui/input";
import {
  asRole,
  getCharacter,
  getScript,
  getScriptImg,
  getScriptNames,
  isFabledRole,
  isTravelerRole,
  type Role,
  type ScriptName,
  transformName,
} from "@hidden-identity/shared";
import { Label } from "@radix-ui/react-label";
import { Flex, Heading, TextArea } from "@radix-ui/themes";
import classNames from "classnames";
import React, { type ReactNode, useEffect, useMemo } from "react";

import scriptIcon from "../../assets/icon/feather.svg";
import { useScriptFromRepo } from "../../store/useStore";
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
  const [invalidMatch, setInvalidMatch] = React.useState(false);
  const [fetchScriptError, fetchScriptLoading, fetchScriptValue, fetchScript] =
    useScriptFromRepo();
  useEffect(() => {
    if (fetchScriptValue && !fetchScriptError) {
      setCustomScript(
        JSON.stringify(
          fetchScriptValue
            .filter((item: { id: string }) => item.id !== "meta")
            .map((item: { id: string }) => ({ id: transformName(item.id) })),
          null,
          4,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchScriptLoading]);

  const scriptError = useMemo(() => {
    try {
      validateCustomScript(customScript);
      return false;
    } catch (e) {
      return String(e);
    }
  }, [customScript]);

  const handleCustomScriptImport = (event: React.MouseEvent) => {
    try {
      const parsedCustomScript = validateCustomScript(customScript);
      handleSubmit(parsedCustomScript);
    } catch (e) {
      event.preventDefault();
      alert(`There was an error: ${String(e)}`);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <ScriptOption name="custom" selected={selected} bgImageUrl={scriptIcon}>
          <Heading>CUSTOM</Heading>
        </ScriptOption>
      </Dialog.Trigger>
      <Dialog.Content className="flex flex-col p-2">
        <Dialog.Header>Custom Script Input</Dialog.Header>
        <Dialog.Description className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label htmlFor="scripturl">Script URL</Label>
            <a
              href="https://botc-scripts.azurewebsites.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 underline"
            >
              Find custom scripts on botc-scripts
            </a>
          </div>
          <Input
            id="scripturl"
            placeholder="botc-scripts url"
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(/https:\/\/botc-scripts\.azurewebsites\.net/i)) {
                setInvalidMatch(false);

                void fetchScript(value);
              } else {
                setInvalidMatch(true);
              }
            }}
          />
          <Label htmlFor="scriptJson">Script JSON</Label>

          <TextArea
            disabled={fetchScriptLoading}
            id="scriptJson"
            className="h-[30vh] rounded-l"
            placeholder="[ { 'id': 'Washerwoman' }, ... ]"
            value={customScript}
            onChange={(event) => {
              setCustomScript(event.currentTarget.value);
            }}
            onPaste={(event) => {
              const data =
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (event.clipboardData || (window as any).clipboardData).getData(
                  "text",
                );
              setCustomScript(JSON.stringify(JSON.parse(data), null, 2));
              event.preventDefault();
            }}
          />
          <div className="">
            {fetchScriptError
              ? "Error fetching Script"
              : fetchScriptLoading
                ? "Loading"
                : customScript.trim() === ""
                  ? invalidMatch
                    ? 'URL must be "https://botc-scripts.azurewebsites.net/script/"'
                    : ""
                  : scriptError
                    ? `${scriptError}`
                    : "Looking good"}
          </div>
        </Dialog.Description>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button
              type="button"
              onClick={handleCustomScriptImport}
              disabled={!!scriptError}
            >
              Use this script
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function validateCustomScript(script: string): Script {
  const parsed: string[] = JSON.parse(script);
  if (!Array.isArray(parsed)) {
    throw new Error("JSON is not an array.");
  }

  const normalized = parsed
    .map((obj) => {
      if (typeof obj === "string") {
        return obj;
      }
      if ("id" in obj) {
        return (obj as { id: string }).id;
      }
      return null;
    })
    .filter(Boolean) as string[];

  const filtered = normalized
    .filter((obj) => !(obj.startsWith("_") || obj === "meta"))
    .filter((obj) => !isFabledRole(obj))
    .filter((obj) => !isTravelerRole(asRole(obj)));

  const badCharacters = filtered.filter((obj) => !getCharacter(obj as Role));

  if (badCharacters.length > 0) {
    throw new Error(
      `"Role element ${JSON.stringify(
        badCharacters[0],
      )} is invalid. Should be a string with id.  Fabled are not yet supported"`,
    );
  }
  return filtered.map((obj) => ({ id: obj })) as Script;
}
