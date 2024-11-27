import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";
import "./TopBar.css";
import dp from "../Assets/Images/profileImage.jpeg";

const TopBar = () => {
  const user = "Robert Fox";

  return (
    <div className="top-bar">
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input type="text" placeholder="Search for class, task, etc." />
      </div>
      <div className="user-info">
        <img src={dp} alt="User Avatar" className="user-avatar" />
        <div className="user-text">
          <span className="welcome-text">Welcome back</span>
          <span className="user-name">{user}</span>
        </div>
        <div className="notification-icon">
          <FontAwesomeIcon icon={faBell} />
          <span className="notification-dot"></span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
