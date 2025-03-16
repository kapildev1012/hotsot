import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, url, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");
  const [forgotPassword, setForgotPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [resetEmail, setResetEmail] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    let new_url = url;
    if (currState === "Login") {
      new_url += "/api/user/login";
    } else {
      new_url += "/api/user/register";
    }

    const response = await axios.post(new_url, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      loadCartData({ token: response.data.token });
      setShowLogin(false);
    } else {
      toast.error(response.data.message);
    }
  };

  const onForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, {
        email: resetEmail,
      });

      if (response.data.success) {
        toast.success("Reset link sent to your email!");
        setForgotPassword(false); // Return to login view
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to send reset link. Try again.");
    }
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={forgotPassword ? onForgotPassword : onLogin}
        className="login-popup-container"
      >
        <div className="login-popup-header">
          <h2>
            {forgotPassword
              ? "Forgot Password"
              : currState === "Login"
              ? "Log In"
              : "Sign Up"}
          </h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        {forgotPassword ? (
          <>
            <div className="login-popup-inputs">
              <input
                name="resetEmail"
                onChange={(e) => setResetEmail(e.target.value)}
                value={resetEmail}
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="login-popup-btn">
              Send Reset Link
            </button>
            <p onClick={() => setForgotPassword(false)}>Back to Login</p>
          </>
        ) : (
          <>
            <div className="login-popup-inputs">
              {currState === "Sign Up" && (
                <input
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  placeholder="Your Name"
                  required
                />
              )}
              <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Your Email"
                required
              />
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="login-popup-btn">
              {currState === "Login" ? "Login" : "Create Account"}
            </button>

            {currState === "Login" && (
              <p
                className="forgot-password-link"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </p>
            )}

            <div className="login-popup-condition">
              <input type="checkbox" id="terms-checkbox" required />
              <p>
                By continuing, I agree to the Terms of Use & Privacy Policy.
              </p>
            </div>

            {currState === "Login" ? (
              <p>
                Don't have an account?{" "}
                <span onClick={() => setCurrState("Sign Up")}>Sign up now</span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span onClick={() => setCurrState("Login")}>Log in here</span>
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
