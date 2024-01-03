import {
  getCharacter,
  type Role,
  SCRIPTS,
  UNASSIGNED,
} from "@hidden-identity/shared";
import { describe, expect, test } from "vitest";

describe("scripts", () => {
  describe("characters", () => {
    describe.each(SCRIPTS)("character: $name", (script) => {
      test("all characters are valid", () => {
        const characters = script.characters.map(({ id }) =>
          getCharacter(id as Role),
        );

        expect(
          characters.filter((character) => character.name === UNASSIGNED.name),
        ).toHaveLength(0);
      });
    });
  });
});
