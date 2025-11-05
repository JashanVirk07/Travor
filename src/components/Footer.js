import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <h3>Travor</h3>
          <p>Your travel companion for discovering local experiences.</p>
        </div>
        <ul>
          <li>About</li>
          <li>Careers</li>
          <li>Contact</li>
          <li>Blog</li>
        </ul>
      </div>
      <p className="footer-bottom">© 2025 Travor. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
