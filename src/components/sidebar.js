import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ closeSidebar }) {

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        <h3>SharedBalance</h3>
        <button onClick={closeSidebar}>✕</button>
      </div>

      <div className="sidebar-menu">

        <div
          className={location.pathname === "/profile" ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          Profile
        </div>

        <div
          className={location.pathname === "/settings" ? "active" : ""}
          onClick={() => navigate("/settings")}
        >
          Settings
        </div>

        <div className="logout" onClick={logout}>
          Logout
        </div>

      </div>

    </div>
  );
}

export default Sidebar;