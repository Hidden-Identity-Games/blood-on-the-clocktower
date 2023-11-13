import { Route, Routes } from "react-router-dom";
import { GMProtectedRoute } from "./GMProtectedRoute";
import { GrimoireView } from "./GrimoireView";

export function GMRoute() {
  return (
    <GMProtectedRoute>
      <Routes>
        <Route index Component={GrimoireView}></Route>
      </Routes>
    </GMProtectedRoute>
  );
}
