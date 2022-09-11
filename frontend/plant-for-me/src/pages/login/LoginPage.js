import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { LoginContext } from "../../context/login/LoginContext";
// import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginContext = useContext(LoginContext);
  const [usernameError, setUsernameError] = useState({error: false, message: ""});
  const [passwordError, setPasswordError] = useState({error:false, message: ""});
  let navigate = useNavigate();

  const login = () => {
    if (!validate()) {
      return;
    }

    loginContext.loginHandler({username, password}).then(res => {
      if(res.ok) {
        if(res.user.role === 3) {
          navigate("/users");
        } else {
          navigate("/plants");
        }
      } else {
        toast.error(res.err);
      }
    })
  }

  const validate = () => {
    if (password.trim() === "") {
      setPasswordError({error: true, message: "Password must not be empty"});
    } else {
      setPasswordError({error: false, message: ""});
    }

    if (username.trim() === "") {
      setUsernameError({error: true, message: "Username must not be empty"});
    } else {
      setUsernameError({error: false, message: ""});
    }
    
    return username.trim() !== "" && password.trim() !== "";
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
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          
          <TextField
            type="password"
            error={passwordError.error}
            helperText={passwordError.message}
            id="outlined-basic" 
            label="Password" 
            variant="outlined" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            sx={{marginTop: '1em'}} 
          />
        </FormControl>
        <Box sx={{display:'flex', gap:1, flexDirection:'row',marginTop:'2em',justifyContent:'space-between'}}>
          <Button component={NavLink} to="/registration" fullWidth variant="outlined" >Register</Button>          
          <Button fullWidth variant="contained" sx={{color:'white'}} onClick={() => login()}>Sign in</Button>
        </Box>
        
      </Box>
      
     </Grid>
    </div>
    
  )
}

export default LoginPage;