import React, { useEffect, useState } from "react";
import "../styles/settings.css";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";

function Settings() {

  const navigate = useNavigate();
  const location = useLocation();

  const [settings, setSettings] = useState({
    pushNotifications: false,
    language: "English"
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await API.get("/users/settings");
      setSettings(res.data.payload);
    } catch (err) {
      console.log("Could not load settings");
    }
  };

  const handleToggle = () => {
    setSettings({
      ...settings,
      pushNotifications: !settings.pushNotifications
    });
  };

  const handleLanguage = (e) => {
    setSettings({
      ...settings,
      language: e.target.value
    });
  };

  const saveSettings = async () => {
    try {
      await API.put("/users/settings", settings);
      alert("Settings updated!");
    } catch {
      alert("Update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
    <div className="navbar">
      <img src={logo} alt="logo" className="logo-img"/>
        <h2>SharedBalance</h2>

        <div className="menu">

          <span
            className={location.pathname === "/expenses" ? "active" : ""}
            onClick={() => navigate("/expenses")}
          >
            Expenses
          </span>

          <span
            className={location.pathname === "/history" ? "active" : ""}
            onClick={() => navigate("/history")}
          >
            History
          </span>

          <span
            className={location.pathname === "/profile" ? "active" : ""}
            onClick={() => navigate("/profile")}
          >
            Account
          </span>

        </div>
      </div>

    <div className="settings-page">

      {/* SIDEBAR */}
        <div className="sidebar">

          <div className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </div>

          <div className="menu-item" onClick={() => navigate("/profile")} >Profile</div>
          <div className="menu-item active" onClick={() => navigate("/settings")} >Settings</div>

          <button className="logout-btn" onClick={logout}>
            Log Out
          </button>

        </div>


      {/* Main Card */}

      <div className="settings-card">

        <div className="settings-header">

          <div className="settings-icon">⚙</div>

          <div>
            <h2>User Preferences</h2>
            <p>Adjust settings according to your liking</p>
          </div>

        </div>


        <div className="settings-row">

          <div className="settings-label">
            🔔 Push Notifications
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>

        </div>


        <div className="settings-row">

          <div className="settings-label">
            🌐 Language
          </div>

        </div>

        <select
          className="language-select"
          value={settings.language}
          onChange={handleLanguage}
        >
          <option>English</option>
          <option>Spanish</option>
          <option>Japanese</option>
          <option>Filipino</option>
        </select>

        <button className="save-settings" onClick={saveSettings}>
          Save Preferences
        </button>

      </div>

    </div>
  </>
  );
}

export default Settings;