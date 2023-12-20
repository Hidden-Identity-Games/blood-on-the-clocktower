import React, { CSSProperties } from "react";
import ReactDOM from "react-dom/client";
import MainRouter from "./MainRouter";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./main.css";
import { GlobalSheetProvider } from "./shared/Sheet";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalSheetProvider>
      <Theme
        appearance="dark"
        accentColor="red"
        panelBackground="solid"
        hasBackground
        style={
          {
            "--scaling": 1.5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          } as CSSProperties
        }
      >
        <MainRouter />
      </Theme>
    </GlobalSheetProvider>
  </React.StrictMode>,
);
