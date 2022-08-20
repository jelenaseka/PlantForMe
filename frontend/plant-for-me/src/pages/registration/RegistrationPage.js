import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { RegistrationContext } from "../../context/registration/RegistrationContext";
import { NavLink } from "react-router-dom";

const RegistrationPage = () => {
  const registrationContext = useContext(RegistrationContext);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    repeatPassword: ""
  });
  const [usernameError, setUsernameError] = useState({error: false, message: ""});
  const [passwordError, setPasswordError] = useState({error:false, message: ""});
  const [repeatPasswordError, setRepeatPasswordError] = useState({error:false, message: ""});

  const register = () => {
    if (!validate()) {
      return;
    }
    registrationContext.registerHandler(newUser).then(res => {
      if(res.ok) {
        toast.success("Successfully registered to system!");
        setNewUser({
          username: "",
          password: "",
          repeatPassword: ""
        })
      } else {
        toast.error(res.err);
      }
    })
  }

  const validate = () => {
    if (newUser.password.trim() === "") {
      setPasswordError({error: true, message: "Password must not be empty"});
    } else {
      setPasswordError({error: false, message: ""});
    }

    if (newUser.username.trim() === "") {
      setUsernameError({error: true, message: "Username must not be empty"});
    } else {
      setUsernameError({error: false, message: ""});
    }

    if (newUser.repeatPassword.trim() === "") {
      setRepeatPasswordError({error: true, message: "Repeat password must not be empty"});
    } else {
      setRepeatPasswordError({error: false, message: ""});
    }
    
    return newUser.username.trim() !== "" && newUser.password.trim() !== "" && newUser.repeatPassword.trim() !== "";
  }

  const checkPasswordFieldsMatch = () => {
    console.log('bla', newUser.password.trim(), newUser.repeatPassword.trim())
    if(newUser.password.trim() !== newUser.repeatPassword.trim()) {
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
      <ToastContainer />
      <Grid container sx={{padding: '5em'}} justifyContent="center">
        <Box sx={
          { display:'flex', 
            flexDirection: 'column', 
            justifyContent:"center", 
            width: '30ch', 
            padding: '3em 2em', 
            borderRadius:'15px',
            // border:'1px solid #a5d6a7'
          }}>
          <FormControl variant="outlined">
            <TextField
              error={usernameError.error}
              helperText={usernameError.message}
              id="outlined-basic" 
              label="Username" 
              variant="outlined" 
              value={newUser.username} 
              onChange={(e) =>setNewUser({...newUser, username: e.target.value})} 
              onBlur={() =>  fieldValidation(
                  newUser.username.trim(),
                  () => setUsernameError({error: true, message: "Username must not be empty"}),
                  () => setUsernameError({error: false, message: ""})
                ) }
            />
            
            <TextField
              error={passwordError.error}
              helperText={passwordError.message}
              id="outlined-basic" 
              label="Password" 
              variant="outlined" 
              value={newUser.password} 
              onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
              onBlur={() => {
                fieldValidation(
                  newUser.password.trim(),
                  () => setPasswordError({error: true, message: "Password must not be empty"}),
                  () => setPasswordError({error: false, message: ""})
                );
                checkPasswordFieldsMatch(); 
              }}
              sx={{marginTop: '1em'}} 
            />

            <TextField
              error={repeatPasswordError.error}
              helperText={repeatPasswordError.message}
              id="outlined-basic" 
              label="Password" 
              variant="outlined" 
              value={newUser.repeatPassword} 
              onChange={(e) => setNewUser({...newUser, repeatPassword: e.target.value})} 
              onBlur={() => {
                fieldValidation(
                  newUser.repeatPassword.trim(),
                  () => setRepeatPasswordError({error: true, message: "Repeat password must not be empty"}),
                  () => setRepeatPasswordError({error: false, message: ""})
                );
                checkPasswordFieldsMatch();
              }}
              sx={{marginTop: '1em'}} 
            />
          </FormControl>
          <Box sx={{display:'flex', gap:1, flexDirection:'row',marginTop:'2em',justifyContent:'space-between'}}>
            <Button component={NavLink} to="/login" fullWidth variant="outlined" >Login</Button>          
            <Button fullWidth variant="contained" sx={{color:'white'}} onClick={() => register()}>Register</Button>
          </Box>
          
        </Box>
      </Grid>
    </div>
  )
}

export default RegistrationPage;