import React, { useState, useEffect } from "react";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Cart from "./pages/Cart/Cart";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import MyOrders from "./pages/MyOrders/MyOrders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import Profile from "./pages/Profile/Profile"; // ✅ Import the Profile component

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <ToastContainer />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/profile" element={<Profile />} />{" "}
          {/* ✅ New Profile Route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
