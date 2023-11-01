import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PlayerRoot } from "./PlayerLanding";
import { GameMasterRoot } from "./GamemasterInGame/GamemasterLanding";
import { NewGameLanding } from "./NewGamePage";
import { Theme } from "@radix-ui/themes";
import { CSSProperties } from "react";
import { DesktopView } from "./GamemasterDesktop/DesktopView";

function MainRouter() {
  const router = createBrowserRouter([
    {
      path: "/:gameId",
      element: <PlayerRoot />,
    },
    {
      path: "/:gameId/gm/:gmHash",
      element: (
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
          <GameMasterRoot />
        </Theme>
      ),
    },
    {
      path: "/:gameId/gm/:gmHash/desktop",
      element: (
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
          <DesktopView />
        </Theme>
      ),
    },
    {
      path: "/",
      element: <NewGameLanding />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default MainRouter;
