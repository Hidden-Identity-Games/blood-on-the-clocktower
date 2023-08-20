import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CharacterSelectList from "./CharacterSelectList";
import PlayerMap from "./PlayerMap";
import TroubleBrewingScript from "./assets/trouble-brewing.json";
import PlayerLanding from "./PlayerLanding";
import PlayerRole from "./PlayerRole";
import { useNavigate } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
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
    {
      path: "/playerLanding",
      element: (
        <PlayerLanding
          handleFormSubmit={() => {
            router.navigate("/playerRole");
          }}
        />
      ),
    },
    {
      path: "/playerRole",
      element: <PlayerRole />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
