import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/login/LoginContext";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginContext = useContext(LoginContext);
  let navigate = useNavigate();

  const login = () => {
    loginContext.loginHandler({username, password}).then(res => {
      if(res.ok) {
        navigate("/users");
      } else {
        toast.error(res.err);
      }
    })
  }

  return (
    <Grid container sx={{padding: '5em'}} justifyContent="center">
      <Box sx={{display:'flex', flexDirection: 'column', width: '30ch', padding: '3em 2em', borderRadius:'15px', backgroundColor:'#d8e7f8'}}>
        <FormControl variant="outlined">
          <TextField 
          id="outlined-basic" 
          label="Username" 
          variant="outlined" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          sx={{backgroundColor:'white'}}/>
          
          <TextField 
          id="outlined-basic" 
          label="Password" 
          variant="outlined" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          sx={{marginTop: '1em',backgroundColor:'white'}} />
        </FormControl>
        <Button variant="contained" sx={{marginTop:'1em '}} onClick={() => login()}>Sign in</Button>
      </Box>
      <ToastContainer />
    </Grid>
  )
}

export default LoginPage;