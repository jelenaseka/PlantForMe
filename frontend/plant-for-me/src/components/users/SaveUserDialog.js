import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { roles } from "../../data/enums";
import MySelect from "../../utils/components/MySelect";

const SaveUserDialog = ({title, handleOpen, handleClose, handleSaveUser}) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: 1
  })
  return (
    <Dialog open={handleOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Username"
          type="text"
          fullWidth
          value={user.username}
          onChange={(e) => setUser({...user, username: e.target.value})}
          variant="standard"
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Password"
          type="text"
          fullWidth
          value={user.password}
          onChange={(e) => setUser({...user, password: e.target.value})}
          variant="standard"
          sx={{marginBottom: '2em'}}
        />
        <MySelect label="Role" options={roles} selected={user.role} onValueChange={(role) => setUser({...user, role})} isFiltering={false}/>
      
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => 
          {setUser(
            {
              username: "",
              password: "",
              role: 1
            }); 
          return handleSaveUser(user)}}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveUserDialog;