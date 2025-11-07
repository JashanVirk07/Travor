import React, { useState } from "react";
import Navbar from "../components/Navbar";
import PackageSidebar from "../components/PackageSidebar";
import "../styles/PackageManagement.css";

function PackagePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="package-management">
      <Navbar />

      <div className="package-display">
        {/* 左邊 Sidebar */}
        <PackageSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 右邊主內容 */}
        <section className="package-content">
          {activeTab === "overview" && (
            <>
              <h2>Overview</h2>
              <p>
                This package includes a full-day tour with local experiences,
                lunch, and a guide. Explore the city’s best spots in comfort.
              </p>
            </>
          )}

          {activeTab === "option" && (
            <>
              <h2>Options</h2>
              <ul>
                <li>Private pickup — $20</li>
                <li>Lunch upgrade — $15</li>
                <li>Extended tour — $30</li>
              </ul>
            </>
          )}

          {activeTab === "review" && (
            <>
              <h2>Reviews</h2>
              <div className="review-card">
                <strong>Anna</strong>
                <p>★★★★★ — Loved every moment!</p>
              </div>
              <div className="review-card">
                <strong>David</strong>
                <p>★★★★☆ — Great experience overall.</p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default PackagePage;
