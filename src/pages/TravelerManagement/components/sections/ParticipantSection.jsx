import React, { useState, useEffect } from "react";
import "../../TravelerManagement.css";
import {mockParticipants} from "../../mockData/ParticipantsData";

function ParticipantSection() {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // simulate API fetch delay
    setTimeout(() => {
      setParticipants(mockParticipants);
    }, 800);
  }, []);

  return (
    <div className="section-content">
      <h2 className="section-title">Participant Details</h2>

      {participants.length === 0 ? (
        <div className="empty-state">
          <p>Loading participant data...</p>
        </div>
      ) : (
        <div className="participant-table-wrapper">
          <table className="participant-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Trip</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>{p.trip}</td>
                  <td>
                    <span
                      className={`role-badge ${
                        p.role.toLowerCase() === "organizer"
                          ? "role-organizer"
                          : "role-traveler"
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div class="addParticipantButt">
          <button className="add-card-btn">+ Add Participant</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantSection;
