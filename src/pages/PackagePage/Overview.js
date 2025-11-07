import React, { useState } from "react";
import "./PackagePage.css";

function Overview() {
  const [language, setLanguage] = useState("English");
  const [searchText, setSearchText] = useState("");

  const languages = [
    "中文",
    "English",
    "Español",
    "Português",
    "Français",
    "Deutsch",
    "日本語",
    "한국어",
  ];

  const handleSearch = () => {
    
    alert(`Searching for: ${searchText}`);
  };

  return (
    <section className="overview-section">
      <h2 className="section-title">Overview</h2>

      <div className="guide-language">
        <ul>
          <li>
            🚍 Round-trip transportation included
            <div className="overview-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </li>
          <li>🎧 Professional languages guide</li>
          <label htmlFor="language-select" className="language-label">
            🗣️ Select your guide language:
          </label>
          <select
            id="language-select"
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <li>📸 Perfect for first-time visitors</li>
        </ul>

        <button className="book-btn">Book Now</button>
      </div>
    </section>
  );
}

export default Overview;
