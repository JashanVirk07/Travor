import React, { useRef, useState } from "react";
import "../styles/UserSidebar.css";

function UserSidebar() {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);

  // Handle file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle new photo upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  return (
    <section className="userSidebar">
      <div className="userSideHead">
        <div className="profile-photo" onClick={handleImageClick}>
          <img
            src={profileImage || "/avatar.png"} // default placeholder
            alt="User Profile"
          />
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
    </section>
  );
}

export default UserSidebar;
