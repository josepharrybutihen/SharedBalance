import React, { useState } from "react";
import "../styles/expenses.css";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";

function Expenses() {

  const navigate = useNavigate();
  const location = useLocation();

  const [participants, setParticipants] = useState([]);
  const [participantName, setParticipantName] = useState("");
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");

  const addParticipant = () => {
    if (participantName.trim() === "") return;
    setParticipants([...participants, participantName]);
    setParticipantName("");
  };

  const calculateSplit = async () => {
    try {
      const res = await API.post("/expenses/calculate", {
        participants,
        payer,
        amount
      });

      alert("Split result: " + JSON.stringify(res.data.payload));
    } catch (err) {
      alert("Calculation failed");
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
    <div className="expenses-container">

      {/* HEADER */}
      <div className="expenses-header">

        {/* BACK BUTTON */}
        <div className="back-button" onClick={() => navigate("/dashboard")}>
          ←
        </div>

        <div>
          <h1>All Expenses</h1>
          <p>Track and manage your expenses</p>
        </div>

      </div>

      <div className="expenses-card">

        <label>Participants</label>

        <div className="participant-input">
          <input
            type="text"
            placeholder="Add participants"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
          />
          <button onClick={addParticipant}>+</button>
        </div>

        <ul className="participant-list">
          {participants.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        <div className="expense-row">

          <div className="input-group">
            <label>Paid the bill</label>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            >
              <option value="">Participant who paid</option>
              {participants.map((p, i) => (
                <option key={i}>{p}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Total Amount</label>
            <input
              type="number"
              placeholder="Enter total amount paid"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

        </div>

        <button className="calculate-btn" onClick={calculateSplit}>
          Calculate
        </button>

      </div>

    </div>
    </>
  );
}

export default Expenses;