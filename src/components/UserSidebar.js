import React, { useRef, useState } from "react";
import "../styles/UserSidebar.css";

function UserSidebar({ activeTab, setActiveTab }) {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("/avatar.png");

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const menuItems = [
    { key: "bookings", label: "Bookings", icon: "📘" },
    { key: "reviews", label: "Reviews", icon: "💭" },
    { key: "payments", label: "Payment methods", icon: "💳" },
    { key: "participants", label: "Participant details", icon: "👤" },
    { key: "chatbox", label: "Chat box", icon: "💬" },
    { key: "wishlist", label: "Wishlist", icon: "❤️" },
    { key: "login", label: "Login methods", icon: "🔐" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <section className="userSidebar">
      {/* Profile header */}
      <div className="userSideHead">
        <div className="profile-photo" onClick={handleImageClick}>
          <img src={profileImage} alt="User Profile" />
          <div className="upload-overlay">Upload</div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <h3 className="username">Travor User</h3>
        <button className="update-btn">Update personal info</button>
      </div>

      {/* Menu list */}
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={activeTab === item.key ? "active" : ""}
            onClick={() => setActiveTab(item.key)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default UserSidebar;
