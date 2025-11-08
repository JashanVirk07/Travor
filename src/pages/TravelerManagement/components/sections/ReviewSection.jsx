import React, { useState, useEffect } from "react";
import "../../TravelerManagement.css";
import { mockReviews } from "../../mockData/ReviewsData";

function ReviewSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setReviews(mockReviews);
    }, 800);
  }, []);

  return (
    <div className="section-content">
      <h2 className="section-title">My Reviews </h2>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>Loading reviews...</p>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h3>{review.destination}</h3>
                <p className="review-date">{review.date}</p>
              </div>
              <div className="review-rating">
                {"⭐".repeat(review.rating)}{" "}
                <span className="rating-number">({review.rating}/5)</span>
              </div>
              <p className="review-comment">“{review.comment}”</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
