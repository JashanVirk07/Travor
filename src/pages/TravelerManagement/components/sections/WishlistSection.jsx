import React, { useState, useEffect } from "react";
import "../../TravelerManagement.css";
import { mockWishlist } from "../../mockData/WishlistData";

function WishlistSection() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // simulate API loading
    setTimeout(() => {
      setWishlist(mockWishlist);
    }, 800);
  }, []);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="section-content">
      <h2 className="section-title">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty. Start exploring and save your favorite trips!</p>
          <button className="explore-btn">Start Exploring</button>
        </div>
      ) : (
        <div className="booking-list">
          {wishlist.map((item) => (
            <div key={item.id} className="booking-card">
              <img
                src={item.image}
                alt={item.title}
                className="booking-image"
              />
              <div className="booking-info">
                <h3>{item.title}</h3>
                <p>{item.location}</p>
                <p className="status wishlist-price">${item.price}</p>
                <div className="wishlist-actions">
                  <button className="details-btn">View Details</button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistSection;
