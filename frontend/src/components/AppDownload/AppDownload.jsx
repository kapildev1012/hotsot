import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For Better Experience Download <br />
        Tomato App
      </p>
      <div className="app-download-platforms">
        {/* Link to Play Store */}
        <a
          href="https://play.google.com/store/apps/details?id=com.tomatoapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={assets.play_store} alt="Google Play Store" />
        </a>
        {/* Link to App Store */}
        <a
          href="https://apps.apple.com/us/app/tomato-app/id1234567890"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={assets.app_store} alt="Apple App Store" />
        </a>
      </div>
    </div>
  );
};

export default AppDownload;
