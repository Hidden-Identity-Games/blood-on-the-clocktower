import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PlayerLanding from "./PlayerLanding";
import GamemasterLanding from "./GamemasterLanding";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PlayerLanding />,
    },
    {
      path: "/secret-gm-toolbox",
      element: <GamemasterLanding />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
