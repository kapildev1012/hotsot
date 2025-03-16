import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [profilePhoto, setProfilePhoto] = useState(assets.profile_icon);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="Logo" />
      </Link>
      <ul className="navbar-menu">
        <a
          href="/"
          onClick={() => setMenu("home")}
          className={`${menu === "home" ? "active" : ""}`}
        >
          Home
        </a>
        <a
          href="#food-display"
          onClick={() => setMenu("menu")}
          className={`${menu === "menu" ? "active" : ""}`}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mob-app")}
          className={`${menu === "mob-app" ? "active" : ""}`}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact")}
          className={`${menu === "contact" ? "active" : ""}`}
        >
          Contact Us
        </a>
      </ul>

      <div className="navbar-right">
        <Link to="/cart" className="navbar-search-icon">
          <img src={assets.basket_icon} alt="Cart" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={profilePhoto} alt="Profile" />
            <ul className="navbar-profile-dropdown">
              <li onClick={() => navigate("/profile")}>
                <p>My Profile</p>
              </li>
              <li>
                <label htmlFor="profilePhotoUpload">
                  <p>Upload Photo</p>
                </label>
                <input
                  type="file"
                  id="profilePhotoUpload"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  style={{ display: "none" }}
                />
              </li>
              <li onClick={() => navigate("/myorders")}>
                <p>My Orders</p>
              </li>
             
              <hr />
              <li onClick={logout}>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
