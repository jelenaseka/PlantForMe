import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCollectionDialog = ({open, handleCancel, handleSubmit}) => {
  const [collection, setCollection] = useState({
    name: "",
    description: ""
  })

  const submit = () => {
    if(collection.name.trim() === "") {
      toast.error("Invalid data in the field.") //todo change to underline text
      return;
    }
    collection.name = collection.name.trim();
    //todo - make util function that goes through object and trims strings
    handleSubmit(collection);
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Add collection</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Collection represents a group of plants you find similar or want to have grouped together
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="filled"
          value={collection.name}
          onChange={(e) => setCollection({...collection, name: e.target.value})}
          onBlur={() => setCollection({...collection, name: collection.name.trim()})}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="filled"
          multiline
          value={collection.description}
          onChange={(e) => setCollection({...collection, description: e.target.value})}
          onBlur={() => setCollection({...collection, description: collection.description.trim()})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={() => submit()}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCollectionDialog;