import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import logo from "./../../assets/logo.jpg";

/* Components */
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Avater from "@mui/material/Avatar";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Modal from "./Modal";

/* Icons */
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Home from "@mui/icons-material/Home";
import PostAdd from "@mui/icons-material/PostAdd";

/* Utils */
import {
 $firebase_auth,
 $firebase_auth_logout,
 $firebase_auth_onAuth,
} from "../utils/Firebase";
import { Link } from "react-router-dom";

export default function Navbar({ auth }) {
 const [openAlert, setOpenAlert] = React.useState(false);
 const [alertMessage, setAlertMessage] = React.useState("");
 const drawerTopLinks = ["/mgadmin/", "/mgadmin/posts"];
 const drawerTopItems = ["Home", "Posts"];
 /*** FIREBASE ***/
 const [profilePicture, setProfilePicture] = React.useState(null);
 const [profileName, setProfileName] = React.useState("Anonymous");
 const [profileEmail, setProfileEmail] = React.useState(
  "Unknown error occured!"
 );

 React.useEffect(() => {
  $firebase_auth_onAuth((user) => {
   if (user) {
    let n = $firebase_auth.currentUser.displayName,
     e = $firebase_auth.currentUser.email;
    if (n) setProfileName(n);
    if (e) setProfileEmail(e);
   }
   if (auth || user) {
    setProfilePicture($firebase_auth.currentUser.photoURL);
   } else if (!user) {
    setProfilePicture(null);
   }
  });
 }, []);

 /*** MATERIAL UI ***/
 const [anchorEl, setAnchorEl] = React.useState(null);
 const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
 const [state, setState] = React.useState({
  left: false,
 });

 const isMenuOpen = Boolean(anchorEl);
 const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

 const handleProfileMenuOpen = (event) => {
  setAnchorEl(event.currentTarget);
 };

 const handleMobileMenuClose = () => {
  setMobileMoreAnchorEl(null);
 };

 const handleMenuClose = () => {
  setAnchorEl(null);
  handleMobileMenuClose();
 };

 const handleMobileMenuOpen = (event) => {
  setMobileMoreAnchorEl(event.currentTarget);
 };

 const toggleDrawer = (open) => (event) => {
  if (
   event.type === "keydown" &&
   (event.key === "Tab" || event.key === "Shift")
  ) {
   return;
  }
  setState({ left: open });
 };

 const profileMenu = (
  <>
   <>
    <MenuItem onClick={handleMenuClose}>
     {!profilePicture ? (
      <IconButton
       size="small"
       aria-label="profile"
       aria-controls="primary-search-account-menu"
       aria-haspopup="true"
       color="inherit"
      >
       <AccountCircle />
      </IconButton>
     ) : (
      <Avater
       src={profilePicture}
       style={{
        width: "30px",
        height: "30px",
        marginRight: "10px",
       }}
      />
     )}
     <p>Profile</p>
    </MenuItem>
    <MenuItem onClick={handleMenuClose}>
     <IconButton
      size="small"
      aria-label="settings"
      aria-controls="primary-search-account-menu"
      aria-haspopup="true"
      color="inherit"
     >
      <SettingsIcon />
     </IconButton>
     <p>Settings</p>
    </MenuItem>
    <MenuItem
     onClick={() => {
      handleMenuClose(), $firebase_auth_logout();
     }}
    >
     <IconButton
      size="small"
      aria-label="logout"
      aria-controls="primary-search-account-menu"
      aria-haspopup="true"
      color="inherit"
     >
      <LogoutIcon />
     </IconButton>
     <p>Logout</p>
    </MenuItem>
   </>
  </>
 );

 const menuId = "primary-search-account-menu";
 const renderMenu = (
  <Menu
   anchorEl={anchorEl}
   anchorOrigin={{
    vertical: "top",
    horizontal: "right",
   }}
   id={menuId}
   keepMounted
   transformOrigin={{
    vertical: "top",
    horizontal: "right",
   }}
   open={isMenuOpen}
   onClose={handleMenuClose}
  >
   {profileMenu}
  </Menu>
 );

 const mobileMenuId = "primary-search-account-menu-mobile";
 const renderMobileMenu = (
  <Menu
   anchorEl={mobileMoreAnchorEl}
   anchorOrigin={{
    vertical: "top",
    horizontal: "right",
   }}
   id={mobileMenuId}
   keepMounted
   transformOrigin={{
    vertical: "top",
    horizontal: "right",
   }}
   open={isMobileMenuOpen}
   onClose={handleMobileMenuClose}
  >
   <MenuItem sx={{ display: "block" }}>
    <Typography variant="p" noWrap component="div">
     {profileName}
    </Typography>
    <Typography variant="p" noWrap component="div">
     {profileEmail}
    </Typography>
   </MenuItem>
   <Divider />
   {profileMenu}
  </Menu>
 );

 return (
  <>
   <Box
    sx={{
     flexGrow: 1,
     position: "sticky",
     zIndex: (theme) => theme.zIndex.drawer - 1,
     top: 0,
     left: 0,
    }}
   >
    <AppBar position="static">
     <Toolbar>
      <IconButton
       size="large"
       edge="start"
       color="inherit"
       aria-label="drawer"
       onClick={toggleDrawer(true)}
       sx={{ mr: 2, display: $firebase_auth.currentUser ? "flex" : "none" }}
      >
       <Tooltip title="Menu">
        <MenuIcon />
       </Tooltip>
      </IconButton>
      <Link
       to="/"
       style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
       }}
      >
       <img
        src={logo}
        alt="logo"
        style={{ width: "30px", marginRight: "0.7rem", borderRadius: "100rem" }}
       />
       <Typography variant="h6" component="div" sx={{ mr: 2 }}>
        Admin
       </Typography>
      </Link>
      <Box sx={{ flexGrow: 1 }} />
      {auth == true && (
       <>
        <Box>
         <Button
          size="small"
          aria-label="profile"
          color="inherit"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={handleMobileMenuOpen}
         >
          <Tooltip title={profileName || "Profile"}>
           <Avater
            src={profilePicture}
            style={{
             width: "30px",
             height: "30px",
            }}
           />
          </Tooltip>
         </Button>
         <Button
          size="small"
          aria-label="profile"
          color="inherit"
          sx={{ display: { xs: "none", md: "flex" } }}
          onClick={handleProfileMenuOpen}
         >
          <Tooltip title="Profile Menu">
           <Avater
            src={profilePicture}
            style={{
             width: "30px",
             height: "30px",
            }}
           />
          </Tooltip>
         </Button>
        </Box>
       </>
      )}
      {auth == true && (
       <>
        <MenuItem
         onClick={handleMenuClose}
         sx={{ padding: 0, display: { md: "block", xs: "none" } }}
        >
         <Typography variant="p" noWrap component="div">
          {profileName}
         </Typography>
        </MenuItem>
       </>
      )}
     </Toolbar>
    </AppBar>
    {renderMobileMenu}
    {renderMenu}
   </Box>
   <Drawer anchor="left" open={state["left"]} onClose={toggleDrawer(false)}>
    <Box
     sx={{ width: 250 }}
     role="presentation"
     onClick={toggleDrawer(false)}
     onKeyDown={toggleDrawer(false)}
    >
     <List>
      {drawerTopItems.map((text, index) => (
       <Link role="button" to={drawerTopLinks[index].replace("/mgadmin", "")}>
        <ListItem
         key={text}
         disablePadding
         sx={{
          backgroundColor:
           window.location.pathname === drawerTopLinks[index]
            ? "rgba(0,0,0,0.1)"
            : undefined,
         }}
        >
         <ListItemButton>
          <ListItemIcon>
           {index % 2 === 0 ? <Home /> : <PostAdd />}
          </ListItemIcon>
          <ListItemText primary={text} />
         </ListItemButton>
        </ListItem>
       </Link>
      ))}
     </List>
     <Divider />
     <List>
      {["Settings"].map((text, index) => (
       <ListItem key={text} disablePadding>
        <ListItemButton>
         <ListItemIcon>
          {index % 2 === 0 ? <SettingsIcon /> : <MailIcon />}
         </ListItemIcon>
         <ListItemText primary={text} />
        </ListItemButton>
       </ListItem>
      ))}
     </List>
    </Box>
   </Drawer>

   <Modal
    isOpen={openAlert}
    title="Login"
    message={alertMessage}
    onCancel={() => {
     setOpenAlert(false);
     setAlertMessage("");
    }}
   />
  </>
 );
}
