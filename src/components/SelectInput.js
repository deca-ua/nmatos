import React from "react";
import Select from "react-select";
import PropTypes from 'prop-types';

const SelectInput = ({ options, placeholder, value, onChange, onInputChange }) => {
  return (
    <Select
      className="mb-3"
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={onChange}
      onInputChange={onInputChange}
      isClearable
    />
  );
};

SelectInput.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
};

export default SelectInput;
