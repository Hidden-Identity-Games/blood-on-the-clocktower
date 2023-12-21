import React from "react";
import ReactDOM from "react-dom/client";
import MainRouter from "./MainRouter";
import "@radix-ui/themes/styles.css";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>,
);
