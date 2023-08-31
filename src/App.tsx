import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Landing as PlayerLanding } from "./PlayerLanding";
import GamemasterLanding from "./GamemasterInGame/GamemasterLanding";
// import { Landing as GamemasterInGame } from "./GamemasterInGame";
import { NewGameLanding } from "./NewGamePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/:id",
      element: <PlayerLanding />,
    },
    { path: "/gm/:gmid", element: <GamemasterLanding /> },
    {
      path: "/",
      element: <NewGameLanding />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
