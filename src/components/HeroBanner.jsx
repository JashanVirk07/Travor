import React from "react";
import "../styles/HeroBanner.css";

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-overlay">
        <h1>Connect with Verified Local guides</h1>
        <p>Book authentic experiences led by the people who know it best.</p>
        <div className="hero-search">
          <input type="text" placeholder="Search destination or Guide" />
          <button>Search</button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
