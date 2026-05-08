import React, { useEffect, useState } from "react";
import "../styles/history.css";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";

function History() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const init = async () => {
      const res = await API.get("/users/profile");
      const email = res.data.payload.email;

      setUserEmail(email);

      const tRes = await API.get(`/transactions?email=${email}`);
      setTransactions(tRes.data.reverse());
    };

    init();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <img src={logo} alt="logo" className="logo-img" />
        <h2>SharedBalance</h2>

        <div className="menu">
          <span onClick={() => navigate("/expenses")}>Expenses</span>
          <span className="active">History</span>
          <span onClick={() => navigate("/profile")}>Account</span>
        </div>
      </div>

      <div className="history-container">

        <div className="history-header">
          <span className="back" onClick={() => navigate("/dashboard")}>←</span>
          <div>
            <h2>Transaction History</h2>
            <p>All your expense activities</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Name</th>
              <th>Transaction Type</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 ? (
              transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.groupName}</td>
                  <td>{t.name === userEmail ? "You" : t.name}</td>
                  <td>
                  {(() => {
                    const isPaid = t.transactionType.toLowerCase().includes("paid");
                    const isReceived = t.transactionType.toLowerCase().includes("received");

                    return (
                      <span
                        className={`txn-badge ${
                          isPaid ? "paid" : isReceived ? "received" : "expense"
                        }`}
                      >
                        {isPaid}
                        {isReceived}
                        {t.transactionType}
                      </span>
                    );
                  })()}
                </td>
                  <td>{t.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </>
  );
}

export default History;