import React, { useState, useEffect } from "react";
import "../../TravelerManagement.css";
import { mockBookings } from "../../mockData/BookingsData";

function BookingSection() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setBookings(mockBookings);
    }, 800);
  }, []);

  // Separate active and completed bookings
  const activeBookings = bookings.filter(
    (b) => b.status.toLowerCase() !== "completed"
  );
  const completedBookings = bookings.filter(
    (b) => b.status.toLowerCase() === "completed"
  );

  return (
    <div className="section-content">
      <h2 className="section-title">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>Loading bookings...</p>
        </div>
      ) : (
        <>
          {/* ---------- Active Bookings ---------- */}
          <h3 className="sub-section-title">Upcoming / Active Bookings</h3>
          {activeBookings.length > 0 ? (
            <div className="booking-list">
              {activeBookings.map((b, i) => (
                <div key={i} className="booking-card">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="booking-image"
                  />
                  <div className="booking-info">
                    <h3>{b.title}</h3>
                    <p>{b.date}</p>
                    <p className={`status status-${b.status.toLowerCase()}`}>
                      {b.status}
                    </p>
                    <button className="details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No active bookings right now.</p>
          )}

          {/* ---------- Completed Bookings ---------- */}
          <h3 className="sub-section-title completed-title">
            Completed Bookings
          </h3>
          {completedBookings.length > 0 ? (
            <div className="booking-list completed-booking-list">
              {completedBookings.map((b, i) => (
                <div key={i} className="booking-card completed-card">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="booking-image"
                  />
                  <div className="booking-info">
                    <h3>{b.title}</h3>
                    <p>{b.date}</p>
                    <p className={`status status-${b.status.toLowerCase()}`}>
                      {b.status}
                    </p>
                    <button className="details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No completed bookings yet.</p>
          )}
        </>
      )}
    </div>
  );
}

export default BookingSection;
