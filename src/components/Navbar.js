import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">Travor</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/destinations">Destinations</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      <div className="nav-buttons">
        <button className="login-btn">Login</button>
        <button className="register-btn">Register</button>
      </div>
    </nav>
  );
}

export default Navbar;
