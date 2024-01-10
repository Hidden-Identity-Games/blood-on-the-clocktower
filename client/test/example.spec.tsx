import { describe, expect, test } from "vitest";

import { useGame } from "../src/store/GameContext.ts";
import { render, screen } from "./testUtils.tsx";

function ExampleComponent(_props: { k: string }) {
  const { gameId } = useGame();
  return <span>{gameId}</span>;
}
describe("An example", () => {
  test("asserts on a component", () => {
    render(<ExampleComponent k="" />, {
      gameContext: { gameId: "xyz", game: null },
    });
    expect(screen.getByText("xyz")).toBeInTheDocument();
  });
});
