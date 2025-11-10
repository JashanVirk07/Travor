import React, { useState } from "react";
import Navbar from "../components/Navbar";
import MyGuidesSidebar from "../components/MyGuidesSidebar";
import GuideManagement from "./GuideManagement";
import TourManagement from "./TourManagement";
import StatsOverview from "./StatsOverview";
import SettingsPanel from "./SettingsPanel";
import PackageManagement from "./PackagePage";
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
