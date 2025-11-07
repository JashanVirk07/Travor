import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MyGuidesSidebar from "../components/MyGuidesSidebar";
import GuideManagement from "../pages/GuideManagement";
import PackagePage from "../pages/PackagePage/PackagePage";


function MyGuides() {
  const [activeTab, setActiveTab] = useState("guide");

  return (
    <div className="admin-management">
      <Navbar />
      <div className="admin-container" style={{ display: "flex" }}>
        
        <DestinationsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        
        <section className="admin-content" style={{ flex: 1, padding: "20px" }}>
          {activeTab === "guide" && <GuideManagement />}
          {activeTab === "package" && <PackagePage />}
          {activeTab === "tour" && <h2>Tour Management Section</h2>}
          {activeTab === "stats" && <h2>Stats Overview</h2>}
          {activeTab === "settings" && <h2>Settings Panel</h2>}
        </section>
      </div>
    </div>
  );
}

export default MyGuides;