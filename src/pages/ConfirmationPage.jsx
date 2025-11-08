import React from "react";
import Navbar from "../components/Navbar";
import "../styles/ConfirmationPage.css";

function ConfirmationPage() {
  return (
    <div className="confirmation-page">
      <Navbar />

      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">✅</div>

          <h2 className="confirmation-title">Booking Confirmed!</h2>
          <p className="confirmation-subtitle">
            Your reservation has been successfully confirmed.  
            A confirmation email has been sent to <strong>j.doe@email.com</strong>.
          </p>

          <div className="booking-summary">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> TRV-82345</p>
            <p><strong>Tour:</strong> Vancouver City 4HRS Walking Tour</p>
            <p><strong>Date:</strong> January 15, 2025</p>
            <p><strong>Payment:</strong> Visa •••• 4442</p>
            <p><strong>Total:</strong> CAD $89.00</p>
          </div>

          <div className="confirmation-actions">
            <button className="primary-btn">View My Bookings</button>
            <button className="secondary-btn">Go to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
