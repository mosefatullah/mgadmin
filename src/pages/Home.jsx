import React from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Guest from "./components/Guest";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

/* Utils */
import {
 $firebase_auth_check_admin,
 $firebase_auth_onAuth,
} from "./utils/Firebase";

function Home() {
 /*** FIREBASE ***/
 const [auth, setAuth] = React.useState(null);

 React.useEffect(() => {
  $firebase_auth_onAuth((user) => {
   if (user) {
    $firebase_auth_check_admin((admin) => {
     if (admin) {
      setAuth(true);
     } else {
      setAuth(false);
     }
    });
   } else {
    setAuth(false);
   }
  });
 }, []);

 return (
  <>
   <Navbar auth={auth} />
   {auth == true && <Dashboard auth2={auth} />}
   {auth == false && <Guest auth2={auth} />}
   {auth == null && (
    <Box
     sx={{
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center",
     }}
    >
     <CircularProgress />
    </Box>
   )}
  </>
 );
}

export default Home;
