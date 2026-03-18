import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import logo from "../asset/logo.png"

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
          <div className="feature-icon"></div>
          <p>
            Easily split bills with friends and family after trips,
            dinners, or shared expenses.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"></div>
          <p>
            Track who paid and who owes in one simple dashboard
            without manual calculations.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"></div>
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