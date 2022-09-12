import { AppBar, Button } from "@mui/material";
import { Box } from "@mui/system"
import React from "react"
import NavbarLink from "./NavbarLink";
import '../../assets/css/header.css';
import { AuthService } from "../../services/auth/AuthService";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {  NavLink } from "react-router-dom";

const Header = () => {
  let navigate = useNavigate();
  let currentUser = AuthService.getCurrentUser()

  const logout = () => {
    AuthService.logout();
    navigate("/login");
  }
  return (
    <AppBar position="static">
      <Box >
          <Button>
            <NavbarLink link="/plants" title="Plants" />
          </Button>
          {
            currentUser && (currentUser.role === 2 || currentUser.role === 1) &&
            <Button>
              <NavbarLink link="/categories" title="Categories" />
            </Button>
          }
          {
            currentUser && currentUser.role === 2 &&
            <Button>
              <NavbarLink link="/users" title="Users" />
            </Button>
          }
          <Button>
            <NavbarLink link="/forums" title="Forums" />
          </Button>
          {
            currentUser &&
            <Button >
              <NavbarLink link="/plantcare" title="My plants" />
            </Button>
          }
          {
            currentUser &&
            <Button >
              <NavbarLink link="/recommendation" title="Recommendation" />
            </Button>
          }
          {
            !currentUser && 
            <Button>
              <NavbarLink link="/login" title="Login" />
            </Button>
          }
          
          {
            currentUser &&
            <Button sx={{color:'white'}} onClick={() => logout()}>
              Logout
            </Button>
          }
          {
            currentUser &&
            <Button sx={{color:'white'}} component={NavLink} to="/me">
              <AccountCircleIcon />
            </Button>
          }
          

      </Box>
    </AppBar>
    
  )
}

export default Header