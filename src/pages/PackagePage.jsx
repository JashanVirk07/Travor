import React, { useState } from "react";
import Overview from "./Overview";
import Option from "./Option";
import Review from "./Review";
import "../PackagePage.css";

const PackagePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showTabs, setShowTabs] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "option", label: "Option" },
    { id: "review", label: "Review" },
  ];

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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
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
};

export default PackagePage;
