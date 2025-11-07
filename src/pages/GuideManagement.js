import React, { useState } from "react";

function GuideManagement() {
  const [subTab, setSubTab] = useState("booking");

  return (
    <div>
      <h2>Guide Management</h2>

     
      <div className="guide-subtabs">
        <button
          className={subTab === "booking" ? "active" : ""}
          onClick={() => setSubTab("booking")}
        >
          Booking Management
        </button>
        <button
          className={subTab === "profile" ? "active" : ""}
          onClick={() => setSubTab("profile")}
        >
          Profile Management
        </button>
      </div>

      
      <div className="guide-subcontent">
        {subTab === "booking" && (
          <div>
            <h3>Booking Management Section</h3>
            <p>Manage traveler bookings here.</p>
          </div>
        )}
        {subTab === "profile" && (
          <div>
            <h3>Profile Management Section</h3>
            <p>Manage guide profiles here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuideManagement;
