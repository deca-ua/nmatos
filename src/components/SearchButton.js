import React from "react";
import PropTypes from "prop-types";

const SearchButton = ({ onClick, loading, disabled }) => {
  return (
    <button
      className="btn btn-danger me-2"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? "Searching..." : "Search"}
    </button>
  );
};

SearchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default SearchButton;
