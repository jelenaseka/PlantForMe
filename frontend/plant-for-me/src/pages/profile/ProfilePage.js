import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ProfileContext } from '../../context/profile/ProfileContext';

const ProfilePage = () => {
  const profileContext = useContext(ProfileContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [usernameError, setUsernameError] = useState({error: false, message: ""});
  const [passwordError, setPasswordError] = useState({error:false, message: ""});
  const [repeatPasswordError, setRepeatPasswordError] = useState({error:false, message: ""});

  useEffect(() => {
    if(profileContext.me != null) {
      setUsername(profileContext.me.username);

    }
  }, [profileContext.me])

  const getRoleString = () => {
    if(profileContext.me.role === 1) {
      return 'Member';
    } else if (profileContext.me.role === 2) {
      return 'Moderator';
    } else if (profileContext.me.role === 3) {
      return 'Admin';
    }
  }

  const changeUsername = () => {
    if(username.trim() === "") {
      setUsernameError({error: true, message: "Username must not be empty"});
      return;
    }
    profileContext.changeUsernameHandler(username.trim()).then(res => {
      if(res.ok) {
        toast.success("Successfully updated username!");
        setUsernameError({error: false, message: ""});
      } else {
        toast.error(res.err);
      }
    })
  }

  const changePassword = () => {
    if(password.trim() === "" || repeatPassword.trim() === "") {
      toast.error("Password must not be empty");
      setPassword("");
      setRepeatPassword("");
    }
    if(password !== repeatPassword) {
      setRepeatPasswordError({error: true, message: "Password does not match!"});
      return;
    }

    profileContext.changePasswordHandler(password).then(res => {
      if(res.ok) {
        toast.success("Successfully updated password!");
        setRepeatPasswordError({error: false, message: ""});
      } else {
        toast.error(res.err);
      }
    })

  }

  const checkPasswordFieldsMatch = () => {
    if(password !== repeatPassword) {
      setRepeatPasswordError({error: true, message: "Password does not match!"});
    } else {
      setRepeatPasswordError({error: false, message: ""});
    }
  }

  const fieldValidation = (fieldValue, errorFunc, succFunc) => {
    if (fieldValue === "") {
      errorFunc()
    } else {
      succFunc()
    }
  }

  return (
    <div>
      <ToastContainer/>
      {
        profileContext.me &&
        <Box sx={{ flexGrow: 1, padding: '2em' }}>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <TextField
                sx={{marginRight:'5px', marginBottom:'10px'}}
                label="Username" 
                variant="outlined" 
                value={username}
                error={usernameError.error}
                helperText={usernameError.message}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() =>  fieldValidation(
                  username.trim(),
                  () => setUsernameError({error: true, message: "Username must not be empty"}),
                  () => setUsernameError({error: false, message: ""})
                ) }
              />
              <Button sx={{marginTop:'8px'}} onClick={() => changeUsername()}>change</Button>
            </Grid>
            <Grid item md={12}>
              Set new password<br/>
              <TextField
                sx={{marginRight:'5px', marginTop: '1em'}}
                label="Password" 
                variant="outlined" 
                value={password} 
                error={passwordError.error}
                helperText={passwordError.message}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => {
                  checkPasswordFieldsMatch(); 
                }}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                sx={{marginRight:'5px'}}
                label="Repeat password" 
                variant="outlined" 
                value={repeatPassword} 
                error={repeatPasswordError.error}
                helperText={repeatPasswordError.message}
                onChange={(e) => setRepeatPassword(e.target.value)}
                onBlur={() => {
                  checkPasswordFieldsMatch();
                }}
              />
              <Button sx={{marginTop:'10px'}} onClick={() => changePassword()}>update password</Button>
            </Grid>
            <Grid item md={12}>
              <TextField
                readOnly
                label="Role" 
                variant="outlined" 
                value={getRoleString(profileContext.me.role)} 
              />
            </Grid>
          </Grid>
        </Box>
        // <Box sx={
        //   { display:'flex', 
        //     flexDirection: 'column', 
        //     justifyContent:"center", 
        //     width: '50ch', 
        //     padding: '3em 2em', 
        //     borderRadius:'15px',
        //     // border:'1px solid #a5d6a7'
        //   }}>
        //     <Box component="form" variant="outlined" sx={{display:'flex'}}>
              
        //       <TextField
        //         sx={{marginRight:'5px'}}
        //         label="Username" 
        //         variant="outlined" 
        //         value={profileContext.me.username} 
        //       />
        //       <div >
        //         <Button sx={{marginTop:'8px'}} variant="contained">change</Button>
                
        //       </div>
              
        //     </Box>
        //     <Box component="form" variant="outlined" sx={{display:'flex'}}>
        //       <TextField
        //         sx={{marginRight:'5px', marginTop: '1em'}}
        //         label="Username" 
        //         variant="outlined" 
        //         value={profileContext.password} 
        //       />
        //     </Box>
        //     <Box component="form" variant="outlined" sx={{display:'flex'}}>
        //       <TextField
        //         sx={{marginRight:'5px', marginTop: '1em'}}
        //         label="Username" 
        //         variant="outlined" 
        //         value={profileContext.repeatPassword} 
        //       />
        //       <div >
        //         <Button sx={{marginTop:'8px'}} variant="contained">update password</Button>
        //       </div>
              
        //     </Box>
        //     <TextField
        //       sx={{marginTop: '1em'}} 
        //       label="Role" 
        //       variant="outlined" 
        //       value={getRoleString(profileContext.me.role)} 
        //     />
        // </Box>
      }
      
      
    </div>
  )
}

export default ProfilePage;