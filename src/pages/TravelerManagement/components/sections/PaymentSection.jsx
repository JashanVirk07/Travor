import React, { useState, useEffect } from "react";
import "../../TravelerManagement.css";
import {mockPayments} from "../../mockData/PaymentsData";


function PaymentSection() {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCard, setNewCard] = useState({
    type: "Visa",
    cardNumber: "",
    holder: "",
    expiry: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setPayments(mockPayments);
    }, 800);
  }, []);

  // Open modal
  const handleAddCard = () => setShowModal(true);

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNewCard({ type: "Visa", cardNumber: "", holder: "", expiry: "" });
  };

  // Submit new card
  const handleSaveCard = () => {
    if (!newCard.cardNumber || !newCard.holder || !newCard.expiry) {
      alert("Please fill all fields before saving.");
      return;
    }

    const last4 = newCard.cardNumber.slice(-4);
    const masked = `**** **** **** ${last4}`;

    const newEntry = {
      id: payments.length + 1,
      ...newCard,
      cardNumber: masked,
      isDefault: false,
    };

    setPayments([...payments, newEntry]);
    handleCloseModal();
  };

  return (
    <div className="section-content">
      <h2 className="section-title">Payment Methods</h2>

      {payments.length === 0 ? (
        <div className="empty-state">
          <p>Loading payment methods...</p>
        </div>
      ) : (
        <div className="payment-list">
          {payments.map((p) => (
            <div key={p.id} className="payment-card">
              <div className="card-header">
                <span className="card-type">{p.type}</span>
                {p.isDefault && <span className="default-tag">Default</span>}
              </div>
              <div className="card-body">
                <p className="card-number">{p.cardNumber}</p>
                <p className="card-holder">{p.holder}</p>
                <p className="card-expiry">Exp: {p.expiry}</p>
              </div>
            </div>
          ))}

          <button className="add-card-btn" onClick={handleAddCard}>
            + Add New Card
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Card</h3>
            <label>
              Card Type:
              <select
                value={newCard.type}
                onChange={(e) =>
                  setNewCard({ ...newCard, type: e.target.value })
                }
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
              </select>
            </label>

            <label>
              Card Number:
              <input
                type="text"
                placeholder="Enter card number"
                value={newCard.cardNumber}
                onChange={(e) =>
                  setNewCard({ ...newCard, cardNumber: e.target.value })
                }
              />
            </label>

            <label>
              Cardholder Name:
              <input
                type="text"
                placeholder="Enter name"
                value={newCard.holder}
                onChange={(e) =>
                  setNewCard({ ...newCard, holder: e.target.value })
                }
              />
            </label>

            <label>
              Expiry Date:
              <input
                type="text"
                placeholder="MM/YY"
                value={newCard.expiry}
                onChange={(e) =>
                  setNewCard({ ...newCard, expiry: e.target.value })
                }
              />
            </label>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSaveCard}>
                Save Card
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentSection;
