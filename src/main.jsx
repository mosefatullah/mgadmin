import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "@mui/material/styles";
import { MyTheme } from "./pages/utils/Theme";
import { CssBaseline } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
  <ThemeProvider theme={MyTheme}>
   <CssBaseline />
   <App />
  </ThemeProvider>
 </React.StrictMode>
);
