// src/components/SearchButton.js
import React from "react";

const SearchButton = ({ onClick, loading, disabled }) => {
  return (
    <button className="btn btn-danger me-2" onClick={onClick} disabled={disabled}>
      {loading ? "Searching..." : "Search"}
    </button>
  );
};

export default SearchButton;
