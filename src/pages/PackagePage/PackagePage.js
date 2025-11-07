import React, { useState } from "react";
import Overview from "./Overview";
import Option from "./Option";
import Review from "./Review";



function PackagePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <h2>Package Management</h2>

      <div className="package-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "option" ? "active" : ""}
          onClick={() => setActiveTab("option")}
        >
          Option
        </button>
        <button
          className={activeTab === "review" ? "active" : ""}
          onClick={() => setActiveTab("review")}
        >
          Review
        </button>
      </div>
      <div className="package-content">
        {activeTab === "overview" && <Overview />}
        {activeTab === "option" && <Option />}
        {activeTab === "review" && <Review />}
      </div>
    </div>
  );
}

export default PackagePage;
