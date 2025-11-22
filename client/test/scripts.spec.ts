import {
  ALL_ROLES_SCRIPT,
  FABLED,
  getCharacter,
  type Role,
  type ScriptDefinitionLike,
  SCRIPTS,
  UNASSIGNED,
} from "@hidden-identity/shared";
import { describe, expect, test } from "vitest";

describe("scripts", () => {
  describe("characters", () => {
    describe.each([...SCRIPTS, ALL_ROLES_SCRIPT])(
      "character: $name",
      (script: ScriptDefinitionLike<string>) => {
        test("all characters are valid", () => {
          const fabledIds = new Set(FABLED.map((f) => f.id));
          const missing = script.characters.filter(({ id }) => {
            const character = getCharacter(id as Role);
            if (fabledIds.has(id)) {
              return false;
            }
            if (!character || character.name === UNASSIGNED.name) {
              return true;
            }

            return false;
          });
          expect(missing).toHaveLength(0);
        });
      },
    );
  });
});
