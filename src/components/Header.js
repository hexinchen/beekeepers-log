import React from "react";
import { Navbar } from "react-bootstrap";
import Logo from "./beeLogo.png";

const Header = () => (
  <Navbar className="justify-content-between">
    <Navbar.Brand>
      <h1>BeeKeepers Log</h1>
      <img src={Logo} width="100" alt="logo"/>
    </Navbar.Brand>
  </Navbar>
);

export default Header;
