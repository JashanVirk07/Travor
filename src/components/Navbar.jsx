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
         <li><a href="/SearchGuides">Search Guide</a></li>
          <li><a href="/myguides">My Guides</a></li>
        <li><a href="/myprofile">My profile</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      <div className="nav-buttons">
         <Link to="/login"> 
            <button className="login-btn">Login</button>
        </Link>
        <Link to="/register">
            <button className="register-btn">Register</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
