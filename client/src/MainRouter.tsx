import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewGameLanding } from "./NewGamePage";
import { Theme } from "@radix-ui/themes";
import { CSSProperties } from "react";
import { GMRoute } from "./GMRoute";
import { SpectatorRoute } from "./SpectatorRoute";
import { PlayerRoute } from "./PlayerRoute";
import { GameHeader } from "./shared/GameHeader";
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
