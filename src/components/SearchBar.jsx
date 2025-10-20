import React, { useContext } from "react";

const SearchBar = () => {
  return (
    <div className="search-container">
      <input type="text" placeholder="Search for job titles, skills" />
      <input type="text" placeholder="Location" />
      <select>
        <option>Job Type</option>
        <option>Full-time</option>
        <option>Part-time</option>
      </select>
      <select>
        <option>Experience Level</option>
        <option>Entry Level</option>
        <option>Mid Level</option>
        <option>Senior Level</option>
      </select>
      <button>Search Jobs</button>
    </div>
  );
};

export default SearchBar;
