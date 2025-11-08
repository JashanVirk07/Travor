import React, { useState } from "react";
import UserSidebar from "./components/UserSidebar.jsx";
import Navbar from "../../components/Navbar";
import "./TravelerManagement.css";
import { 
  BookingSection,
  ReviewSection,
  PaymentSection,
  ParticipantSection,
  ChatBoxSection,
  WishlistSection,
  LoginMethodsSection,
  SettingsSection,
  PersonalInfoSection
} from "./components/sections"; 

function TravelerManagement() {
  const [activeTab, setActiveTab] = useState("wishlist");

  return (
     
    <div className="traveler-management">
        <Navbar />
        <div class="traveler-displaychoice">
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <section className="traveler-content">
        {activeTab === "bookings" && <BookingSection />}
        {activeTab === "reviews" && <ReviewSection />}
        {activeTab === "payments" && <PaymentSection />}
        {activeTab === "participants" && <ParticipantSection />}
        {activeTab === "chatbox" && <ChatBoxSection />}
        {activeTab === "wishlist" && <WishlistSection/>}
        {activeTab === "login" && <LoginMethodsSection/>}
        {activeTab === "settings" && <SettingsSection/>}
        {activeTab === "personal" && <PersonalInfoSection/>} 
      </section>
      </div>
    </div>
  );
}

export default TravelerManagement;
