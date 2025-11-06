import React from "react";
import UserSidebar from "../components/UserSidebar";
import "../styles/TravelerManagement.css";

function TravelerManagement() {
  return (
    <div className="traveler-management">
      {/* Left Sidebar */}
      <UserSidebar />

      {/* Right Content */}
      <section className="traveler-content">
        <h2>It’s a bit empty here</h2>
        <p>Tap the heart icon on an activity to save it</p>
        <button className="explore-btn">Start exploring</button>
      </section>
    </div>
  );
}

export default TravelerManagement;
