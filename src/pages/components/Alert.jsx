import React from "react";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

function Alert({ body, isOpen, onCancel, color }) {
 const [open, setOpen] = React.useState(false);

 const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
 });

 const handleClose = (event, reason) => {
  if (reason !== "clickaway") {
   setOpen(false);
   onCancel(open);
  }
 };

 React.useEffect(() => {
  setOpen(isOpen);
 }, [isOpen]);

 return (
  <Snackbar
   open={open}
   autoHideDuration={3000}
   onClose={handleClose}
   message={color === false && body}
   action={
    <React.Fragment>
     <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
     >
      <CloseIcon fontSize="small" />
     </IconButton>
    </React.Fragment>
   }
  >
   {color !== false && (
    <Alert onClose={handleClose} severity={color}>
     {body}
    </Alert>
   )}
  </Snackbar>
 );
}

export default Alert;
