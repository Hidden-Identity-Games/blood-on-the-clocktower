import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PlayerRoot } from "./PlayerLanding";
import { GameMasterRoot } from "./GamemasterInGame/GamemasterLanding";
import { NewGameLanding } from "./NewGamePage";
import { PlayerMessagePage } from "./PlayerMessagePage";

function MainRouter() {
  const router = createBrowserRouter([
    {
      path: "/:gameId/note",
      element: <PlayerMessagePage />,
    },
    {
      path: "/:gameId",
      element: <PlayerRoot />,
    },
    {
      path: "/:gameId/gm/:gmHash",
      element: <GameMasterRoot />,
    },
    {
      path: "/",
      element: <NewGameLanding />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default MainRouter;
