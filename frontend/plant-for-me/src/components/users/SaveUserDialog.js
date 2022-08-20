import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { roles } from "../../data/enums";
import MySelect from "../../utils/components/MySelect";

const SaveUserDialog = ({title, handleOpen, handleClose, handleSaveUser, user}) => {
  const [newUser, setNewUser] = useState({})

  useEffect(() => {
    setNewUser(user)
  }, [user]);

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
          value={newUser.username}
          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
          variant="standard"
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Password"
          type="text"
          fullWidth
          value={newUser.password}
          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          variant="standard"
          sx={{marginBottom: '2em'}}
        />
        <MySelect label="Role" options={roles} selected={newUser.role} onValueChange={(role) => setNewUser({...newUser, role})} isFiltering={false}/>
      
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => 
          {setNewUser(
            {
              username: "",
              password: "",
              role: 0
            }); 
          return handleSaveUser(newUser)}}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveUserDialog;