import React, { useEffect, useState } from "react";
import "../styles/history.css";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";

function History() {

  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/expenses/history");
      setTransactions(res.data.payload);
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  return (
    <>
    <div className="navbar">
      <img src={logo} alt="logo" className="logo-img"/>
        <h2>SharedBalance</h2>

        <div className="menu">
          <span className={location.pathname === "/expenses" ? "active" : ""}onClick={() => navigate("/expenses")}>Expenses </span>
        <span className={location.pathname === "/history" ? "active" : ""}onClick={() => navigate("/history")}>History</span>
        <span className={location.pathname === "/profile" ? "active" : ""} onClick={() => navigate("/profile")}>Account</span>
        </div>
      </div>
    <div className="history-container">

      <div className="history-header">

        <div className="back-arrow" onClick={() => navigate("/dashboard")}>
          ←
        </div>

        <div>
          <h1>Transaction History</h1>
          <p>All your expense activities.</p>
        </div>

      </div>

      <div className="history-table">

        <div className="history-row header">
          <div>Group Name</div>
          <div>Name</div>
          <div>Transaction Type</div>
          <div>Date</div>
        </div>

        {transactions.map((t, index) => (
          <div className="history-row" key={index}>
            <div>{t.groupName}</div>
            <div>{t.name}</div>
            <div>{t.transactionType}</div>
            <div>{t.date}</div>
          </div>
        ))}

      </div>

    </div>
    </>
  );
}

export default History;