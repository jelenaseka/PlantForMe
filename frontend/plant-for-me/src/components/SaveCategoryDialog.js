import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import React, { useState } from "react"

const SaveCategoryDialog = ({title, handleOpen, handleClose, handleSaveCategory}) => {
  const [name, setName] = useState("")
  return (
    <Dialog open={handleOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Category must have unique name
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {setName(""); return handleSaveCategory(name)}}>Submit</Button>
        </DialogActions>
      </Dialog>
  )
}

export default SaveCategoryDialog