import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PlayerRoot } from "./PlayerLanding";
import { GameMasterRoot } from "./GamemasterInGame/GamemasterLanding";
// import { Landing as GamemasterInGame } from "./GamemasterInGame";
import { NewGameLanding } from "./NewGamePage";
import { PlayerNotePage } from "./PlayerNotePage";

function MainRouter() {
  const router = createBrowserRouter([
    {
      path: "/:gameId/note",
      element: <PlayerNotePage />,
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
