import { Route, Routes } from "react-router-dom";
import { GMProtectedRoute } from "./GMProtectedRoute";
import { ControlledSheet } from "../shared/Sheet";
import { Lobby } from "./GMSetup/Lobby";
import { NightOrder } from "./GMInGame/NightOrder";
import { LoadingExperience } from "../shared/LoadingExperience";
import { useGame } from "../store/GameContext";
import { Grimoire } from "../shared/Grimoire/GrimoireView";

function SideBar() {
  const { game } = useGame();

  if (!game) {
    return <LoadingExperience>Loading</LoadingExperience>;
  }

  return (
    <div className="relative flex h-full w-full">
      {game.gameStatus === "PlayersJoining" ? <Lobby /> : <NightOrder />}
      <ControlledSheet />
    </div>
  );
}

function GMGrimoireView() {
  return (
    <div className=" relative flex min-h-0 flex-1 justify-between gap-4 overflow-hidden">
      <div className="hidden flex-1 lg:flex">
        <Grimoire isPlayerView={false} />
      </div>
      <div className="flex h-full w-full min-w-[400px] shrink grow overflow-hidden empty:hidden md:grow-0 lg:w-1/4">
        <SideBar />
      </div>
    </div>
  );
}

export function GMRoute() {
  return (
    <GMProtectedRoute>
      <Routes>
        <Route index Component={GMGrimoireView}></Route>
      </Routes>
    </GMProtectedRoute>
  );
}
