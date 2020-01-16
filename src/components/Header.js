import React from "react";
import { Navbar } from "react-bootstrap";
import LogoutBtn from "./Auth/LogoutBtn";
import Logo from "./beeLogo.png";

const Header = ({ logoutHandler }) => (
  <Navbar className="justify-content-between">
    <Navbar.Brand>
      <h1>BeeKeepers Log</h1>
      <img src={Logo} width="100"/>
    </Navbar.Brand>
  </Navbar>
);

export default Header;
