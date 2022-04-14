import { Alert, Box, Button, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useContext, useState } from "react";
import { UsersContext } from "../../context/users/UsersContext";
import SaveUserDialog from "../../components/users/SaveUserDialog";
import AreYouSureDialog from "../../components/AreYouSureDialog";

const UsersPage = () => {
  const usersContext = useContext(UsersContext)
  const [alertOpen, setAlertOpen] = useState(false);
  const [severity, setSeverity] = useState("success")
  const [errorMsg, setErrorMsg] = useState("Successfully added category!")
  const [createUserDialog, setCreateUserDialogOpen] = useState(false)
  const [updateUserDialog, setUpdateUserDialogOpen] = useState(false)
  const [deleteUserDialog, setDeleteUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})
  const roles = ["Public","Member","Moderator","Admin"];

  const handleClickDelete = (user) => {
    setSelectedUser(user)
    setDeleteUserDialogOpen(true)
  }

  const deleteUser = (userID) => {
    usersContext.deleteUserHandler(userID).then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully deleted user!")
      } else {
        setupAlert("error", res.err)
      }
      setAlertOpen(true);
      setDeleteUserDialogOpen(false);
    }).then(() => usersContext.getAllHandler())
  }

  const handleClickUpdate = (user) => {
    console.log(user)
    setSelectedUser(user)
    setUpdateUserDialogOpen(true)
  }

  const getRoleName = (role) => {
    return roles[role];
  }

  const createUser = (user) => {
    console.log(user)
    if(!validate(user)) {
      return;
    }
    
    usersContext.createUserHandler(user).then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully added user!")
      } else {
        setupAlert("error", res.err)
      }
      setAlertOpen(true);
      setCreateUserDialogOpen(false);
    }).then(() => usersContext.getAllHandler())
  }

  const updateUser = (user) => {
    if(!validate(user)) {
      return;
    }

    var userToUpdate = JSON.parse(JSON.stringify(selectedUser));
    userToUpdate.username = user.username.trim();
    userToUpdate.password = user.password.trim();
    userToUpdate.role = user.role;
    
    usersContext.updateUserHandler(userToUpdate)
    .then(res => {
      if(res.ok) {
        setupAlert("success", "Successfully updated user!")
      } else {
        setupAlert("error", res.err)
      }
      setAlertOpen(true);
      setUpdateUserDialogOpen(false);
    }).then(() => usersContext.getAllHandler())
    
  }

  const validate = (user) => {
    if(user.username.trim().length < 3 || user.password.trim().length <3 ){
      setupAlert("warning", "Required minimum length is 3")
      setAlertOpen(true);
      return false;
    }
    return true;
  }

  const setupAlert = (severity, msg) => {
    setSeverity(severity);
    setErrorMsg(msg);
  }

  return (
    <Box sx={{padding:'5em'}}>
        <Snackbar open={alertOpen} autoHideDuration={4000} onClose={() => setAlertOpen(false)}>
          <Alert onClose={() => setAlertOpen(false)} severity={severity} sx={{ width: '100%' }}>
            {errorMsg}
          </Alert>
        </Snackbar>
        <Box sx={{ justifyContent: 'flex-end', marginBottom:'1em' }}>
          <Button variant="contained" onClick={() => setCreateUserDialogOpen(true)}>Add user</Button>
        </Box>

        <AreYouSureDialog handleOpen={deleteUserDialog} 
                  handleClose={() => setDeleteUserDialogOpen(false)} 
                  handleOperation={() => deleteUser(selectedUser.id)}
                  title="Delete user" content={"Are you sure you want to delete user " + selectedUser.username + "?"}/>
        <SaveUserDialog title="Create new user" handleOpen={createUserDialog} handleClose={() => setCreateUserDialogOpen(false)}
        handleSaveUser={(user) => createUser(user)}/>

        <SaveUserDialog title="Edit category" handleOpen={updateUserDialog} handleClose={() => setUpdateUserDialogOpen(false)}
        handleSaveUser={(user) => updateUser(user, selectedUser)}/>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersContext.users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  
                  <TableCell component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {getRoleName(user.role)}
                  </TableCell>
                  <TableCell style={{ width: 60 }} align="right" onClick={() => handleClickUpdate(user)}><EditIcon/></TableCell>
                  <TableCell style={{ width: 60 }} align="right" onClick={() => handleClickDelete(user)}><DeleteIcon/></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  )
}

export default UsersPage;