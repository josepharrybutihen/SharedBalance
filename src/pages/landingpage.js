import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import logo from "../asset/logo.png"
import assets from "../asset/assets.png";
import teamwork from "../asset/teamwork.png";
import bill from "../asset/bill.png";

function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="landing-page">

      <div className="landing-header">

        <div className="logo-section">
          <img
            src={logo}
            alt="logo"
            className="logo-img"
            />
          <h2 className="logo-text">SharedBalance</h2>
        </div>

        <div className="nav-links">
          <span onClick={() => navigate("/login")}>Log in</span>
          <span onClick={() => navigate("/register")}>Sign up</span>
        </div>

      </div>


      {/* HERO SECTION */}
      <div className="hero-section">

        <h1>
          Share moments, not <br /> money worries.
        </h1>

        <p>Track together. Settle fairly.</p>

        <button
          className="get-btn"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>

      </div>


      {/* FEATURES */}
      <div className="features">

        <div className="feature-card">
          <div className="feature-icon">
          <img src={bill} alt="Split bills" />
          </div>
          <p>
            Easily split bills with friends and family after trips,
            dinners, or shared expenses.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
          <img src={assets} alt="Split bills" />
          </div>
          <p>
            Track who paid and who owes in one simple dashboard
            without manual calculations.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
          <img src={teamwork} alt="Split bills" />
          </div>
          <p>
            Keep your group finances transparent and settle
            payments fairly.
          </p>
        </div>

      </div>

    </div>
  );
}

export default LandingPage;