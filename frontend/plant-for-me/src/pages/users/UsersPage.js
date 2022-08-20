import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useContext, useState } from "react";
import { UsersContext } from "../../context/users/UsersContext";
import SaveUserDialog from "../../components/users/SaveUserDialog";
import AreYouSureDialog from "../../utils/components/AreYouSureDialog";
import { toast, ToastContainer } from "react-toastify";
import { tokenIsExpired } from "../../utils/functions/jwt";
import { AuthService } from "../../services/auth/AuthService";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const usersContext = useContext(UsersContext)
  const [createUserDialog, setCreateUserDialogOpen] = useState(false)
  const [updateUserDialog, setUpdateUserDialogOpen] = useState(false)
  const [deleteUserDialog, setDeleteUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState({});
  let navigate = useNavigate();
  const roles = ["Member","Moderator","Admin"];
  
  const handleClickUpdate = (user) => {
    setSelectedUser(user)
    setUpdateUserDialogOpen(true)
  }

  const handleClickDelete = (user) => {
    setSelectedUser(user)
    setDeleteUserDialogOpen(true)
  }

  const checkLoggedInUser = () => {
    if(tokenIsExpired() || usersContext.currentUser === null) {
      AuthService.logout();
      navigate("/login");
      return;
    }
  }

  const deleteUser = (userID) => {
    checkLoggedInUser();
    usersContext.deleteUserHandler(userID).then(res => {
      if(res.ok) {
        toast.success("Successfully deleted user!");
      } else {
        toast.error(res.err);
      }
      setDeleteUserDialogOpen(false);
    }).then(() => usersContext.getAllHandler())
  }

  const createUser = (user) => {
    checkLoggedInUser();

    if(!validate(user)) {
      toast.warn("Required minimum length is 3"); //todo fix
      return;
    }
    
    usersContext.createUserHandler(user).then(res => {
      if(res.ok) {
        toast.success("Successfully added user!");
      } else {
        toast.error(res.err);
      }
      setCreateUserDialogOpen(false);
    }).then(() => usersContext.getAllHandler())
  }

  const updateUser = (user) => {
    checkLoggedInUser();

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
          toast.success("Successfully updated user!");
        } else {
          toast.error(res.err);
        }
        setUpdateUserDialogOpen(false);
      }).then(() => usersContext.getAllHandler())
    
  }

  const validate = (user) => {
    return !(user.username.trim().length < 3 || user.password.trim().length < 3 );
  }

  const getRoleName = (role) => {
    return roles[role];
  }

  return (
    <Box sx={{padding:'5em'}}>
        <Box sx={{ justifyContent: 'flex-end', marginBottom:'1em' }}>
          <Button variant="contained" onClick={() => setCreateUserDialogOpen(true)}>Add user</Button>
        </Box>

        <AreYouSureDialog handleOpen={deleteUserDialog} 
                  handleClose={() => setDeleteUserDialogOpen(false)} 
                  handleOperation={() => deleteUser(selectedUser.id)}
                  title="Delete user" content={"Are you sure you want to delete user " + selectedUser.username + "?"}/>
        <SaveUserDialog 
          title="Create new user" 
          handleOpen={createUserDialog} 
          handleClose={() => setCreateUserDialogOpen(false)}
          handleSaveUser={(user) => createUser(user)}
          user={{
            username: "",
            password: "",
            role: 0
          }}
        />

        <SaveUserDialog 
          title="Edit user" 
          handleOpen={updateUserDialog} 
          handleClose={() => setUpdateUserDialogOpen(false)}
          handleSaveUser={(user) => updateUser(user)}
          user={{
            username: selectedUser.username,
            password: "",
            role: selectedUser.role
          }}
        />
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
                  <TableCell style={{ width: 60 }} align="right" onClick={() => handleClickUpdate(user)}>
                    <Button><EditIcon/></Button>
                  </TableCell>
                  <TableCell style={{ width: 60 }} align="right" onClick={() => handleClickDelete(user)}>
                    <Button><DeleteIcon/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ToastContainer />
      </Box>
  )
}

export default UsersPage;