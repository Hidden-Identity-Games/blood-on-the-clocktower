import { type Role } from "@hidden-identity/shared";
import { describe, expect, it } from "vitest";

import { ScriptList } from "../src/shared/ScriptList.tsx";
import { render, screen } from "./testUtils.tsx";

function renderScriptList(scriptIds: string[]) {
  render(<ScriptList />, {
    gameContext: {
      gameId: "test",
      game: {
        script: scriptIds.map((id) => ({ id: id as Role })),
        playersToRoles: {},
      },
    },
  });
}

describe("ScriptList", () => {
  describe("Fabled/Loric display", () => {
    it("does not show Fabled/Loric header when no fabled in script", () => {
      renderScriptList(["washerwoman", "investigator", "imp"]);
      expect(screen.queryByText("Fabled/Loric")).not.toBeInTheDocument();
    });

    it("shows Fabled/Loric header with 1 fabled character", () => {
      renderScriptList(["washerwoman", "imp", "doomsayer"]);
      expect(screen.getByText("Fabled/Loric")).toBeInTheDocument();
      expect(screen.getByText("Doomsayer")).toBeInTheDocument();
    });

    it("shows Fabled/Loric header with mixed fabled and loric", () => {
      renderScriptList(["washerwoman", "imp", "djinn", "tor"]);
      expect(screen.getByText("Fabled/Loric")).toBeInTheDocument();
      expect(screen.getByText("Djinn")).toBeInTheDocument();
      expect(screen.getByText("Tor")).toBeInTheDocument();
    });

    it("shows all fabled characters when multiple present", () => {
      renderScriptList([
        "washerwoman",
        "imp",
        "doomsayer",
        "angel",
        "djinn",
        "tor",
      ]);
      expect(screen.getByText("Fabled/Loric")).toBeInTheDocument();
      expect(screen.getByText("Doomsayer")).toBeInTheDocument();
      expect(screen.getByText("Angel")).toBeInTheDocument();
      expect(screen.getByText("Djinn")).toBeInTheDocument();
      expect(screen.getByText("Tor")).toBeInTheDocument();
    });
  });
});
