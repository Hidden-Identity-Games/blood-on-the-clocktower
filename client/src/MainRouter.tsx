import { Theme } from "@radix-ui/themes";
import { CSSProperties } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { GMRoute } from "./GMRoute";
import { NewGameLanding } from "./NewGamePage";
import { PlayerRoute } from "./PlayerRoute";
import { GameHeader } from "./shared/GameHeader";
import { SpectatorRoute } from "./SpectatorRoute";
import { GameProvider } from "./store/GameContextProvider";

function MainRouter() {
  return (
    <Theme
      appearance="dark"
      accentColor="purple"
      panelBackground="solid"
      hasBackground
      style={
        {
          "--scaling": 1.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        } as CSSProperties
      }
    >
      <BrowserRouter>
        <GameProvider>
          <GameHeader />
          <Routes>
            <Route path="/gm/*" Component={GMRoute} />
            <Route path="/spectator/*" Component={SpectatorRoute} />
            <Route path="/game/*" Component={PlayerRoute} />
            <Route path="/" Component={NewGameLanding} />
          </Routes>
        </GameProvider>
      </BrowserRouter>
    </Theme>
  );
}

export default MainRouter;
