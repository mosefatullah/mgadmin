import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Modal({ isOpen, title, body, onCancel, onDelete }) {
 const [open, setOpen] = React.useState(false);

 const handleClose = () => {
  setOpen(false);
  onCancel(open);
 };

 React.useEffect(() => {
  setOpen(isOpen);
 }, [isOpen]);

 return (
  <div>
   <Dialog open={open} onClose={handleClose} transitionDuration={0}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent
     sx={{
      minWidth: "300px",
     }}
    >
     <DialogContentText>{body}</DialogContentText>
    </DialogContent>
    <DialogActions>
     {onDelete && typeof onDelete == "function" && (
      <>
       <Button onClick={handleClose}>Cancel</Button>
       <Button
        onClick={() => {
         setOpen(false);
         onDelete();
        }}
       >
        Delete
       </Button>
      </>
     )}
     {!onDelete ||
      (typeof onDelete == "undefined" && (
       <Button onClick={handleClose}>Okay</Button>
      ))}
    </DialogActions>
   </Dialog>
  </div>
 );
}
