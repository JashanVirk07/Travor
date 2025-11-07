import React from "react";

function PackageSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="package-sidebar">
      <ul>
        <li
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </li>
        <li
          className={activeTab === "option" ? "active" : ""}
          onClick={() => setActiveTab("option")}
        >
          Option
        </li>
        <li
          className={activeTab === "review" ? "active" : ""}
          onClick={() => setActiveTab("review")}
        >
          Review
        </li>
      </ul>
    </aside>
  );
}

export default PackageSidebar;
