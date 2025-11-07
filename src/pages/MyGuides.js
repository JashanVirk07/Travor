import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MyGuidesSidebar from "../components/MyGuidesSidebar";
import GuideManagement from "./GuideManagement/GuideManagement";
import TourManagement from "./GuideManagement/TourManagement";
import StatsOverview from "./GuideManagement/StatsOverview";
import SettingsPanel from "./GuideManagement/SettingsPanel";
import PackageManagement from "./PackagePage/PackagePage";
import "../styles/MyGuides.css";

function MyGuides() {
  const [activeTab, setActiveTab] = useState("package"); 

  return (
    <div className="admin-management">
      <Navbar />
      <div className="admin-container">
        <MyGuidesSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <section className="admin-content">
          {activeTab === "guide" && <GuideManagement />}
          {activeTab === "package" && <PackageManagement />}
          {activeTab === "tour" && <TourManagement />}
          {activeTab === "stats" && <StatsOverview />}
          {activeTab === "settings" && <SettingsPanel />}
            
        </section>
      </div>
    </div>
  );
}

export default MyGuides;
