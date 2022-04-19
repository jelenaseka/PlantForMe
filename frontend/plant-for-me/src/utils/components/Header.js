import { Button } from "@mui/material";
import { Box } from "@mui/system"
import React from "react"
import NavbarLink from "./NavbarLink";
import '../../assets/css/header.css';
import { AuthService } from "../../services/auth/AuthService";
import { useNavigate } from "react-router-dom";

const Header = () => {
  let navigate = useNavigate();

  const logout = () => {
    AuthService.logout();
    navigate("/login");
  }
  return (
    <nav className="navigation">
      <Box >
        <ul className="nav-ul">
          <Button>
            <NavbarLink link="/plants" title="Plants" />
          </Button>
          <Button>
            <NavbarLink link="/categories" title="Categories" />
          </Button>
          <Button>
            <NavbarLink link="/users" title="Users" />
          </Button>
          <Button>
            <NavbarLink link="/login" title="Login" />
          </Button>
          <Button variant="contained" onClick={() => logout()}>
            Logout
          </Button>
        </ul>
      </Box>
    </nav>
  )
}

export default Header