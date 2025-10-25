import React, { useState } from "react";
import axios from "axios";
import EmployeeCard from "./EmployeeCard";
import './EmployeeSearch.css';

const EmployeeSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.get(
        `http://localhost:8080/api/employees/search?name=${encodeURIComponent(query)}`
      );
      setResults(resp.data);
    } catch (err) {
      alert("No results or error occurred.");
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="employee-search">
      <h2>Search Employees</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter employee name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={!query || loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="results-list">
        {results.map(emp => (
          <EmployeeCard key={emp.empId} employee={emp} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeSearch;
