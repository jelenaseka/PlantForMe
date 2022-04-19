import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

const AreYouSureDialog = ({title, content, handleOpen, handleClose, handleOperation}) => {
  return (
    <Dialog open={handleOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleOperation}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AreYouSureDialog