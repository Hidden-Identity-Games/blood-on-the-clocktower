import CharacterSelectList from "./CharacterSelectList";
import TroubleBrewingScript from "./assets/trouble-brewing.json";

function App() {
  return (
    <>
      <CharacterSelectList
        scriptJson={TroubleBrewingScript}
        handleFormSubmit={console.log}
      />
    </>
  );
}

export default App;
