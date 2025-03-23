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
import { Callout, Flex, Heading, TextArea } from "@radix-ui/themes";
import classNames from "classnames";
import React, { type ReactNode, useEffect, useMemo } from "react";

import scriptIcon from "../../assets/icon/feather.svg";
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
  const [importFromScriptUrl, setImportFromScriptUrl] = React.useState("");
  const [customScript, setCustomScript] = React.useState("");

  useEffect(() => {
    void (async () => {
      if (
        importFromScriptUrl.match(/https:\/\/botc-scripts\.azurewebsites\.net/i)
      ) {
        try {
          const downloadedScript = await (
            await fetch(`${importFromScriptUrl.trim()}/download`)
          ).json();

          setCustomScript(
            JSON.stringify(
              downloadedScript
                .filter((item: { id: string }) => item.id !== "meta")
                .map((item: { id: string }) => ({
                  id: transformName(item.id),
                })),
              null,
              2,
            ),
          );
        } catch (e) {
          console.error(`could not find script ${importFromScriptUrl}`);
        }
      }
    })();
  }, [importFromScriptUrl]);

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
      <Dialog.Content className="m-2">
        <Dialog.Header>Custom Script Input</Dialog.Header>
        <Flex direction="column" gap="3">
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
          <Input
            placeholder="botc-scripts url"
            value={importFromScriptUrl}
            onChange={(e) => setImportFromScriptUrl(e.target.value)}
          />

          <TextArea
            id="custom-input"
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
          {scriptError && (
            <div className="relative h-0 w-full">
              <Callout.Root className="absolute bottom-0">
                <Callout.Text>{scriptError}</Callout.Text>
              </Callout.Root>
            </div>
          )}
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
        </Flex>
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
