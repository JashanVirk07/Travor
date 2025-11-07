import React, { useState } from "react";
import "./PackagePage.css"; 

function Review() {
  
  const [reviews, setReviews] = useState([
    { user: "Anna", text: "Amazing tour! Totally worth it.", rating: 5 },
    { user: "John", text: "Great guide and comfortable bus.", rating: 4 },
  ]);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const addReview = () => {
    if (comment.trim() === "" || rating === 0) return;
    setReviews([...reviews, { user: "You", text: comment, rating }]);
    setComment("");
    setRating(0);
  };

  return (
    <div className="review-section">
      <h2>Customer Reviews</h2>

      {/* 星星評價 + 輸入框 */}
      <div className="review-input">
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? "filled" : ""}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={addReview}>Add</button>
      </div>

     
      {reviews.map((r, i) => (
        <div key={i} className="review-card">
          <h4>{r.user}</h4>
          <p>{r.text}</p>
          <div className="stars">⭐️ {r.rating}/5</div>
        </div>
      ))}
    </div>
  );
}

export default Review;
