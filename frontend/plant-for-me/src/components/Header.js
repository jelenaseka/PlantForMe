import { Button, Container, MenuItem } from "@mui/material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import MenuIcon from '@mui/icons-material/Menu';
import NavbarLink from "./NavbarLink";
import '../assets/css/header.css';

const Header = () => {
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
        </ul>
      </Box>
    </nav>
  )
}

export default Header