import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PlayerRoot } from "./PlayerLanding";
import { GameMasterRoot } from "./GamemasterInGame/GamemasterLanding";
import { NewGameLanding } from "./NewGamePage";
import { Theme } from "@radix-ui/themes";
import { CSSProperties } from "react";

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
      path: "/",
      element: <NewGameLanding />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default MainRouter;
