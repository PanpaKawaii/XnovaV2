import React from 'react';
import { ChevronDown } from 'lucide-react';
import './FilterSelect.css';

export const FilterSelect = ({
  options,
  value,
  onChange,
  placeholder
}) => {
  return (
    <div className="ad-filter">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ad-filter__select"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="ad-filter__icon" />
    </div>
  );
};
