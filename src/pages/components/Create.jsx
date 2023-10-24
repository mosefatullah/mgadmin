import React from "react";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";

/* */
import Autocomplete from "@mui/material/Autocomplete";

import BDJson from "./../utils/bdgeo.json";

const VisuallyHiddenInput = styled("input")({
 clip: "rect(0 0 0 0)",
 clipPath: "inset(50%)",
 height: 1,
 overflow: "hidden",
 position: "absolute",
 bottom: 0,
 left: 0,
 whiteSpace: "nowrap",
 width: 1,
});

import {
 $firebase_storage_upload,
 $firebase_storage_delete,
 $firebase_database_read,
 $firebase_database,
} from "./../utils/Firebase";
import { getDownloadURL } from "@firebase/storage";
import { ref, set, push } from "@firebase/database";

export default function Create({ isOpen, onCancel, type = "Post", onCreated }) {
 const [showLoading, setShowLoading] = React.useState(false);
 const [open, setOpen] = React.useState(false);
 const [submitDisabled, setSubmitDisabled] = React.useState(false);

 const [tabValue, setTabValue] = React.useState("1");
 const [tags, setTags] = React.useState([]);
 const [author, setAuthor] = React.useState("");
 const [title, setTitle] = React.useState("");
 const [body, setBody] = React.useState("");
 const [image, setImage] = React.useState(false);
 const [imageURL, setImageURL] = React.useState(null);
 const [uploadStatus, setUploadStatus] = React.useState("Upload the image");
 const [startDate, setStartDate] = React.useState(null);
 const [endDate, setEndDate] = React.useState(null);
 const exampleEvent = {
  start: null,
  end: null,
  place: null,
  link: null,
  status: "Upcoming",
  tid: "",
  time: null,
 };
 const [event, setEvent] = React.useState(exampleEvent);

 const submitPostToDB = () => {
  let post = {
   id: push(ref($firebase_database, "posts/"))
    .key.replace("-", "")
    .replace("_", ""),
   title: title,
   body: body,
   tags: tags || [],
   picture: imageURL,
   type: type.toLowerCase(),
   author: author || "Admin",
   date: new Date().toLocaleString(),
  };
  if (post.type === "event") {
   post = {
    ...post,
    date: null,
    author: null,
    picture: null,
    tags: null,
    ...event,
   };
  }
  setTimeout(() => {
   $firebase_database_read("posts/", (d) => {
    let posts = d;
    if (posts === null) {
     set(ref($firebase_database, "posts/"), [post]);
    } else {
     posts.push(post);
     set(ref($firebase_database, "posts/"), posts);
    }
    onCreated();
   });
  }, 1000);
 };

 const clearForm = () => {
  setTitle("");
  setBody("");
  setTags([]);
  setAuthor("");
  setImage(false);
  setImageURL(null);
  setStartDate(null);
  setEndDate(null);
  setEvent(exampleEvent);
  setUploadStatus("Upload the image");
 };

 const handleClose = (e, reason) => {
  function o() {
   setOpen(false);
   onCancel(open);
   clearForm();
   setTabValue("1");
  }
  if (reason === "backdropClick") return;
  if (image === false) {
   o();
  } else if (uploadStatus === "Upload the image") {
   o();
  } else if (uploadStatus === "Create the post") {
   $firebase_storage_delete(
    `posts/${document.getElementById("file").files[0].name}`,
    () => {
     o();
    },
    () => {
     o();
    }
   );
  }
 };

 const handleUpload = () => {
  if (imageURL === null) {
   let image = document.getElementById("file").files[0];
   setUploadStatus("Uploading ...");
   setSubmitDisabled(true);
   $firebase_storage_upload(`posts/${image.name}`, image, (k) => {
    k.then((snapshot) => {
     getDownloadURL(snapshot.ref).then((downloadURL) => {
      setImageURL(downloadURL);
      setUploadStatus("Create the post");
      setSubmitDisabled(false);
      document.getElementById("fileMain").style.display = "none";
      return true;
     });
    }).catch((error) => {
     return false;
    });
    return false;
   });
  }
 };

 const handleConfirm = (e) => {
  if (image === false) {
   submitPostToDB();
   setShowLoading(true);
   setSubmitDisabled(true);
   setTimeout(() => {
    setShowLoading(false);
    setSubmitDisabled(false);
    setOpen(false);
    onCancel(open);
    clearForm();
   }, 2000);
  } else {
   if (handleUpload() === false) {
    clearForm();
   } else {
    if (uploadStatus === "Create the post") {
     submitPostToDB();
     setShowLoading(true);
     setSubmitDisabled(true);
     setTimeout(() => {
      setShowLoading(false);
      setSubmitDisabled(false);
      setOpen(false);
      onCancel(open);
      clearForm();
     }, 2000);
    } else if (uploadStatus === "Uploading ...") {
     e.preventDefault();
    }
   }
  }
 };

 React.useEffect(() => {
  setOpen(isOpen);
 }, [isOpen]);

 React.useEffect(() => {
  if (startDate === null || endDate === null) return;
  setEvent({
   ...event,
   time: `${new Date(startDate).toLocaleTimeString()} - ${new Date(
    endDate
   ).toLocaleTimeString()}`,
  });
 }, [startDate, endDate]);

 return (
  <div>
   <Dialog open={open} onClose={handleClose} transitionDuration={0}>
    <DialogTitle>Create {type}</DialogTitle>
    <DialogContent>
     {showLoading ? (
      <div
       style={{
        minWidth: "300px",
        height: "100px",
        marginTop: "1rem",
       }}
      >
       <LinearProgress />
      </div>
     ) : (
      <>
       <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
         value={tabValue}
         onChange={(e, newValue) => {
          setTabValue(newValue);
         }}
        >
         <Tab label="Required" value="1" />
         <Tab label="Optional" value="2" />
        </Tabs>
       </Box>
       <div
        style={{
         padding: "0 0.5rem",
        }}
       >
        <br />
        <div
         style={{
          display: tabValue === "1" ? "block" : "none",
         }}
        >
         <TextField
          id="name"
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ marginBottom: "1rem" }}
          placeholder="Type the title here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
         />
         <TextField
          margin="dense"
          id="body"
          label="Body"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={10}
          sx={{ marginBottom: "1rem" }}
          placeholder="Type something here"
          onChange={(e) => setBody(e.target.value)}
          value={body}
         />
         <div
          style={{
           display: type === "Event" ? "flex" : "none",
           justifyContent: "space-between",
           alignItems: "center",
          }}
         >
          <TextField
           margin="dense"
           id="start"
           type="datetime-local"
           variant="standard"
           sx={{ marginBottom: "1rem" }}
           value={startDate}
           onInput={(e) => {
            setStartDate(e.target.value);
            setEvent({
             ...event,
             start: new Date(e.target.value).toJSON().slice(0, 10),
            });
           }}
          />
          <p
           style={{
            margin: "0 1rem",
           }}
          >
           to
          </p>
          <TextField
           margin="dense"
           id="end"
           type="datetime-local"
           variant="standard"
           sx={{ marginBottom: "1rem" }}
           value={endDate}
           onInput={(e) => {
            setEndDate(e.target.value);
            setEvent({
             ...event,
             end: new Date(e.target.value).toJSON().slice(0, 10),
            });
           }}
          />
         </div>
         <div style={{ display: type === "Event" ? "flex" : "none" }}>
          <Autocomplete
           options={BDJson}
           freeSolo
           sx={{ width: 300 }}
           renderInput={(params) => (
            <TextField
             {...params}
             id="place"
             label="Place"
             margin="dense"
             type="text"
             variant="standard"
             sx={{ marginBottom: "1rem" }}
             placeholder="Dhaka, Bangladesh"
             value={event.place}
             onChange={(e) => {
              setEvent({ ...event, place: e.target.value });
             }}
            />
           )}
          />
         </div>
        </div>

        <div
         style={{
          display: tabValue === "2" ? "block" : "none",
         }}
        >
         <Box
          component="div"
          sx={{
           border: "1px dashed grey",
           width: "300px",
           height: "200px",
           marginBottom: "1rem",
           display: type === "Event" ? "none" : "",
          }}
         >
          <img
           src={image !== false ? image : "https://via.placeholder.com/300x200"}
           style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
           }}
          />
         </Box>
         <Button
          id="fileMain"
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{
           marginBottom: "1rem",
           display: type === "Event" ? "none" : "",
          }}
         >
          Upload file
          <VisuallyHiddenInput
           id="file"
           type="file"
           accept="image/*"
           onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          />
         </Button>
         <div
          style={{
           display: type === "Event" ? "" : "none",
           marginBottom: "3rem",
          }}
         >
          <TextField
           margin="dense"
           id="link"
           label="Link"
           type="text"
           variant="standard"
           fullWidth
           sx={{ marginBottom: "1rem" }}
           placeholder="https://example.com/event?q="
           onChange={(e) => {
            setEvent({ ...event, link: e.target.value });
           }}
           value={event.link}
          />
          <TextField
           margin="dense"
           id="time"
           label="Time"
           type="text"
           variant="standard"
           sx={{ marginBottom: "1rem" }}
           placeholder="10:00 AM - 12:00 PM"
           onChange={(e) => {
            setEvent({ ...event, time: e.target.value });
           }}
           value={event.time}
          />
         </div>
         <Divider />
         <div style={{ display: "flex" }}>
          <TextField
           margin="dense"
           id="author"
           label="Author"
           type="text"
           variant="standard"
           sx={{ marginBottom: "1rem", marginRight: "0.7rem" }}
           placeholder="Enter the author name"
           onChange={(e) => setAuthor(e.target.value)}
           value={author}
          />
          <TextField
           margin="dense"
           id="tags"
           label="Tags"
           type="text"
           variant="standard"
           sx={{ marginBottom: "1rem" }}
           placeholder="Tag1, Tag2, Tag3"
           onChange={(e) => setTags(e.target.value.split(","))}
           value={tags.join(",")}
          />
         </div>
        </div>
       </div>
      </>
     )}
    </DialogContent>
    <DialogActions>
     <Button onClick={handleClose} disabled={submitDisabled}>
      Discard
     </Button>
     <Button
      type="submit"
      onClick={handleConfirm}
      id="submitButton"
      disabled={submitDisabled}
     >
      {type === "Event"
       ? "Create the event"
       : image === false
       ? "Create the post"
       : uploadStatus}
     </Button>
    </DialogActions>
   </Dialog>
  </div>
 );
}
