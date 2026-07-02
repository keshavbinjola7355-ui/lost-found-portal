import React from "react";
import logo from "../images/screen.png";
import { Info, Globe } from "lucide-react";
import "../style/Footer.css"

const Footer = () => {
  return (
    <>
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="logo">
            <img src={logo} alt="logo" />
            <h3>COLLEGE LOST & FOUND</h3>
          </div>

          <p>
            Building institutional trust through a seamless, secure, and
            community-driven lost and found network for our campus.
          </p>
        </div>

        <div className="footer-middle">
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>Report Lost</p>
          <p>Report Found</p>
        </div>

        <div className="footer-right">
          <h4>SUPPORT</h4>

          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>Campus Safety</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 College Lost & Found. All rights reserved.</p>

        <div className="footer-icons">
          <Info size={16} />
          <Globe size={16} />
        </div>
      </div>
      </footer>
    </>
  );
};

export default Footer;
