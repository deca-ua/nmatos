import React from "react";
import PropTypes from 'prop-types';

const ClearButton = ({ onClick }) => {
  return (
    <button className="btn btn-secondary" onClick={onClick}>
      Clear All
    </button>
  );
};

ClearButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ClearButton;
