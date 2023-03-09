import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./Customutils/UserContext";
import { BrowserRouter, HashRouter } from "react-router-dom";
import Themes from "./Components/Themes";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <CssBaseline />
      <ThemeProvider theme={Themes}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
