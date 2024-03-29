import { type UnifiedGame } from "@hidden-identity/shared";
import { act, render, type RenderOptions } from "@testing-library/react";
import React, { type ReactElement, useContext } from "react";

import { type GameContext, UnifiedGameContext } from "../src/store/GameContext";

const RenderWithProviders = ({
  children,
  gameContext,
}: {
  children: React.ReactNode;
  gameContext: GameContext;
}) => {
  return (
    <UnifiedGameContext.Provider value={gameContext}>
      {children}
    </UnifiedGameContext.Provider>
  );
};

export function useSetGameContextForTest() {
  const { setContextValue } = useContext(UnifiedGameContext) as unknown as {
    setContextValue: (gameContext: GameContext) => void;
  };
  return (gameContext: GameContext) => {
    act(() => setContextValue(gameContext));
  };
}

const customRender = (
  ui: ReactElement,
  options: Omit<RenderOptions, "wrapper"> & {
    gameContext: Omit<GameContext, "game"> & {
      game: Partial<UnifiedGame> | null;
    };
  },
) =>
  render(
    <RenderWithProviders gameContext={options.gameContext as GameContext}>
      {ui}
    </RenderWithProviders>,
    {
      ...options,
    },
  );

export * from "@testing-library/react";
export { customRender as render };
