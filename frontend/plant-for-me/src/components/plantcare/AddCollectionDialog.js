import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";

const AddCollectionDialog = ({open, handleCancel, handleSubmit}) => {
  const [collection, setCollection] = useState({
    name: "",
    description: ""
  })

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
          variant="standard"
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
          variant="standard"
          multiline
          value={collection.description}
          onChange={(e) => setCollection({...collection, description: e.target.value})}
          onBlur={() => setCollection({...collection, description: collection.description.trim()})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={() => handleSubmit(collection)}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCollectionDialog;