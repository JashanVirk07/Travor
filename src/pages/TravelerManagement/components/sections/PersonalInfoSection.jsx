import React, { useState, useRef } from "react";
import "../../TravelerManagement.css";

function PersonalInfoSection() {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("/avatars/avatar.png");

  const [info, setInfo] = useState({
    fullName: "Jane Doe",
    email: "j.doe@example.com",
    phone: "+1 923-334-5517",
    country: "Canada",
  });

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="section-content">
      <h2 className="section-title">Update Personal Information</h2>

      <div className="personal-info-container">
        {/* Profile Picture */}
        <div className="profile-photo-large" onClick={handleImageClick}>
          <img src={profileImage} alt="Profile" />
          <div className="upload-overlay">Change Photo</div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* Form Fields */}
        <div className="personal-info-form">
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              value={info.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={info.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number
            <input
              type="text"
              name="phone"
              value={info.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Country
            <select
              name="country"
              value={info.country}
              onChange={handleChange}
            >
              <option>Canada</option>
              <option>United States</option>
              <option>Thailand</option>
              <option>Japan</option>
              <option>France</option>
            </select>
          </label>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoSection;
