import React from 'react';
import { Search } from 'lucide-react';
import './SearchInput.css';

export const SearchInput = ({
  placeholder,
  value,
  onChange
}) => {
  return (
    <div className="ad-search">
      <Search className="ad-search__icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ad-search__input"
      />
    </div>
  );
};
