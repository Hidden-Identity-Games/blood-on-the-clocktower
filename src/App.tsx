import { useState } from "react";
import CharacterSelectList from "./CharacterSelectList";
import TroubleBrewingScript from "./assets/trouble-brewing.json";

function App() {
  return (
    <>
      <CharacterSelectList scriptJson={TroubleBrewingScript} />
    </>
  );
}

export default App;
