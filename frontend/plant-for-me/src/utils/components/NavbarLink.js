import React from "react";
import { NavLink } from "react-router-dom";

const NavbarLink = ({link, title, onClick}) => {
  return (
    <li className="navigation__list">
      <NavLink to={link} onClick={onClick} className={({ isActive }) => "btn navigation__button"  + (isActive ? " btn--active": "")}>
        {title}
      </NavLink>
    </li>
  )
}

export default NavbarLink