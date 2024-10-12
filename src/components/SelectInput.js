// src/components/SelectInput.js
import React from "react";
import Select from "react-select";

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

export default SelectInput;
