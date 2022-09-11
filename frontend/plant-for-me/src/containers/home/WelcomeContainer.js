import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import '../../assets/css/welcome.css';

const WelcomeContainer = () => {
  return (
    <div className="welcome-page" style={{height: 'calc(100vh - 48px)'}}>
      <div style={{display: 'flex'}}>
        <div style={{width:'50%'}}></div>
        <h1 className="welcome-font">
          <span>Welcome to</span><br/> <span className="logo-heading">Plant For Me</span>
        </h1>
      </div>
      <div style={{marginTop:'15em'}}>
        <p style={{textAlign:'center'}}>Click <Button variant="contained" sx={{margin:'0 0.5em'}}
        component={NavLink} to="/plants">here</Button> to start your search</p>
      </div>
    </div>
  )
}

export default WelcomeContainer;