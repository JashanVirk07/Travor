import React from "react";

function Option() {
  return (
    <div className="option-section">
      <h2>Package Options</h2>
      <div className="option-card">
        <h3>Standard Package</h3>
        <p>Includes guided tour, transport, and entrance tickets.</p>
        <span className="price">$89 CAD</span>
        <button className="book-btn">Book Now</button>
      </div>

      <div className="option-card">
        <h3>Premium Package</h3>
        <p>Includes lunch, premium seats, and souvenir photos.</p>
        <span className="price">$129 CAD</span>
        <button className="book-btn">Book Now</button>
      </div>
    </div>
  );
}

export default Option;
