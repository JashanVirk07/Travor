import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>TravelGuide</h3>
        <p>Explore. Plan. Discover.</p>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/destinations">Destinations</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-contact">
          <p>Email: info@travelguide.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} TravelGuide | All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
