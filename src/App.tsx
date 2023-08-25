import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PlayerMap from "./PlayerMap";
import TroubleBrewingScript from "./assets/gameScripts/trouble-brewing.json";
import PlayerLanding from "./PlayerLanding";
import GamemasterLanding from "./GamemasterLanding";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PlayerLanding
          handleFormSubmit={() => {
            //router.navigate("/playerRole");
          }}
        />
      ),
    },
    {
      path: "/secret-gm-toolbox",
      element: (
        <GamemasterLanding
          scriptJson={TroubleBrewingScript}
          handleFormSubmit={() => {
            router.navigate("/players");
          }}
        />
      ),
    },
    {
      path: "/players",
      element: <PlayerMap />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
