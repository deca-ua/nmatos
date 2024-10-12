// src/components/ClearButton.js
import React from "react";

const ClearButton = ({ onClick }) => {
  return (
    <button className="btn btn-secondary" onClick={onClick}>
      Clear All
    </button>
  );
};

export default ClearButton;
