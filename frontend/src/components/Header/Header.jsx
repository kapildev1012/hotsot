import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      {/* Video Background */}
      <video className="video-background" autoPlay loop muted>
        <source src="/header.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Decorative Overlay */}
      <div className="overlay"></div>

      {/* Header Content */}
      <div className="header-contents">
        <h2 className="animated-title">ORDER YOUR FAV FOOD!</h2>
        <p className="animated-text"></p>

        {/* Offer Section */}
        <div className="shop-details">
          <div className="offer">
            <p className="celebration-message">
              Special Offer: 20% Off Today!
            </p>
          </div>
          <div className="contact-info">
            <p className="business-hours">Mon-Sun: 9:00 AM - 9:00 PM</p>
            <p className="contact-number">+1 234 567 890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
