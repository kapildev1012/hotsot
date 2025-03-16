import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <Link to="/">
            <img src={assets.logo} alt="Tomato Logo" />
          </Link>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </p>
          <div className="footer-social-icons">
            <a
              href="https://www.facebook.com/hotspot103030/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">About us</Link>
            </li>
            <li>
              <Link to="/cart">Delivery</Link>
            </li>
            <li>
              <Link to="/">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>
              <a href="tel:+12124567890">+1-212-456-7890</a>
            </li>
            <li>
              <a href="mailto:contact@tomato.com">contact@tomato.com</a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © Hotspot.com - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
