import React, { useState } from "react";
import "../../TravelerManagement.css";

function SettingsSection() {
  const [settings, setSettings] = useState({
    notifications: true,
    sms: false,
    language: "English",
    currency: "CAD",
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
  };

  const handleDeactivate = () => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate your account?"
    );
    if (confirmDeactivate) {
      alert("Your account has been deactivated temporarily.");
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "⚠️ This action cannot be undone. Delete your account permanently?"
    );
    if (confirmDelete) {
      alert("Your account has been deleted.");
    }
  };

  return (
    <div className="section-content">
      <h2 className="section-title">Account Settings</h2>

      <div className="settings-container">
        {/* Notification preferences */}
        <div className="settings-card">
          <h3>Notifications</h3>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleToggle("notifications")}
            />
            <span>Email Notifications</span>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.sms}
              onChange={() => handleToggle("sms")}
            />
            <span>SMS Notifications</span>
          </label>
        </div>

        {/* Language & currency */}
        <div className="settings-card">
          <h3>Preferences</h3>
          <label>
            Language:
            <select
              value={settings.language}
              onChange={(e) => handleSelect("language", e.target.value)}
            >
              <option>English</option>
              <option>Français</option>
              <option>ไทย</option>
              <option>中文</option>
              <option>日本語</option>
            </select>
          </label>

          <label>
            Currency:
            <select
              value={settings.currency}
              onChange={(e) => handleSelect("currency", e.target.value)}
            >
              <option>CAD</option>
              <option>USD</option>
              <option>THB</option>
              <option>JPY</option>
              <option>EUR</option>
            </select>
          </label>
        </div>

        {/* Account management */}
        <div className="settings-card danger-zone">
          <h3>Account Management</h3>
          <p>Manage your account privacy and access options below.</p>

          <div className="settings-actions">
            <button className="save-btn" onClick={handleSave}>
              Save Settings
            </button>
            <button className="deactivate-btn" onClick={handleDeactivate}>
              Deactivate Account
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;
