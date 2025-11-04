import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover the World with TravelGuide 🌍</h1>
        <p>Explore breathtaking destinations, plan trips, and make memories.</p>

        {/* Buttons */}
        <div className="hero-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>

        <p className="subtext">
          Join thousands of travelers discovering amazing places around the globe.
        </p>
      </div>
    </section>
  );
}

export default Hero;
