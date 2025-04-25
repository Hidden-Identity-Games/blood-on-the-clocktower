import { Route, Routes } from "react-router-dom";

import { GMProtectedRoute } from "../GMRoute/GMProtectedRoute";
import { Lobby } from "../GMRoute/GMSetup/Lobby";
import { GMGrimoire } from "../shared/Grimoire/GrimoireView";
import { LoadingExperience } from "../shared/LoadingExperience";
import { ControlledSheet } from "../shared/Sheet";
import { useGame } from "../store/GameContext";
import { GMNoGrimInGame } from "./GMNoGrimInGame";

function SideBar() {
  const { game } = useGame();

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return (
    <div className="relative flex h-full w-full">
      {game.gameStatus === "PlayersJoining" ? <Lobby /> : <GMNoGrimInGame />}
      <ControlledSheet />
    </div>
  );
}

function GMGrimoireView() {
  return (
    <div className=" relative flex min-h-0 flex-1 justify-between gap-4 overflow-hidden">
      <div className="hidden flex-1 lg:flex">
        <GMGrimoire />
      </div>
      <div className="flex h-full w-full min-w-[350px] shrink grow overflow-hidden empty:hidden md:grow-0 lg:w-1/4">
        <SideBar />
      </div>
    </div>
  );
}

export function GMNoGrim() {
  return (
    <GMProtectedRoute>
      <Routes>
        <Route index Component={GMGrimoireView}></Route>
      </Routes>
    </GMProtectedRoute>
  );
}
