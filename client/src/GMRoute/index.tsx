import { Route, Routes } from "react-router-dom";
import { GMProtectedRoute } from "./GMProtectedRoute";
import { Button, Flex } from "@radix-ui/themes";
import { useSafeNavigate } from "../store/url";
import { GrimoireView } from "./GrimoireView";
import { ActionView } from "./ActionView";

function SelectView() {
  const navigate = useSafeNavigate();
  return (
    <Flex className="flex-1 justify-around px-[25%]" direction="column">
      <Button onClick={() => navigate("gm/desktop")}>Desktop</Button>
      <Button onClick={() => navigate("gm/mobile")}>Mobile</Button>
    </Flex>
  );
}

export function GMRoute() {
  return (
    <GMProtectedRoute>
      <Routes>
        <Route path="desktop" Component={GrimoireView}></Route>
        <Route path="mobile" Component={ActionView}></Route>
        <Route index Component={SelectView}></Route>
      </Routes>
    </GMProtectedRoute>
  );
}
