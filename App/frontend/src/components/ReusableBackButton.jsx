import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReusableBackButton.css"; // estilos separados

const ReusableBackButton = ({ 
  label = "Regresar", 
  icon = "←", 
  onClick = null 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick(); 
    navigate(-1);
  };

  return (
    <button className="edit-back-button pill" onClick={handleClick}>
      <span className="arrow">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default ReusableBackButton;
