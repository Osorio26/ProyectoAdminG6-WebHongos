import React, { useState } from "react";
import "./Header.css";
import logo from "../assets/logo.png";
import icono_upload from "../assets/upload_icon.svg";
import { Link } from "react-router-dom";
import FileUploadModal from "./fileUploadModal/fileUploadModal";

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
      <Link to="/" className="header-link-wrapper">
        <div className="header-left">
          <img src={logo} alt="COCMI Logo" className="header-logo" />
          <span className="header-title">COCMI</span>
        </div>
      </Link>

      <div className="upload-button-container" onClick={openModal}>
        <img
          src={icono_upload}
          alt="icono_subida_archivos"
          className="upload-icon"
        />
      </div>

      {/* Modal appears when isModalOpen === true */}
      {isModalOpen && <FileUploadModal onClose={closeModal} />}
    </header>
  );
};

export default Header;