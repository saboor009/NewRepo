import React from "react";

import searchIcon from "../icons/search.svg";

const SearchBar = () => {
  return (
    <div className="serach-main">
    <div className="search-container">
      <select className="doctor-dropdown">
        <option value="doctors">Doctors</option>
        <option value="dentists">Dentists</option>
        <option value="specialists">Specialists</option>
      </select>
      <img src={searchIcon} alt="Search Icon" className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search the best doctor"
      />
    </div>
    </div>
  );
};

export default SearchBar;
