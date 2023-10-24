import { createTheme } from "@mui/material/styles";

export const MyTheme = createTheme({
 palette: {
  mode: "light",
  primary: {
   main: "#0099C0",
  },
  secondary: {
   main: "#ffffff",
  },
  background: {
   paper: "#ffffff",
   default: "#f5f5f5",
  },
 },
 typography: {
  fontFamily: [
   "Roboto",
   "-apple-system",
   "BlinkMacSystemFont",
   '"Segoe UI"',
   '"Helvetica Neue"',
   "Arial",
   "sans-serif",
   '"Apple Color Emoji"',
   '"Segoe UI Emoji"',
   '"Segoe UI Symbol"',
  ].join(","),
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 500,
 },
});
