import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GuideManagement() {
  const [subTab, setSubTab] = useState("booking");
  const navigate = useNavigate();

  const goToBooking = () => {
    setSubTab("booking"); 
    navigate("/myprofile", { state: { activeTab: "bookings" } });
  };

  const goToProfile = () => {
    setSubTab("profile"); 
    navigate("/myprofile", { state: { activeTab: "profile" } });
  };

  return (
    <div>
      <h2>Guide Management</h2>

      {/* SubTabs */}
      <div className="guide-subtabs">
        <button
          className={subTab === "booking" ? "active" : ""}
          onClick={goToBooking}
        >
          Booking Management
        </button>
        <button
          className={subTab === "profile" ? "active" : ""}
          onClick={goToProfile}
        >
          Profile Management
        </button>
      </div>

      {/* SubContent */}
      <div className="guide-subcontent">
        {subTab === "booking" && (
          <div>
            <h3>Booking Management Section</h3>
            <p>Click the button above to manage traveler bookings in My Profile.</p>
          </div>
        )}
        {subTab === "profile" && (
          <div>
            <h3>Profile Management Section</h3>
            <p>Click the button above to manage guide profiles in My Profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuideManagement;
