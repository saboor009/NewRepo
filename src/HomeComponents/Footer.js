import React from "react";
import "./Footer.css"; // Import the updated CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h1>MEDEASE</h1>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><a href="#placeholder">About</a></li>
                <li><a href="#placeholder">Contact</a></li>
                <li><a href="#placeholder">What's New</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li><a href="#placeholder">Help Topics</a></li>
                <li><a href="#placeholder">FAQs</a></li>
                <li><a href="#placeholder">Report Violation</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><a href="#placeholder">Privacy Policy</a></li>
                <li><a href="#placeholder">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 All Rights Reserved Medease</p>
          <div className="footer-social">
            <a href="#placeholder"><i className="fab fa-facebook"></i></a>
            <a href="#placeholder"><i className="fab fa-twitter"></i></a>
            <a href="#placeholder"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
