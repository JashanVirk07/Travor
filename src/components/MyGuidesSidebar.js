import React, { useRef, useState } from "react";
import "../styles/UserSidebar.css";

function MyGuidesSidebar({ activeTab, setActiveTab }) {
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
    { key: "guide", label: "Guide Management", icon: "🧑‍✈️" },
    { key: "package", label: "Package Management", icon: "📦" },
  ];

  return (
    <section className="MyGuidesSidebar">
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
export default DestinationsSidebar;