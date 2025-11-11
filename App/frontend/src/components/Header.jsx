import React from "react";
import "./Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="COCMI Logo" className="header-logo" />
        <span className="header-title">COCMI</span>
      </div>

    </header>
  );
};

export default Header;
