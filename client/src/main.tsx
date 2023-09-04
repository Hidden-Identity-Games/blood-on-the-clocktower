import React, { CSSProperties } from "react";
import ReactDOM from "react-dom/client";
import MainRouter from "./MainRouter.tsx";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme
      appearance="dark"
      accentColor="red"
      panelBackground="solid"
      hasBackground
      style={{ "--scaling": 2 } as CSSProperties}
    >
      <MainRouter />
    </Theme>
  </React.StrictMode>,
);
