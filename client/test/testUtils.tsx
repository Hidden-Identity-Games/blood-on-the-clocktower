import { act, render, RenderOptions } from "@testing-library/react";
import React, { ReactElement, useContext } from "react";

import { GameContext, UnifiedGameContext } from "../src/store/GameContext";

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
  options: Omit<RenderOptions, "wrapper"> & { gameContext: GameContext },
) =>
  render(
    <RenderWithProviders gameContext={options.gameContext}>
      {ui}
    </RenderWithProviders>,
    {
      ...options,
    },
  );

export * from "@testing-library/react";
export { customRender as render };
