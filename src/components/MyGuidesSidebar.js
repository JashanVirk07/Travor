import React from "react";
import "../styles/UserSidebar.css";

function MyGuidesSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { key: "guide", label: "Guide Management", icon: "🧑‍✈️" },
    { key: "package", label: "Package Management", icon: "📦" },
    { key: "tour", label: "Tour Management", icon: "🗺️" },
    { key: "stats", label: "Stats Overview", icon: "📊" },
    { key: "settings", label: "Settings Panel", icon: "⚙️" },
  ];

  return (
    <section className="my-guides-sidebar">
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

export default MyGuidesSidebar;
