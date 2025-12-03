import React, { useState } from "react";
import "./Header.css";
import logo from "../assets/logo.png";
import icono_upload from "../assets/upload_icon.svg";
import { Link } from "react-router-dom";
import FileUploadModal from "./fileUploadModal/fileUploadModal";
import { ToastContainer } from "react-toastify";


const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <ToastContainer />
      <div className="header-content">
        <Link to="/" className="header-link-wrapper">
          <div className="header-left">
            <img src={logo} alt="COCMI Logo" className="header-logo" />
            <span className="header-title">COCMI</span>
          </div>
        </Link>

        <button className="header-action-button" onClick={openModal}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <span>Gestionar Categorías</span>
        </button>
      </div>

      {/* Modal appears when isModalOpen === true */}
      {isModalOpen && <FileUploadModal onClose={closeModal} />}
    </header>
  );
};

export default Header;