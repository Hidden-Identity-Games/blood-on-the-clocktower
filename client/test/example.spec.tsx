import { describe, expect, test } from "vitest";
import { screen, render } from "./testUtils.tsx";
import { useGame } from "../src/store/GameContext.ts";

function ExampleComponent(_props: { k: string }) {
  const { gameId } = useGame();
  return <span>{gameId}</span>;
}
describe("An example", () => {
  test("asserts on a component", () => {
    render(<ExampleComponent k="" />, {
      gameContext: { gameId: "xyz", game: null, script: null },
    });
    expect(screen.getByText("xyz")).toBeInTheDocument();
  });
});
