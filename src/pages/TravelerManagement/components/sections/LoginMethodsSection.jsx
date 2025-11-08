import React, { useState, useEffect } from "react";
import "../../TravelerManagement.css";
import {mockLoginMethods} from "../../mockData/LoginMethodsData";

function LoginMethodsSection() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setMethods(mockLoginMethods);
    }, 600);
  }, []);

  const handleUnlink = (id) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const handleAddMethod = () => {
    alert("Feature under development: add new login method.");
  };

  return (
    <div className="section-content">
      <h2 className="section-title">Login Methods</h2>

      {methods.length === 0 ? (
        <div className="empty-state">
          <p>No login methods linked yet.</p>
          <button className="primary-btn" onClick={handleAddMethod}>
            Add Login Method
          </button>
        </div>
      ) : (
        <div className="login-methods-list">
          {methods.map((method) => (
            <div key={method.id} className="login-method-card">
              <div className="login-method-icon">
                <img src={method.icon} alt={method.type} />
              </div>

              <div className="login-method-info">
                <h3>{method.type}</h3>
                <p>{method.detail}</p>
                {method.default && (
                  <span className="default-tag">Default</span>
                )}
              </div>

              <div className="login-method-actions">
                {method.removable ? (
                  <button
                    className="remove-btn"
                    onClick={() => handleUnlink(method.id)}
                  >
                    Unlink
                  </button>
                ) : (
                  <span className="locked-tag">Required</span>
                )}
              </div>
            </div>
          ))}
          <button className="add-method-btn" onClick={handleAddMethod}>
            + Add Another Login Method
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginMethodsSection;
