// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./leftbar.css";
import logoShort from "/logoShort.png";


const LeftBar = () => {
  const location = useLocation().pathname

  return (
    <div className="sidebar1">
      <div className="logo-container">
        <img src={logoShort} alt="Logo" className="logo" />
      </div>
      <div className="menu">
        <Link to="../admin" className={`menu-item ${location === '/admin' && 'menu-item-active'}`}>
          {/* <FontAwesomeIcon icon="fa-solid fa-fan" className="icon"/> */}
          <span>Dashboard</span>
        </Link>
        {/* <Link to="../admin" className="menu-item">
          <span>All Courses</span>
        </Link> */}
        <Link to="../admin/users" className={`menu-item ${location === '/admin/users' && 'menu-item-active'}`}>
          {/* <FontAwesomeIcon icon={"faSignOutAlt"} className="icon" /> */}
          <span>Users</span>
        </Link>
        <Link to="../admin/tests" className={`menu-item ${location === '/admin/tests' && 'menu-item-active'}`}>
          {/* <FontAwesomeIcon icon={"faSignOutAlt"} className="icon" /> */}
          <span>Tests</span>
        </Link>
        <Link to="/" className="menu-item">
          {/* <FontAwesomeIcon icon={"faSignOutAlt"} className="icon" /> */}
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftBar;