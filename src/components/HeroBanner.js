import React from "react";
import "../styles/HeroBanner.css";

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-overlay">
        <h1>Discover Your Next Adventure</h1>
        <p>Book unforgettable experiences around the world.</p>
        <div className="hero-search">
          <input type="text" placeholder="Search destination or activity..." />
          <button>Search</button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
