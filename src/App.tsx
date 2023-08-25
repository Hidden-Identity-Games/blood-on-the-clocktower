import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CharacterSelectList from "./CharacterSelectList";
import PlayerMap from "./PlayerMap";
import TroubleBrewingScript from "./assets/trouble-brewing.json";
import PlayerLanding from "./PlayerLanding";

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
        <CharacterSelectList
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
