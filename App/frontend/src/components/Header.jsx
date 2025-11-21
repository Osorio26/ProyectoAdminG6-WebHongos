import React from "react";
import "./Header.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header-link-wrapper">
        <div className="header-left">
          <img src={logo} alt="COCMI Logo" className="header-logo"/>
          <span className="header-title">COCMI</span>
        </div>
      </Link>
    </header>
  );
};

export default Header;
