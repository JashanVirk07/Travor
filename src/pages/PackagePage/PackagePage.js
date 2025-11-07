import React, { useState } from "react";
import Overview from "./Overview";
import Option from "./Option";
import Review from "./Review";
import "./PackagePage.css";

function PackagePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showTabs, setShowTabs] = useState(false);

  return (
    <div
      className="package-page"
      onMouseEnter={() => setShowTabs(true)}
      onMouseLeave={() => setShowTabs(false)}
    >

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-info">
          <h1>Day Tour</h1>
          <p>Discover the best of Vancouver with this guided experience!</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`tabs ${showTabs ? "visible" : ""}`}>
        {["overview", "option", "review"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Render Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && <Overview />}
        {activeTab === "option" && <Option />}
        {activeTab === "review" && (
          <Review
            comment={comment}
            setComment={setComment}
            rating={rating}
            setRating={setRating}
          />
        )}
      </div>
    </div>
  );
}

export default PackagePage;
