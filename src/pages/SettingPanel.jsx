import React, { useState, useRef } from "react";
import "../styles/MyGuides.css";

function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("profile");

  
  const [licenseFiles, setLicenseFiles] = useState([]);
  const [certificateFiles, setCertificateFiles] = useState([]);

  // file input refs
  const licenseInputRef = useRef(null);
  const certificateInputRef = useRef(null);

  
  const handleLicenseClick = () => licenseInputRef.current.click();
  const handleCertificateClick = () => certificateInputRef.current.click();

  
  const handleLicenseUpload = (e) => {
    const files = Array.from(e.target.files);
    setLicenseFiles(files);
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    setCertificateFiles(files);
  };

  return (
    <div className="settings-panel my-guides-page">
      <h2>Settings Panel</h2>

      {/* Tabs */}
      <div className="guide-subtabs">
        {["profile", "notifications", "privacy", "appearance"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="profile-section">
            <h3>Profile Settings</h3>

            {/* Upload Guide License */}
            <div className="button-with-info">
              <button
                type="button"
                className="my-guides-page button"
                onClick={handleLicenseClick}
              >
                Upload Guide License
              </button>
              <input
                type="file"
                ref={licenseInputRef}
                style={{ display: "none" }}
                onChange={handleLicenseUpload}
                multiple
              />
              {licenseFiles.length > 0 && (
                <div className="info-box">
                  {licenseFiles.map((file, idx) => (
                    <div key={idx}>{file.name}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Certificate */}
            <div className="button-with-info" style={{ marginTop: "15px" }}>
              <button
                type="button"
                className="my-guides-page button"
                onClick={handleCertificateClick}
              >
                Upload Certificate
              </button>
              <input
                type="file"
                ref={certificateInputRef}
                style={{ display: "none" }}
                onChange={handleCertificateUpload}
                multiple
              />
              {certificateFiles.length > 0 && (
                <div className="info-box">
                  {certificateFiles.map((file, idx) => (
                    <div key={idx}>{file.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div>
            <h3>Notifications Settings</h3>
            <p>Enable or disable email and push notifications.</p>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div>
            <h3>Privacy Settings</h3>
            <p>Manage who can see your information and activity.</p>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div>
            <h3>Appearance Settings</h3>
            <p>Switch themes, adjust font size, or toggle dark/light mode.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPanel;
