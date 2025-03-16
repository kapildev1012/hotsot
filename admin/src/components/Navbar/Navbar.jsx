import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdminLoggedIn");
    setIsLoggedIn(adminStatus === "true");
  }, []);

  // Handle login
  const handleLogin = () => {
    const adminPassword = prompt("Enter Admin Password:");
    if (adminPassword === "admin123") {
      // Replace with your secure password validation
      localStorage.setItem("isAdminLoggedIn", "true");
      setIsLoggedIn(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid password");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="Logo" />
      <div className="auth-actions">
        {isLoggedIn ? (
          <>
            <img className="profile" src={assets.profile_image} alt="Profile" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            Admin Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
