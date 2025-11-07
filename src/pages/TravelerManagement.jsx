import React, { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import "../styles/TravelerManagement.css";
import Navbar from "../components/Navbar";

function TravelerManagement() {
  const [activeTab, setActiveTab] = useState("wishlist");

  return (
     
    <div className="traveler-management">
        <Navbar />
        <div class="traveler-displaychoice">
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <section className="traveler-content">
        {activeTab === "bookings" && <h2>Bookings Section</h2>}
        {activeTab === "reviews" && <h2>Reviews Section</h2>}
        {activeTab === "payments" && <h2>Payment Methods</h2>}
        {activeTab === "participants" && <h2>Participant Details</h2>}
        {activeTab === "chatbox" && <h2>Chat here</h2>}
        {activeTab === "wishlist" && (
          <>
            <h2>It’s a bit empty here</h2>
            <p>Tap the heart icon on an activity to save it</p>
            <button className="explore-btn">Start exploring</button>
          </>
        )}
        {activeTab === "login" && <h2>Login Methods</h2>}
        {activeTab === "settings" && <h2>Settings</h2>}
      </section>
      </div>
    </div>
  );
}

export default TravelerManagement;
